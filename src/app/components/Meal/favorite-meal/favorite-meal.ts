import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../../shared/Meal/favorite-service';
import { Observable } from 'rxjs';
import { IMeal } from '../../../models/Plan/iplan';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-meal',
  imports: [CommonModule],
  templateUrl: './favorite-meal.html',
  styleUrl: './favorite-meal.css',
})
export class FavoriteMeal implements OnInit {

  AllFavorite$: Observable<IMeal[]>;
  deleteTarget: number | null = null;
  constructor(private _favorite: FavoriteService,
    private router: Router
  ) {
    this.AllFavorite$ = this._favorite.favorites$;
  }

  ngOnInit() {
    this._favorite.refreshFavorites();
  }


  deleteFromFavorite(mealId: number) {
    this.deleteTarget = mealId;
    document.getElementById("confirmModal")?.classList.remove("hidden");
  }

  closeConfirm() {
    this.deleteTarget = null;
    document.getElementById("confirmModal")?.classList.add("hidden");
  }

  confirmDelete() {
    if (this.deleteTarget != null) {
      this._favorite.deleteFromFavorite(this.deleteTarget);
    }
    this.closeConfirm();
  }

  navigateToMealDetails(meal: IMeal) {
    this.router.navigate(['/meal-details'], { state: { meal } });
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
