import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GoalSyustemType } from '../../models/Profile/icustomer';
import { GoalPlan, SystemTypePlan } from '../../models/iall-customer';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private apiUrl = `${environment.apiUrl}/api/Plans/`;

  constructor(private http: HttpClient) { }

  // GoalPlan endpoints
  addGoalPlan(payload: { name: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'addGoalPlan', payload, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  updateGoalPlan(payload: { oldName: string; newName: string }): Observable<any> {
    return this.http.put(this.apiUrl + 'updateGoalPlan', payload, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  deleteGoalPlan(goalPlan: string): Observable<any> {
    const encoded = encodeURIComponent(goalPlan.trim());

    return this.http.delete(
      `${this.apiUrl}deleteGoalPlan?goalPlan=${encoded}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }


  getAllGoalPlan(): Observable<GoalSyustemType[]> {
    return this.http.get<GoalPlan[]>(this.apiUrl + 'getAllGoalPlan', { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  // System type endpoints
  addSystemTypePlan(payload: { name: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'addSystemTypePlan', payload, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateSystemTypePlan(payload: { oldName: string; newName: string }): Observable<any> {
    return this.http.put(this.apiUrl + 'updateSystemTypePlan', payload, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  deleteSystemTypePlan(systemType: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}deleteSystemTypePlan?systemType=${encodeURIComponent(systemType)}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }


  getAllSystemTypePlan(): Observable<SystemTypePlan[]> {
    return this.http.get<SystemTypePlan[]>(this.apiUrl + 'getAllSystemTypePlan', { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

  private handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.status === 0) message = 'Cannot connect to server.';
    else if (error.status === 400) message = 'Bad request.';
    else if (error.status === 404) message = 'Not found.';
    else if (error.status === 401) message = 'Unauthorized.';
    else message = `Error ${error.status}: ${error.message}`;

    console.error('SystemAndGoalService error:', error);
    return throwError(() => new Error(message));
  }
}
