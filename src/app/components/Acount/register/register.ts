import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../../shared/Acount/register-service';
import { Alertnotification } from '../../../shared/alerts/alertnotification';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  registerForm: FormGroup;
  isSubmitting: boolean = false;
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification); // Inject Service

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.registerService.registerUser(this.registerForm.value).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res) => {
          // Success Notification
          this.notificationService.showSuccess('Account created! Please verify your email.');

          localStorage.setItem('pendingEmail', this.registerForm.get('email')?.value);
          this.router.navigate(['/verify-email']);
        },
        error: (err) => {
          console.error('Full Error Object:', err);

          // Handle Error Message Logic
          let errorMessage = 'Registration failed.';

          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          else if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error?.title) {
            errorMessage = err.error.title;
          } else if (err.statusText) {
            errorMessage = err.statusText;
          }

          // Error Notification
          this.notificationService.showError(errorMessage);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
