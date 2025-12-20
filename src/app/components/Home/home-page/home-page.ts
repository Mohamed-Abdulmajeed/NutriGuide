import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, filter, map, Observable, of, take } from 'rxjs';
import { IMeal, IPlan } from '../../../models/Plan/iplan';
import { PlanService } from '../../../shared/Plan/plan-service';
import { ProfileService } from '../../../shared/Profile/profile-service';
import { ICustomer, WeightTracking } from '../../../models/Profile/icustomer';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../../../shared/Meal/favorite-service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  userProfile$: Observable<ICustomer>;
  currentPlan$: Observable<IPlan>;
  weightTrackingType: 'weekly' | 'monthly' = 'weekly';
  weightTracking$!: Observable<WeightTracking[]>;

  favoriteMeals: number[] = [];
  deleteTarget: number | null = null;
  filteredMeals$!: Observable<IMeal[]>;


  constructor(
    private router: Router,
    private _currentPlan: PlanService,
    private _profile: ProfileService,
    private favoriteService: FavoriteService,

  ) {
    this.currentPlan$ = this._currentPlan.getCurrentPlan();
    this.userProfile$ = this._profile.getCustomer().pipe(
      take(1),
      catchError(err => {
        this.router.navigate(['/complete-register']);
        return of(null);
      }),
      filter((user): user is ICustomer => user !== null)
    );
    this.setfilteredMeals();

    this.initWeightTracking();
  }

  ngOnInit() {
    this.loadFavorites();
  }

  private initWeightTracking() {
    this.weightTracking$ = this.userProfile$.pipe(
      map((customer: ICustomer) => {
        if (!customer.dailyWeights) return [];

        const allWeights = customer.dailyWeights.map((w: any) => ({
          date: w.date,
          weight: w.weight
        }));

        return this.getFilteredWeights(allWeights);
      })
    );
  }

  private getFilteredWeights(allWeights: WeightTracking[]): WeightTracking[] {
    if (this.weightTrackingType === 'weekly') {
      // Get last 7 days
      return allWeights.slice(-7);
    } else {
      // Monthly - get last 30 days or all available
      return allWeights.slice(-30);
    }
  }
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  }
  // ======================
  setfilteredMeals() {
    this.filteredMeals$ = this.currentPlan$.pipe(
      map(plan => {
        if (!plan || !plan.meals?.length) {
          return [];
        }

        // ======================
        const startDate = new Date(plan.startDate);
        const today = new Date();

        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - startDate.getTime();
        const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (dayIndex < 0 || dayIndex >= plan.numberOfDays) {
          return [];
        }

        // ======================
        const mealsPerDay = plan.numberOfMeals;

        const startIndex = dayIndex * mealsPerDay;
        const endIndex = startIndex + mealsPerDay;

        return plan.meals.slice(startIndex, endIndex);
      })
    );

  }


  //====================
  toggleTrackingType(type: 'weekly' | 'monthly') {
    this.weightTrackingType = type;
    this.initWeightTracking();
  }

  getMinWeight(weights: WeightTracking[]): number {
    if (!weights || weights.length === 0) return 0;
    return Math.min(...weights.map(w => w.weight));
  }

  getMaxWeight(weights: WeightTracking[]): number {
    if (!weights || weights.length === 0) return 0;
    return Math.max(...weights.map(w => w.weight));
  }

  getChartPoints(weights: WeightTracking[]): string {
    if (!weights || weights.length === 0) {
      // Return a flat line if no data
      return '40,160 560,160';
    }

    const maxWeight = Math.max(...weights.map(w => w.weight));
    const minWeight = Math.min(...weights.map(w => w.weight));
    const range = maxWeight - minWeight || 1;

    const width = 600;
    const height = 200;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const points = weights.map((w, i) => {
      const x = padding + (i / (weights.length - 1 || 1)) * chartWidth;
      const y = padding + ((maxWeight - w.weight) / range) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return points;
  }
  // ==================================
  toggleFavorite(meal: IMeal) {
    if (this.isFavorite(meal.id)) {
      this.deleteTarget = meal.id;
      document.getElementById("confirmModal")?.classList.remove("hidden");
    } else {
      this.favoriteService.AddFavoriteMeal(meal.id);
    }
  }

  // ---------------------
  closeConfirm() {
    this.deleteTarget = null;
    document.getElementById("confirmModal")?.classList.add("hidden");
  }

  confirmDelete() {
    if (this.deleteTarget != null) {
      this.favoriteService.deleteFromFavorite(this.deleteTarget);
    }
    this.closeConfirm();
  }

  private loadFavorites() {
    this.favoriteService.favorites$.subscribe(favs => {
      this.favoriteMeals = favs.map(m => m.id);
    });

    this.favoriteService.refreshFavorites();
  }

  isFavorite(mealId: number) {
    return this.favoriteMeals.includes(mealId);
  }



  // ==================================
  navigateToPlanDetails(plan: IPlan) {
    this.router.navigate(['/plan-details'], { state: { plan } });
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToMealDetails(meal: IMeal) {
    this.router.navigate(['/meal-details'], { state: { meal } });
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToAlternatives(meal: IMeal) {
    this.router.navigate(['/add-meal'], { state: { meal } });
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
