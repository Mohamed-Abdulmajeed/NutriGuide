import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs';
import { GoalSyustemType } from '../../../models/Profile/icustomer';
import { SettingService } from '../../../shared/Admin/setting-service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.css'],
  //   animations: [
  //     trigger('fadeAnimation', [
  //       transition(':enter', [
  //         style({ opacity: 0 }),
  //         animate('300ms ease-in', style({ opacity: 1 }))
  //       ]),
  //       transition(':leave', [
  //         animate('300ms ease-out', style({ opacity: 0 }))
  //       ])
  //     ]),
  //     trigger('slideAnimation', [
  //       transition(':enter', [
  //         style({ transform: 'translateY(-20px)', opacity: 0 }),
  //         animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  //       ])
  //     ]),
  //     trigger('itemAnimation', [
  //       transition(':enter', [
  //         style({ opacity: 0, transform: 'translateX(20px)' }),
  //         animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  //       ])
  //     ]),
  //     trigger('toastAnimation', [
  //       transition(':enter', [
  //         style({ transform: 'translateX(100%)', opacity: 0 }),
  //         animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  //       ]),
  //       transition(':leave', [
  //         animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  //       ])
  //     ])
  //   ]
})

export class AdminSettings implements OnInit, OnDestroy {
  tab: 'goals' | 'systems' = 'goals';

  // Goals state
  goals: GoalSyustemType[] = [];
  newGoalName = '';
  editOldGoal = '';
  editNewGoal = '';

  // Systems state
  systems: GoalSyustemType[] = [];
  newSystemName = '';
  editOldSystem = '';
  editNewSystem = '';

  // UI state
  loading = false;
  showConfirmModal = false;
  confirmMessage = '';
  toasts: Array<{ id: number; text: string; type: 'success' | 'error' }> = [];

  // Private fields
  private destroy$ = new Subject<void>();
  private nextToastId = 1;
  private pendingDeleteAction: (() => void) | null = null;

  constructor(
    private settingService: SettingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load goals and systems data from the server
   */
  private loadData(): void {
    this.loading = true;
    forkJoin({
      goals: this.settingService.getAllGoalPlan(),
      systems: this.settingService.getAllSystemTypePlan()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.goals = res.goals || [];
          this.systems = res.systems || [];
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading settings:', err);
          this.showToast('خطأ في تحميل البيانات', 'error');
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Add a new goal
   */
  addGoal(): void {
    if (!this.newGoalName.trim()) {
      this.showToast('يرجى إدخال اسم الهدف', 'error');
      return;
    }

    this.settingService.addGoalPlan({ name: this.newGoalName.trim() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newGoalName = '';
          this.showToast('تم إضافة الهدف بنجاح', 'success');
          this.loadData();
        },
        error: (err) => {
          console.error('Error adding goal:', err);
          this.showToast(err?.message || 'فشل في إضافة الهدف', 'error');
        }
      });
  }

  /**
   * Update an existing goal
   */
  updateGoal(): void {
    if (!this.editOldGoal || !this.editNewGoal) {
      this.showToast('يرجى اختيار هدفاً والقيام بالتعديل', 'error');
      return;
    }

    this.settingService.updateGoalPlan({ oldName: this.editOldGoal, newName: this.editNewGoal })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.editOldGoal = '';
          this.editNewGoal = '';
          this.showToast('تم تعديل الهدف بنجاح', 'success');
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating goal:', err);
          this.showToast(err?.message || 'فشل في تعديل الهدف', 'error');
        }
      });
  }

  /**
   * Delete a goal with confirmation
   */
  deleteGoal(name: string): void {
    this.confirmMessage = `هل أنت متأكد من حذف الهدف "${name}"؟`;
    this.pendingDeleteAction = () => {
      this.settingService.deleteGoalPlan(name)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('تم حذف الهدف بنجاح', 'success');
            this.loadData();
          },
          error: (err) => {
            console.error('Error deleting goal:', err);
            this.showToast(err?.message || 'فشل في حذف الهدف', 'error');
          }
        });
    };
    this.showConfirmModal = true;
  }

  /**
   * Add a new system type
   */
  addSystem(): void {
    if (!this.newSystemName.trim()) {
      this.showToast('يرجى إدخال اسم النظام', 'error');
      return;
    }

    this.settingService.addSystemTypePlan({ name: this.newSystemName.trim() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newSystemName = '';
          this.showToast('تم إضافة النظام بنجاح', 'success');
          this.loadData();
        },
        error: (err) => {
          console.error('Error adding system:', err);
          this.showToast(err?.message || 'فشل في إضافة النظام', 'error');
        }
      });
  }

  /**
   * Update an existing system type
   */
  updateSystem(): void {
    if (!this.editOldSystem || !this.editNewSystem) {
      this.showToast('يرجى اختيار نظاماً والقيام بالتعديل', 'error');
      return;
    }

    this.settingService.updateSystemTypePlan({ oldName: this.editOldSystem, newName: this.editNewSystem })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.editOldSystem = '';
          this.editNewSystem = '';
          this.showToast('تم تعديل النظام بنجاح', 'success');
          this.loadData();
        },
        error: (err) => {
          console.error('Error updating system:', err);
          this.showToast(err?.message || 'فشل في تعديل النظام', 'error');
        }
      });
  }

  /**
   * Delete a system type with confirmation
   */
  deleteSystem(name: string): void {
    this.confirmMessage = `هل أنت متأكد من حذف النظام "${name}"؟`;
    this.pendingDeleteAction = () => {
      this.settingService.deleteSystemTypePlan(name)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('تم حذف النظام بنجاح', 'success');
            this.loadData();
          },
          error: (err) => {
            console.error('Error deleting system:', err);
            this.showToast(err?.message || 'فشل في حذف النظام', 'error');
          }
        });
    };
    this.showConfirmModal = true;
  }

  /**
   * Navigate back to admin dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  /**
   * Switch between tabs
   */
  setTab(tab: 'goals' | 'systems'): void {
    if (this.tab !== tab) {
      this.tab = tab;
    }
  }

  /**
   * Show a toast notification
   */
  private showToast(text: string, type: 'success' | 'error' = 'success', duration = 3000): void {
    const id = this.nextToastId++;
    this.toasts.push({ id, text, type });
    this.cdr.markForCheck();

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  /**
   * Remove a toast notification
   */
  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index >= 0) {
      this.toasts.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  /**
   * Confirm deletion action
   */
  confirmDelete(): void {
    if (this.pendingDeleteAction) {
      this.pendingDeleteAction();
      this.pendingDeleteAction = null;
    }
    this.showConfirmModal = false;
    this.confirmMessage = '';
  }

  /**
   * Cancel deletion action
   */
  cancelConfirm(): void {
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.pendingDeleteAction = null;
  }
}
