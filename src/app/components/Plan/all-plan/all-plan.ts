import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../shared/Plan/plan-service';
import { Observable } from 'rxjs';
import { IPlan } from '../../../models/Plan/iplan';

@Component({
  selector: 'app-all-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-plan.html',
  styleUrls: ['./all-plan.css'],
})
export class AllPlan {

  AllPlan$: Observable<IPlan[]>;
  sortedPlans: IPlan[] = [];
  isLoading = true;
  hasError = false;

  constructor(private router: Router, private planService: PlanService, private cd: ChangeDetectorRef) {
    this.AllPlan$ = this.planService.loadPlans();
    // ------
    this.isLoading = true;

    this.AllPlan$.subscribe({
      next: (plans) => {
        this.sortedPlans = [...plans].sort(
          (a, b) =>
            new Date(b.startDate).getTime() -
            new Date(a.startDate).getTime()
        );
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // ngOnInit() {

  // }

  goToShoppingList(planId: number) {
    this.router.navigate(['/shopping-list', planId]);
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }


  goToDetails(plan: IPlan) {
    this.router.navigate(['/plan-details'], { state: { plan } });
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToAddPlan() {
    this.router.navigate(['/add-plan']);
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPlanStats(plan: IPlan) {
    return [
      {
        title: 'الأيام : ',
        value: plan.numberOfDays,
        icon: 'fa-solid fa-calendar',
        bg: 'linear-gradient(135deg, #6C5CE7, #a29bfe)'
      },
      {
        title: 'الوجبات : ',
        value: plan.numberOfMeals,
        icon: 'fa-solid fa-bowl-food',
        bg: 'linear-gradient(135deg, #fdcb6e, #e17055)'
      },
      {
        title: 'سعرات : ',
        value: plan.dailyCalories,
        icon: 'fa-solid fa-fire',
        bg: 'linear-gradient(135deg, #E17055, #ff9f43)'
      },
      {
        title: 'الهدف : ',
        value: plan.goal,
        icon: 'fa-solid fa-bullseye',
        bg: 'linear-gradient(135deg, #f368e0, #ff9ff3)'
      },
      {
        title: 'النظام: ',
        value: plan.systemType,
        icon: 'fa-solid fa-apple-whole',
        bg: 'linear-gradient(135deg, #00cec9, #81ecec)'
      },
      {
        title: '',
        value: plan.startDate,
        icon: 'fa-solid fa-calendar-days',
        bg: 'linear-gradient(135deg, #00b894, #55efc4)'
      }
    ];
  }
}
