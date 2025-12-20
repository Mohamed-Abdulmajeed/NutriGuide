import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Alertnotification } from '../../shared/alerts/alertnotification';
import { SignalrService } from '../../shared/SignalR/signalr-service';
import { MedicineNotification } from '../../models/Notification/notificationList';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  @Input() pageTitle!: string;
  @Input() currentPage!: string;
  @Input() isDarkMode: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();

  private notificationService = inject(Alertnotification); // Inject Service
  notifications: MedicineNotification[] = [];


  constructor(private router: Router, private signalr: SignalrService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.toLowerCase().split('?')[0];
        if (url === '/' || url === '/home' || url.startsWith('/home')) {
          this.currentPage = 'home';
        } else if (url.startsWith('/profile')) {
          this.currentPage = 'profile';
        } else {
          this.currentPage = '';
        }
      }
    });
  }

  ngOnInit(): void {
    this.signalr.start();

    this.signalr.medicineReminder$.subscribe(notification => {
      if (!notification) return;

      this.notifications.unshift(notification);

      this.notificationService.showNotification(
        `تذكير: حان وقت تناول دوائك "${notification.medicineName}" (${notification.option}) الساعة ${notification.time}`,
        'info'
      );
    });
  }


  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    const container = document.querySelector('.content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
