import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPlan, IMeal } from '../../../models/Plan/iplan';
import { FavoriteService } from '../../../shared/Meal/favorite-service';
import { CommonModule } from '@angular/common';

interface MealsByDay {
  date: string;
  meals: IMeal[];
}

@Component({
  selector: 'app-details-plan',
  imports: [CommonModule],
  templateUrl: './details-plan.html',
  styleUrls: ['./details-plan.css']
})
export class DetailsPlan implements OnInit {

  plan!: IPlan;
  mealsByDay: MealsByDay[] = [];
  favoriteMeals: number[] = [];
  deleteTarget: number | null = null;

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { plan: IPlan } | undefined;

    if (!state?.plan) {
      console.warn("Plan data not found, redirecting...");
      this.router.navigate(['/all-plans']);
      return;
    }

    this.plan = state.plan;
  }

  ngOnInit(): void {
    this.groupMealsByDays();
    this.loadFavorites();
  }

  // ✅ تقسيم الوجبات حسب عدد الأيام
  private groupMealsByDays(): void {
    const totalDays = this.plan.numberOfDays;
    const mealsPerDay = this.plan.numberOfMeals;
    const allMeals = this.plan.meals;

    this.mealsByDay = []; // Reset

    for (let day = 0; day < totalDays; day++) {
      const start = day * mealsPerDay;
      const end = start + mealsPerDay;

      const dayMeals = allMeals.slice(start, end);

      // حساب تاريخ اليوم بناءً على startDate
      const date = new Date(this.plan.startDate);
      date.setDate(date.getDate() + day);

      this.mealsByDay.push({
        date: date.toISOString().substring(0, 10),
        meals: dayMeals
      });
    }
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

  // ---------------------
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

  // ---------------------

  goToMealDetails(meal: IMeal) {
    this.router.navigate(['/meal-details'], { state: { meal } });
  }

  goToShoppingList(planId: number) {
    this.router.navigate(['/shopping-list', planId]);
  }

  getPlanStats(plan: IPlan) {
    return [
      { title: 'الأيام', value: plan.numberOfDays, icon: 'fa-solid fa-calendar', bg: 'linear-gradient(135deg, #6C5CE7, #a29bfe)' },
      { title: 'الوجبات', value: plan.numberOfMeals, icon: 'fa-solid fa-bowl-food', bg: 'linear-gradient(135deg, #fdcb6e, #e17055)' },
      { title: 'السعرات', value: plan.dailyCalories, icon: 'fa-solid fa-fire', bg: 'linear-gradient(135deg, #E17055, #ff9f43)' },
      { title: 'الهدف', value: plan.goal, icon: 'fa-solid fa-bullseye', bg: 'linear-gradient(135deg, #f368e0, #ff9ff3)' },
      { title: 'النظام', value: plan.systemType, icon: 'fa-solid fa-apple-whole', bg: 'linear-gradient(135deg, #00cec9, #81ecec)' },
      { title: 'تاريخ البدء', value: plan.startDate, icon: 'fa-solid fa-calendar-days', bg: 'linear-gradient(135deg, #00b894, #55efc4)' }
    ];
  }
}
