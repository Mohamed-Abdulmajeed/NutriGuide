import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../shared/Acount/login-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Alertnotification } from '../../../shared/alerts/alertnotification';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  isSubmitting: boolean = false;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private notificationService = inject(Alertnotification); // Inject Service

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginService.login(this.loginForm.value).pipe(finalize(() => { this.isSubmitting = false; })).subscribe(
        (response) => {
          const token = response.token;
          localStorage.setItem("token", token);
          const decoded: any = jwtDecode(token);
          const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
          console.log("ID:", id);
          localStorage.setItem("id", id);
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
        (err) => {
          const errorMsg = err.error?.message || 'Invalid email or password.';
          this.notificationService.showError(errorMsg);
        }
      );
    }


  }
}


