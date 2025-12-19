import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../shared/Acount/login-service';
import { Alertnotification } from '../../../shared/alerts/alertnotification';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css'],
})
export class ForgetPassword {
  forgotForm: FormGroup;
  isSubmitting: boolean = false;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification); // Inject Service

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.get('email')?.value;

      this.isSubmitting = true;
      this.loginService.forgotPassword(email).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res) => {
          localStorage.setItem('resetEmail', email);

          // Success Notification
          this.notificationService.showSuccess('Reset code sent to your email.');

          this.router.navigate(['/reset-code']);
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('Error sending code. Please check the email.');
        },
      });
    }
  }
}
