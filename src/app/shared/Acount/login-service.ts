import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = `${environment.apiUrl}/api/Users/`;
  constructor(private http: HttpClient) { }

  // 1. Login
  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.baseUrl + "login", JSON.stringify(credentials), { headers })

  }

  // 2. Forgot Password (Initiate)
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}forgot-password`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Verify Reset Code
  verifyResetCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.baseUrl}reset-code-Verification`, body);
  }

  // 4. Reset Password (New Password)
  resetPassword(data: any): Observable<any> {
    // data should contain: { email, newPassword, code }
    return this.http.post(`${this.baseUrl}reset-password`, data);
  }


}
