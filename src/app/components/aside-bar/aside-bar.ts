import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-aside-bar',
  imports: [CommonModule],
  templateUrl: './aside-bar.html',
  styleUrl: './aside-bar.css',
})
export class AsideBar {
  @Input() isOpen = true;
  @Input() currentPage: string = 'home';
  @Output() toggleSidebar = new EventEmitter<void>();
  notificationsSeen: boolean = false;
  showBellOnNotificationPageOnce: boolean = false;

  constructor(private router: Router) {
    // load persisted flag whether notifications page was seen before
    try {
      this.notificationsSeen = localStorage.getItem('notificationsSeen') === 'true';
    } catch (e) {
      this.notificationsSeen = false;
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.toLowerCase().split('?')[0]; // Remove query params
        // Extract route name from URL
        if (url === '/' || url === '/home' || url.startsWith('/home')) {
          this.currentPage = 'home';
          this.showBellOnNotificationPageOnce = false;
        } else if (url.startsWith('/favorite')) {
          this.currentPage = 'favorite';
          this.showBellOnNotificationPageOnce = false;
        } else if (url.startsWith('/notification')) {
          this.currentPage = 'notification';
          // If user opens notifications page and there are unread notifications
          // and they haven't seen the notifications page before, allow showing
          // the bell once on this first visit, then mark as seen.
          if (this.hasUnreadNotifications && !this.notificationsSeen) {
            this.showBellOnNotificationPageOnce = true;
            this.notificationsSeen = true;
            try {
              localStorage.setItem('notificationsSeen', 'true');
            } catch (e) {
              // ignore storage errors
            }
          } else {
            // Either no unread or already seen => do not show on notification page
            this.showBellOnNotificationPageOnce = false;
          }
        } else if (url.startsWith('/all-plans')) {
          this.currentPage = 'all-plans';
          this.showBellOnNotificationPageOnce = false;
        } else if (url.startsWith('/add-plan')) {
          this.currentPage = 'add-plan';
          this.showBellOnNotificationPageOnce = false;
        } else if (url.startsWith('/add-meal')) {
          this.currentPage = 'add-meal';
          this.showBellOnNotificationPageOnce = false;
        } else if (url.startsWith('/profile')) {
          this.currentPage = 'profile';
          this.showBellOnNotificationPageOnce = false;
        } else {
          this.currentPage = '';
          this.showBellOnNotificationPageOnce = false;
        }
      }
    });
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  notifications = [
    { id: 1, read: false },
    { id: 2, read: true }
  ];

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }

  get showBellIcon(): boolean {
    // Show only when there are unread notifications AND
    // we're on the notifications page AND this is the first visit
    if (!this.hasUnreadNotifications) return false;
    return this.currentPage === 'notification' && this.showBellOnNotificationPageOnce === true;
  }


}
