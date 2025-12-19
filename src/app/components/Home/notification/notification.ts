import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../shared/Meal/notification-service';
import { Observable } from 'rxjs';
import { INotificationList } from '../../../models/Notification/notificationList';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {

  notifications$!: Observable<INotificationList[]>;

  constructor(
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notifications$ = this.notificationService.getNotification();
  }

  /* ===============================
     CLICK (بس غير المقروء)
     =============================== */
  onNotificationClick(notification: INotificationList): void {
    if (notification.isRead) return;
    this.markAsRead(notification.id);
  }

  markAsRead(notificationId: number): void {
    this.notificationService.updateNotificationStatus(notificationId)
      .subscribe(() => {
        this.loadNotifications();
        this.cd.detectChanges();
      });
  }

  /* ===============================
     ICON (حسب Title فقط)
     =============================== */
  getIcon(notification: INotificationList): string {
    switch (notification.title?.trim()) {
      case 'تذكير بالدواء':
        return 'fa-utensils';

      case 'الخطط':
        return 'fa-trophy';

      case 'الوزن':
        return 'fa-scale-balanced';

      default:
        return 'fa-bell';
    }
  }

  getIconBgClass(notification: INotificationList): string {
    switch (notification.title?.trim()) {
      case 'تذكير بالدواء':
        return 'alarm';

      case 'الخطط':
        return 'plan';

      case 'الوزن':
        return 'update';

      default:
        return 'default';
    }
  }

  /* ===============================
     MESSAGE CONTEXT
     =============================== */
  buildMessage(notification: INotificationList): string {

    // تذكير دواء
    if (notification.title === 'تذكير بالدواء') {
      return `${notification.message} ${this.getFoodText(notification.type)}`;
    }

    // الخطط
    if (notification.title === 'الخطط') {
      return notification.message;
    }

    // الوزن
    if (notification.title === 'الوزن') {
      return notification.message;
    }

    return notification.message;
  }

  getFoodText(type: string): string {
    switch (type?.trim()) {
      case 'Before-Food':
        return 'قبل الأكل';
      case 'After-Food':
        return 'بعد الأكل';
      case 'With-Food':
        return 'مع الأكل';
      default:
        return '';
    }
  }
}
