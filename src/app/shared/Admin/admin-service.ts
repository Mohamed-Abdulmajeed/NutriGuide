import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { IAllCustomer } from '../../models/iall-customer';
import { ICustomer } from '../../models/Profile/icustomer';
import { IMeal } from '../../models/Plan/iplan';
import { IShoppingItem } from '../../models/Plan/shopping-list';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/Admins/`;

  constructor(private http: HttpClient) { }






  // ----

  // ----

  // ----

  // ----
  //=========================
  private customerSubject = new BehaviorSubject<IAllCustomer[] | null>(null);
  customers$ = this.customerSubject.asObservable();
  // ----
  getAllCustomers(): Observable<IAllCustomer[]> {
    if (this.customerSubject.value !== null) {
      return this.customers$ as Observable<IAllCustomer[]>;
    }

    return this.http.get<IAllCustomer[]>(this.apiUrl + "getAllCustomer", this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  //========================
  getCustomerById(id: number): Observable<ICustomer> {
    const headers = this.getHeaders();
    return this.http.get<ICustomer>(this.apiUrl + `getCustomerbyId/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }
  //==========================
  private favotiteMealsSubject = new BehaviorSubject<IMeal[] | null>(null);
  allFavoriteMeal$ = this.favotiteMealsSubject.asObservable();
  // ----
  getAllFavoriteMeals(): Observable<IMeal[]> {
    if (this.favotiteMealsSubject.value !== null) {
      return this.allFavoriteMeal$ as Observable<IMeal[]>;
    }
    return this.http.get<IMeal[]>(this.apiUrl + 'getAllFavoriteMeal', this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // =========================
  private avoidFoodSubject = new BehaviorSubject<string[] | null>(null);
  avoidFoods$ = this.avoidFoodSubject.asObservable();
  // ----
  getAllAvoidFoods(): Observable<string[]> {
    if (this.avoidFoodSubject.value !== null) {
      return this.avoidFoods$ as Observable<string[]>;
    }
    return this.http.get<string[]>(this.apiUrl + 'getAllAvoidFoods', this.getHeaders())
      .pipe(catchError(this.handleError));
  }
  // ============================
  private diseaseSubject = new BehaviorSubject<string[] | null>(null);
  diseases$ = this.diseaseSubject.asObservable();
  // ----
  getAllDiseases(): Observable<string[]> {
    if (this.diseaseSubject.value !== null) {
      return this.diseases$ as Observable<string[]>;
    }
    return this.http.get<string[]>(this.apiUrl + 'getAllDiseases', this.getHeaders())
      .pipe(catchError(this.handleError));
  }
  // ============================
  private MedicineSubject = new BehaviorSubject<string[] | null>(null);
  Medicine$ = this.MedicineSubject.asObservable();
  // ----
  getAllMedicines(): Observable<string[]> {
    if (this.MedicineSubject.value !== null) {
      return this.Medicine$ as Observable<string[]>;
    }
    return this.http.get<string[]>(this.apiUrl + 'getAllMedicines', this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // ===========================
  private ShoppingListSubject = new BehaviorSubject<IShoppingItem[] | null>(null);
  Shopping$ = this.ShoppingListSubject.asObservable();
  // ----
  getAllShoppingLists(): Observable<IShoppingItem[]> {
    if (this.ShoppingListSubject.value !== null) {
      return this.Shopping$ as Observable<IShoppingItem[]>;
    }
    return this.http.get<IShoppingItem[]>(this.apiUrl + 'getAllShoppingLists', this.getHeaders())
      .pipe(catchError(this.handleError));
  }
  // ==============================



  // helper: add auth header and content type
  //------------
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      }),
    };
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
