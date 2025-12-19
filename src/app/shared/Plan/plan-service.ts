import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IPlan } from '../../models/Plan/iplan';
import { GoalSyustemType } from '../../models/Profile/icustomer';
import { IShoppingList } from '../../models/Plan/shopping-list';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private _baseUrl = `${environment.apiUrl}/api/Plans/`;
  //---------- Cached Plans ----------
  private plansSubject = new BehaviorSubject<IPlan[] | null>(null);
  plans$ = this.plansSubject.asObservable();
  //----------
  private planSubject = new BehaviorSubject<IPlan | null>(null);
  currentplan$ = this.planSubject.asObservable();
  //----------


  constructor(private _http: HttpClient) { }
  //------------
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      }),
    };
  }
  // -----------------get All Plans--------------------------
  loadPlans(): Observable<IPlan[]> {
    if (this.plansSubject.value !== null) {
      return this.plans$ as Observable<IPlan[]>;
    }

    // trigger fetch and update the BehaviorSubject so subscribers to `plans$` get the data
    return this._http.get<IPlan[]>(this._baseUrl + 'GetAllCustomerPlan', this.getHeaders())
      .pipe(
        tap((plans) => this.plansSubject.next(plans)),
        catchError(this.handleError)
      );
  }
  // ---------getShoppingLists Request---------------------
  getShoppingList(planId: number): Observable<IShoppingList> {

    return this._http.get<IShoppingList>(this._baseUrl + "GetShoppingList?planid=" + planId, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // ---------getCurrentPlan Request---------------------
  getCurrentPlan(): Observable<IPlan> {
    if (this.planSubject.value !== null) {
      return this.currentplan$ as Observable<IPlan>;
    }
    return this._http.get<IPlan>(this._baseUrl + "GetCurrentPlan", this.getHeaders())
      .pipe(
        tap((plan) => this.planSubject.next(plan)),
        catchError(this.handleError)
      );
  }

  // ---------getGoalPlan Request---------------------
  private goalplanSubject = new BehaviorSubject<GoalSyustemType[] | null>(null);
  goalplan$ = this.goalplanSubject.asObservable();
  //----------

  getGoalPlan(): Observable<GoalSyustemType[]> {
    if (this.goalplanSubject.value !== null) {
      return this.goalplan$ as Observable<GoalSyustemType[]>;
    }
    return this._http.get<GoalSyustemType[]>(this._baseUrl + "GetAllGoalPlan", this.getHeaders())
      .pipe(
        tap((goals) => this.goalplanSubject.next(goals)),
        catchError(this.handleError)
      );
  }
  // ===================================



  // ---------getSystemTypePlan Request---------------------
  private systemTypeplanSubject = new BehaviorSubject<GoalSyustemType[] | null>(null);
  systemTypeplan$ = this.systemTypeplanSubject.asObservable();
  //----------

  getSystemTypePlan(): Observable<GoalSyustemType[]> {
    if (this.systemTypeplanSubject.value !== null) {
      return this.systemTypeplan$ as Observable<GoalSyustemType[]>;
    }
    return this._http.get<GoalSyustemType[]>(this._baseUrl + "GetAllSystemTypePlan", this.getHeaders())
      .pipe(
        tap((types) => this.systemTypeplanSubject.next(types)),
        catchError(this.handleError)
      );
  }




  //--------------addPlan---------------------------
  addPlan(plan: IPlan): Observable<any> {
    return this._http.post<any>(this._baseUrl + 'addPlan', plan, this.getHeaders())
      .pipe(
        tap(() => {
          this.refreshPlans();
        }),
        catchError(this.handleError)
      );
  }

  // ----------------------------------------------------
  refreshPlans() {
    this.plansSubject.next(null);
    this.planSubject.next(null);
  }






  // ----------------------------------------------------
  private handleError(error: HttpErrorResponse) {
    let message = '';
    if (error.status === 0) {
      message = 'Cannot connect to server. Please check your network.';
    } else if (error.status === 400) {
      message = 'Bad request. Please check your input.';
    } else if (error.status === 404) {
      message = 'Resource not found.';
    } else if (error.status === 401) {
      message = 'Unauthorized. Please login.';
    } else {
      message = `Error ${error.status}: ${error.message}`;
    }

    console.error(message); // للـ debugging
    return throwError(() => new Error(message)); // ترجع Error observable
  }
}
