import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { ICustomer } from '../../models/Profile/icustomer';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _baseUrl = `${environment.apiUrl}/api/Customers/`;

  constructor(private _http: HttpClient) { }

  private customerSubject = new BehaviorSubject<ICustomer | null>(null);
  customer$ = this.customerSubject.asObservable();
  //----------





  // ---------getCustomer Request---------------------
  getCustomer(): Observable<ICustomer> {
    if (this.customerSubject.value !== null) {
      return this.customer$ as Observable<ICustomer>;
    }


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    return this._http.get<ICustomer>(this._baseUrl + "getCustomer", { headers })
      .pipe(catchError(this.handleError));
  }
  //--------------updateHieght---------------------------
  UpdateHieght(Hieght: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = Hieght;
    return this._http.put<any>(this._baseUrl + "updateHieght", body, { headers })
      .pipe(catchError(this.handleError));
  }
  //--------------updateActivity---------------------------
  UpdateActivity(Activity: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = Activity;
    return this._http.put<any>(this._baseUrl + "updateActivity", body, { headers })
      .pipe(catchError(this.handleError));
  }
  //--------------updateWieght---------------------------
  UpdateWieght(Wieght: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = Wieght;
    return this._http.put<any>(this._baseUrl + "updateWieght", body, { headers })
      .pipe(catchError(this.handleError));
  }

  //--------------addAvoidFood---------------------------
  AddAvoidFood(food: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.post<any>(this._baseUrl + "addAvoidFood", JSON.stringify(food), { headers })
      .pipe(catchError(this.handleError));
  }

  //--------------updateAvoidFood---------------------------
  UpdateAvoidFood(NewFood: string, OldFood: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = {
      newFood: NewFood,
      oldFood: OldFood
    };
    return this._http.put<any>(this._baseUrl + "updateAvoidFood", body, { headers })
      .pipe(catchError(this.handleError));
  }
  //----------------DeleteFood-----------------------
  deleteAvoidFood(Food: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.delete(this._baseUrl + `deleteAvoidFood?food=${Food}`, { headers })
      .pipe(catchError(this.handleError));
  }

  //--------------addDisease---------------------------
  AddDisease(Disease: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    return this._http.post<any>(this._baseUrl + "addDisease", JSON.stringify(Disease), { headers })
      .pipe(catchError(this.handleError));
  }

  //--------------updateDisease---------------------------
  UpdateDisease(NewDisease: string, OldDisease: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = {
      newDisease: NewDisease,
      oldDisease: OldDisease
    };
    return this._http.put<any>(this._baseUrl + "updateDisease", body, { headers })
      .pipe(catchError(this.handleError));
  }
  //---------------DeleteDisease------------------------
  deleteDisease(Disease: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.delete(this._baseUrl + `deleteDisease?disease=${Disease}`, { headers })
      .pipe(catchError(this.handleError));
  }
  //--------------addMedicine---------------------------
  AddMedicine(MedicineName: string, Option: string, Times: string[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = {

      medicineName: MedicineName,
      option: Option,
      times: Times
    };
    return this._http.post<any>(this._baseUrl + "addMedicine", body, { headers })
      .pipe(
        tap(() => {
          this.refreshCustomer();
        }),
        catchError(this.handleError)
      );
  }

  //---------------DeleteDisease------------------------
  deleteMedicine(Medicine: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.delete(`${this._baseUrl}deleteMedicine?medicineName=${encodeURIComponent(Medicine)}`, { headers })
      .pipe(
        tap(() => {
          this.refreshCustomer();
        }),
        catchError(this.handleError)
      );
  }

  refreshCustomer() {
    this.customerSubject.next(null);
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
