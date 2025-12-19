import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../shared/Acount/register-service';
import { Alertnotification } from '../../../shared/alerts/alertnotification';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css'],
})
export class VerifyEmail implements OnInit, OnDestroy {

  verifyForm: FormGroup;
  email: string = '';

  isSubmitting: boolean = false;

  resendDisabled: boolean = true; // يبدأ مفعل من البداية
  countdown: number = 120;         // يبدأ من 120 ثانية
  timerInterval: any;
  totalCountdown: number = 120;    // Store total for circle calculation

  radius: number = 50;
  circumference: number = 2 * Math.PI * 50;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registerService = inject(RegisterService);
  private notificationService = inject(Alertnotification);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('pendingEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.verifyForm.patchValue({ email: this.email });
    }

    // Initialize timer on component load
    this.initializeTimer();
  }

  initializeTimer(): void {
    const savedStart = localStorage.getItem('resendStartTime');
    let remaining = 120;

    if (savedStart) {
      const diff = Math.floor((Date.now() - Number(savedStart)) / 1000);
      remaining = 120 - diff > 0 ? 120 - diff : 0;
    } else {
      localStorage.setItem('resendStartTime', Date.now().toString());
    }

    this.countdown = remaining;
    this.totalCountdown = 120;
    this.resendDisabled = remaining > 0;

    // شغل العداد
    if (remaining > 0) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const { email, code } = this.verifyForm.value;
      this.isSubmitting = true;

      this.registerService.verifyEmailCode(email, code).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res) => {
          const token = res.token;
          localStorage.setItem("token", token);

          this.notificationService.showSuccess('Account verified successfully!');
          localStorage.removeItem('pendingEmail');

          this.router.navigate(['/complete-register']);
        },
        error: (err) => {
          console.error('Verification Failed', err);
          this.notificationService.showError('Invalid code or email. Please try again.');
        },
      });
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }

  resendCode() {
    const emailToResend = this.verifyForm.get('email')?.value;

    if (!emailToResend) {
      this.notificationService.showInfo('Please ensure the email field is filled.');
      return;
    }

    if (this.resendDisabled) return;

    this.registerService.resendVerificationCode(emailToResend).subscribe({
      next: () => {
        this.notificationService.showSuccess('Verification code resent to your email.');
        this.countdown = 120;
        this.resendDisabled = true;
        localStorage.setItem('resendStartTime', Date.now().toString());
        this.startTimer();
      },
      error: (err) => {
        console.error('Resend Failed', err);
        this.notificationService.showError('Failed to resend code.');
      },
    });
  }

  startTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Run timer outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      this.timerInterval = setInterval(() => {
        this.countdown--;

        // Force Angular to detect changes on every tick
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });

        if (this.countdown <= 0) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          this.resendDisabled = false;
          this.countdown = 0;
          localStorage.removeItem('resendStartTime');

          // Final update
          this.ngZone.run(() => {
            this.cdr.detectChanges();
          });
        }
      }, 1000);
    });
  }

  getStrokeDashOffset(): number {
    const progress = this.countdown / this.totalCountdown;
    return this.circumference * (1 - progress);
  }

  getTimerColor(): string {
    if (this.countdown > 60) return '#3b82f6'; // Blue
    if (this.countdown > 30) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }
}
