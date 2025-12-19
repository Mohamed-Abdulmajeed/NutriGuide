import { Routes } from '@angular/router';
import { HomePage } from './components/Home/home-page/home-page';
import { Profile } from './components/Home/profile/profile';
import { Register } from './components/Acount/register/register';
import { DetailsMeal } from './components/Meal/details-meal/details-meal';
import { FavoriteMeal } from './components/Meal/favorite-meal/favorite-meal';
import { Login } from './components/Acount/login/login';
import { GenerateMeal } from './components/Meal/generate-meal/generate-meal';
import { AllPlan } from './components/Plan/all-plan/all-plan';
import { GeneratePlan } from './components/Plan/generate-plan/generate-plan';
import { ShoppingList } from './components/Plan/shopping-list/shopping-list';
import { DetailsPlan } from './components/Plan/details-plan/details-plan';
import { Notification } from './components/Home/notification/notification';
import { ResetCode } from './components/Acount/reset-code/reset-code';
import { ForgetPassword } from './components/Acount/forget-password/forget-password';
import { NewPassword } from './components/Acount/new-password/new-password';
import { VerifyEmail } from './components/Acount/verify-email/verify-email';
import { CompleteRegistration } from './components/Acount/complete-registration/complete-registration';
import { AdminDashboard } from './components/Admin/admin-dashboard/admin-dashboard';
import { MealDetailsAdmin } from './components/Admin/meal-details-admin/meal-details-admin';
import { AdminSettings } from './components/Admin/admin-settings/admin-settings';

export const routes: Routes = [
    { path: 'Login', component: Login, 'title': 'Login' },
    { path: 'register', component: Register, 'title': 'Register' },
    { path: 'home', component: HomePage, 'title': 'Home' },
    { path: 'notification', component: Notification, 'title': 'Notification' },
    { path: 'profile', component: Profile, 'title': 'Profile' },
    { path: 'meal-details', component: DetailsMeal, 'title': 'Details Meal' },
    { path: 'Favorite', component: FavoriteMeal, 'title': 'Favorite' },
    { path: 'add-meal', component: GenerateMeal, 'title': 'Generate Meal' },
    { path: 'all-plans', component: AllPlan, 'title': 'All Plan' },
    { path: 'add-plan', component: GeneratePlan, 'title': 'Generate Plan' },
    { path: 'shopping-list/:planId', component: ShoppingList, 'title': 'Shopping List' },
    { path: 'plan-details', component: DetailsPlan, 'title': 'Details Plan' },

    { path: 'verify-email', component: VerifyEmail, 'title': 'Details Plan' },
    { path: 'complete-register', component: CompleteRegistration, 'title': 'Complete Registration' },

    { path: 'forgot-password', component: ForgetPassword, 'title': 'Forget Password' },
    { path: 'reset-code', component: ResetCode, 'title': 'Reset Code' },
    { path: 'new-password', component: NewPassword, 'title': 'New Password' },

    { path: 'admin-dashboard', component: AdminDashboard, 'title': 'Admin Dashboard' },
    { path: 'admin-meal-details', component: MealDetailsAdmin, 'title': 'Meal Details Admin' },
    { path: 'admin-setting', component: AdminSettings, 'title': 'Admin Settings' },

    { path: '**', component: Login, 'title': 'Login' }

];
