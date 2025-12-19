import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { AsideBar } from './components/aside-bar/aside-bar';
import { Footer } from './components/footer/footer';



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, AsideBar, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isSidebarOpen = true;
  isDarkMode = false;
  pageTitle = 'الصفحة الرئيسية';
  showLayout: boolean = true;

  constructor(private router: Router) {
    this.router.navigateByUrl('/login');

    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {

        this.pageTitle = this.getTitleFromUrl(event.urlAfterRedirects);

        const hiddenRoutes = [
          'admin-dashboard',
          'login',
          'register',
          'verify-email',
          'forgot-password',
          'reset-code',
          'new-password',
          'complete-register',
          'admin-meal-details',
          'admin-setting'
        ];

        this.showLayout = !hiddenRoutes.some(route =>
          event.urlAfterRedirects.includes(route)
        );
      }

      if (event instanceof NavigationError) {
        console.error('Route Error:', event.error);

        this.showLayout = false;
        this.pageTitle = 'Page Not Found';
      }

    });




  }
  // ==================================
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // Save to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    // Apply to body for global dark mode
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  ngOnInit() {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }

  }

  getTitleFromUrl(url: string): string {
    // تحويل URL للـ lowercase للتأكد من المطابقة
    const path = url.toLowerCase().split('?')[0]; // نتخلص من query params

    if (path.startsWith('/home')) return 'الصفحة الرئيسية';
    if (path.startsWith('/favorite')) return 'المفضلة';
    if (path.startsWith('/notification')) return 'الإشعارات';
    if (path.startsWith('/all-plans')) return 'عرض كل الخطط';
    if (path.startsWith('/add-plan')) return 'إنشاء خطة';
    if (path.startsWith('/plan-details')) return 'تفاصيل الخطة';
    if (path.startsWith('/shopping-list')) return 'قائمة التسوق';
    if (path.startsWith('/add-meal')) return 'اقتراح وجبة';
    if (path.startsWith('/meal-details')) return 'تفاصيل الوجبة';
    if (path.startsWith('/profile')) return 'الملف الشخصى';
    if (path.startsWith('/login')) return 'تسجيل الدخول';
    if (path.startsWith('/register')) return 'إنشاء حساب';

    return '';
  }

}
