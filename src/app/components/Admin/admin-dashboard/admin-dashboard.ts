import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAllCustomer } from '../../../models/iall-customer';
import { AdminService } from '../../../shared/Admin/admin-service';
import { CommonModule } from '@angular/common';
import { IMeal } from '../../../models/Plan/iplan';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IShoppingItem } from '../../../models/Plan/shopping-list';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  // ============ state ============
  statsLoaded = false; // show loading until main stats are ready
  errorMessages: string[] = [];

  // Header quick stats
  stats = {
    totalCustomers: 0,
    totalMeals: 0,
    shoppingItems: 0,
    avgMealCalories: 0,
  };

  // Tabs
  selectedTab: 'customers' | 'meals' | 'shopping' | 'diseases' | 'avoidFoods' | 'medicines' = 'customers';

  // Customers
  customerStats = {
    total: 0,
    avgAge: 0,
    avgWeight: 0,
    avgHeight: 0,
    avgBmi: 0,
    avgCalories: 0,
    avgActivity: 0,
    maleCount: 0,
    femaleCount: 0,
  };

  // Meals (favourite)
  mealStats: { meal: IMeal; count: number }[] = [];

  // Shopping products
  productsStats: { name: string; count: number; totalAmount: number; unit: string }[] = [];
  filteredProductsStats: { name: string; count: number; totalAmount: number; unit: string }[] = [];
  shoppingQuery = '';
  shoppingSort: 'count' | 'amount' | 'name' = 'count';
  productsMaxCount = 1;

  // Health: diseases / avoid foods / medicines
  diseasesStats: { name: string; count: number }[] = [];
  avoidFoodsStats: { name: string; count: number }[] = [];
  medicinesStats: { name: string; count: number }[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.loadMeals();
    this.loadShopping();
    this.loadDiseases();
    this.loadAvoidFoods();
    this.loadMedicines();
    this.cd.detectChanges();
  }

  // ========= data loading / aggregation =========

  private loadCustomers(): void {
    this.adminService.getAllCustomers().subscribe({
      next: (customers) => {
        this.stats.totalCustomers = customers.length;
        this.aggregateCustomerStats(customers);
        this.statsLoaded = true;
      },
      error: () => {
        this.errorMessages.push('Error loading customers');
      }
    });
  }

  private aggregateCustomerStats(customers: IAllCustomer[]): void {
    const total = customers.length || 0;
    if (!total) {
      this.customerStats = {
        total: 0, avgAge: 0, avgWeight: 0, avgHeight: 0,
        avgBmi: 0, avgCalories: 0, avgActivity: 0,
        maleCount: 0, femaleCount: 0
      };
      return;
    }

    let ageSum = 0;
    let weightSum = 0;
    let heightSum = 0;
    let bmiSum = 0;
    let caloriesSum = 0;
    let activitySum = 0;
    let male = 0;
    let female = 0;

    customers.forEach(c => {
      ageSum += c.age;
      weightSum += c.weight;
      heightSum += c.height;
      bmiSum += c.bmi;
      caloriesSum += c.calories;
      activitySum += c.activityLevel;

      const g = (c.gender || '').toLowerCase();
      if (g === 'male' || g === 'm' || g === 'ذكر') male++;
      else if (g === 'female' || g === 'f' || g === 'أنثى') female++;
    });

    this.customerStats = {
      total,
      avgAge: +(ageSum / total).toFixed(1),
      avgWeight: +(weightSum / total).toFixed(1),
      avgHeight: +(heightSum / total).toFixed(1),
      avgBmi: +(bmiSum / total).toFixed(1),
      avgCalories: +(caloriesSum / total).toFixed(1),
      avgActivity: +(activitySum / total).toFixed(2),
      maleCount: male,
      femaleCount: female,
    };
  }

  private loadMeals(): void {
    this.adminService.getAllFavoriteMeals().subscribe({
      next: (meals) => {
        this.stats.totalMeals = meals.length;
        this.aggregateMeals(meals);
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessages.push('Error loading meals');
      }
    });
  }

  private aggregateMeals(meals: IMeal[]): void {
    if (!meals?.length) {
      this.mealStats = [];
      this.stats.avgMealCalories = 0;
      return;
    }

    const map = new Map<number, { meal: IMeal; count: number }>();
    let caloriesSum = 0;

    meals.forEach(m => {
      caloriesSum += m.calories || 0;
      const existing = map.get(m.id);
      if (existing) {
        existing.count++;
      } else {
        map.set(m.id, { meal: m, count: 1 });
      }
    });

    this.mealStats = Array.from(map.values())
      .sort((a, b) => b.count - a.count);

    this.stats.avgMealCalories = +(caloriesSum / meals.length).toFixed(1);
  }

  private loadShopping(): void {
    this.adminService.getAllShoppingLists().subscribe({
      next: (items) => {
        this.stats.shoppingItems = items.length;
        this.aggregateShopping(items);
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessages.push('Error loading shopping list');
      }
    });
  }

  private aggregateShopping(items: IShoppingItem[]): void {
    if (!items?.length) {
      this.productsStats = [];
      this.filteredProductsStats = [];
      this.productsMaxCount = 1;
      return;
    }

    const map = new Map<string, { name: string; count: number; totalAmount: number; unit: string }>();

    items.forEach(it => {
      const key = `${it.ingredientName}__${it.unit}`;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
        existing.totalAmount += it.amount || 0;
      } else {
        map.set(key, {
          name: it.ingredientName,
          count: 1,
          totalAmount: it.amount || 0,
          unit: it.unit,
        });
      }
    });

    this.productsStats = Array.from(map.values())
      .sort((a, b) => b.count - a.count);

    this.productsMaxCount = this.productsStats[0]?.count || 1;
    this.applyShoppingFilter();
  }

  private loadDiseases(): void {
    this.adminService.getAllDiseases().subscribe({
      next: (list) => {
        this.diseasesStats = this.aggregateStringList(list);
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessages.push('Error loading diseases');
      }
    });
  }

  private loadAvoidFoods(): void {
    this.adminService.getAllAvoidFoods().subscribe({
      next: (list) => {
        this.avoidFoodsStats = this.aggregateStringList(list);
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessages.push('Error loading avoid foods');
      }
    });
  }

  private loadMedicines(): void {
    this.adminService.getAllMedicines().subscribe({
      next: (list) => {
        this.medicinesStats = this.aggregateStringList(list);
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessages.push('Error loading medicines');
      }
    });
  }

  private aggregateStringList(list: string[]): { name: string; count: number }[] {
    if (!list?.length) return [];
    const map = new Map<string, number>();
    list.forEach(item => {
      const key = (item || '').trim();
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // ========= UI actions =========

  selectTab(tab: 'customers' | 'meals' | 'shopping' | 'diseases' | 'avoidFoods' | 'medicines'): void {
    this.selectedTab = tab;
  }

  openMealDetails(meal: IMeal): void {
    this.router.navigate(['/admin-meal-details'], { state: { meal } });
  }

  // Shopping search / sort
  applyShoppingFilter(): void {
    const q = (this.shoppingQuery || '').trim().toLowerCase();
    let list = [...this.productsStats];

    if (q) {
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    if (this.shoppingSort === 'count') {
      list.sort((a, b) => b.count - a.count);
    } else if (this.shoppingSort === 'amount') {
      list.sort((a, b) => b.totalAmount - a.totalAmount);
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProductsStats = list;
  }
}
