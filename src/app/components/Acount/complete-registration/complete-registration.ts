import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alertnotification } from '../../../shared/alerts/alertnotification';
import { RegisterService } from '../../../shared/Acount/register-service';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-registration.html',
  styleUrls: ['./complete-registration.css'],
})
export class CompleteRegistration {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification);

  completeForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  activityLevels = [
    { label: 'خامل (تمرين قليل أو معدوم)', value: 1.2 },
    { label: 'نشيط قليلاً (1-3 أيام/أسبوع)', value: 1.375 },
    { label: 'نشيط باعتدال (3-5 أيام/أسبوع)', value: 1.55 },
    { label: 'نشيط جداً (6-7 أيام/أسبوع)', value: 1.725 },
    { label: 'نشيط للغاية (عمل بدني شاق)', value: 1.9 },
  ];

  constructor() {
    this.completeForm = this.fb.group({
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(500)]],
      activityLevel: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.completeForm.invalid) {
      this.completeForm.markAllAsTouched();
      this.notificationService.showError('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const val = this.completeForm.value;

    this.registerService
      .AddCustomer(
        val.birthDate,
        val.gender,
        Number(val.weight),
        Number(val.height),
        Number(val.activityLevel)
      )
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('تم إكمال الملف الشخصي بنجاح!');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorMsg = err.error?.message || 'حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.';
          this.errorMessage = errorMsg;
          this.notificationService.showError(errorMsg);
        },
      });
  }
}
