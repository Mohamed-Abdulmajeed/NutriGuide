import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = `${environment.apiUrl}/api/`;
  constructor(private http: HttpClient) { }

  // 1. Register New User
  registerUser(userData: any): Observable<any> {
    userData.role = 'Customer';
    return this.http.post(`${this.baseUrl}Users/register`, JSON.stringify(userData), { headers: { 'Content-Type': 'application/json' }, });
  }

  // 2. Verify Email Code
  verifyEmailCode(email: string, code: string): Observable<any> {
    const body = { email, code };
    return this.http.post(`${this.baseUrl}Users/verify-email-code`, body);
  }

  // 3. Resend Verification Code
  // Note: Based on Swagger, it takes a string. We send it as JSON string or raw string depending on backend config.
  // Usually .NET accepts object keys, but if it's strictly [FromBody] string, we send it like this:
  resendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}Users/resend-code-Verification`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ---------addCustomer Request---------------------
  AddCustomer(BirthDate: string, Gender: string, Wieght: number, Hieght: number, ActivityLevel: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = {
      birthDate: BirthDate,
      gender: Gender,
      weight: Wieght,
      height: Hieght,
      activityLevel: ActivityLevel
    };
    return this.http.post<any>(this.baseUrl + "Customers/addCustomer", body, { headers });
  }



}