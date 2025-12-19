import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { IMeal } from '../../../models/Plan/iplan';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FavoriteService } from '../../../shared/Meal/favorite-service';

@Component({
  selector: 'app-details-meal',
  imports: [CommonModule],
  templateUrl: './details-meal.html',
  styleUrl: './details-meal.css',
})
export class DetailsMeal implements OnInit, OnDestroy {
  meal!: IMeal;
  isFavorite = false;
  favoriteMeals: number[] = [];
  @HostBinding('class.host-dark') hostDark = false;
  private bodyObserver?: MutationObserver;

  constructor(private router: Router, private location: Location, private favoriteService: FavoriteService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { meal: IMeal } | undefined;

    if (!state?.meal) {
      console.warn("Meal data not found, redirecting...");
      this.router.navigate(['/plans']);
      return;
    }

    this.meal = state.meal;
    // initialize favorite state if present
    this.isFavorite = Boolean((this.meal as any).isFavorite);
    this.loadFavorites();
  }

  ngOnInit(): void {
    // initialize host-dark based on stored preference or body class
    try {
      this.hostDark = localStorage.getItem('darkMode') === 'true' || document.body.classList.contains('dark-mode');

      // observe body.class changes so component updates when toggle is clicked
      this.bodyObserver = new MutationObserver(() => {
        this.hostDark = document.body.classList.contains('dark-mode');
      });

      this.bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {
      // ignore (server-side rendering or restricted env)
    }
  }

  private loadFavorites() {
    this.favoriteService.favorites$.subscribe(favs => {
      this.favoriteMeals = favs.map(m => m.id);
      this.isFavorite = this.favoriteMeals.includes(this.meal.id);
    });

    this.favoriteService.refreshFavorites();
  }

  // احسب سعرات عرضية نصية
  getCaloriesText(): string {
    return `${this.meal.calories ?? 0} سعرة حرارية`;
  }

  goBack(): void {
    this.location.back();
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      // Show confirmation modal before delete
      document.getElementById("confirmModalMeal")?.classList.remove("hidden");
    } else {
      // optimistic UI update and add to favorites
      this.isFavorite = true;
      this.favoriteService.AddFavoriteMeal(this.meal.id);
    }
  }

  closeConfirm(): void {
    document.getElementById("confirmModalMeal")?.classList.add("hidden");
  }

  confirmDelete(): void {
    this.favoriteService.deleteFromFavorite(this.meal.id);
    // optimistic UI update
    this.isFavorite = false;
    this.closeConfirm();
  }

  async shareMeal(): Promise<void> {
    const url = window.location.href;
    const payload = {
      title: this.meal.name,
      text: `${this.meal.mealType ?? ''}\nالسعرات: ${this.meal.calories ?? 0}\nالبروتين: ${this.meal.protein ?? 0}ج\nالكربوهيدرات: ${this.meal.carbs ?? 0}ج\nالدهون: ${this.meal.fat ?? 0}ج`,
      url,
    } as any;

    const fullMessage = `${this.meal.name}\n${payload.text}\n${url}`;

    try {
      if ((navigator as any).share) {
        await (navigator as any).share(payload);
        return;
      }

      // Fallback: try to open mail client (many platforms will offer messaging options)
      const mailto = `mailto:?subject=${encodeURIComponent(this.meal.name)}&body=${encodeURIComponent(fullMessage)}`;
      window.location.href = mailto;
      return;

    } catch (err) {
      console.warn('مشاركة فشلت', err);
    }

    // Last fallback: copy full message to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullMessage);
        alert('تم نسخ تفاصيل الوجبة');
        return;
      }
    } catch (err) {
      console.warn('نسخ فشل', err);
    }

    // Final fallback prompt
    prompt('انسخ تفاصيل الوجبة:', fullMessage);
  }

  ngOnDestroy(): void {
    this.bodyObserver?.disconnect();
  }
}
