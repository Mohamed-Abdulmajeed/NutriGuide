import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../../shared/Acount/login-service';
import { Router } from '@angular/router';
import { Alertnotification } from '../../../shared/alerts/alertnotification';

@Component({
  selector: 'app-reset-code',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-code.html',
  styleUrls: ['./reset-code.css'],
})
export class ResetCode implements OnInit {
  codeForm: FormGroup;
  email: string = '';
  isSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification); // Inject Service

  constructor() {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('resetEmail') || '';
    if (!this.email) {
      // Info Notification
      this.notificationService.showInfo('No email found. Please start over.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.codeForm.valid) {
      const code = this.codeForm.get('code')?.value;
      this.isSubmitting = true;

      this.loginService.verifyResetCode(this.email, code).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res) => {
          localStorage.setItem('resetCode', code);

          // Success Notification
          this.notificationService.showSuccess('Code verified successfully.');

          this.router.navigate(['/new-password']);
        },
        error: (err) => {
          console.error(err);
          // Error Notification
          this.notificationService.showError('Invalid code.');
        },
      });
    }
  }
}
