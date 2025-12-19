import { Component } from '@angular/core';
import { IMeal } from '../../../models/Plan/iplan';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal-details-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-details-admin.html',
  styleUrl: './meal-details-admin.css',
})
export class MealDetailsAdmin {

  meal!: IMeal;
  constructor(private router: Router, private location: Location) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { meal: IMeal } | undefined;

    if (!state?.meal) {
      console.warn("Meal data not found, redirecting...");
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.meal = state.meal;
  }


  goBack(): void {
    this.location.back();
  }

}
