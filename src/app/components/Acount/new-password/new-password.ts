import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../../shared/Acount/login-service';
import { Router } from '@angular/router';
import { Alertnotification } from '../../../shared/alerts/alertnotification';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-new-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-password.html',
  styleUrls: ['./new-password.css'],
})
export class NewPassword implements OnInit {
  passwordForm: FormGroup;
  email: string = '';
  code: string = '';
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification); // Inject Service

  constructor() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('resetEmail') || '';
    this.code = localStorage.getItem('resetCode') || '';

    if (!this.email || !this.code) {
      // Info Notification
      this.notificationService.showInfo('Session expired. Please start over.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;

      const resetData = {
        email: this.email,
        code: this.code,
        newPassword: newPassword,
      };

      this.isSubmitting = true;
      this.loginService.resetPassword(resetData).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('Password reset successfully! You can now login.');

          localStorage.removeItem('resetEmail');
          localStorage.removeItem('resetCode');

          const token = res.token;
          localStorage.setItem("token", token);
          const decoded: any = jwtDecode(token);
          const role =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          console.log("ROLE:", role);
          if (role === "Admin") {
            this.router.navigate(['/admin-dashboard']);
          }
          else if (role === "Customer") {

            this.notificationService.showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          }
          else {
            this.router.navigate(['/']); // fallback
          }
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('Failed to reset password.');
        },
      });
    }
  }
}
