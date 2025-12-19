import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeal } from '../../models/Plan/iplan';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  private _baseUrl = `${environment.apiUrl}/api/Meals/`;
  private favoritesSubject = new BehaviorSubject<IMeal[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private _http: HttpClient) { }

  refreshFavorites() {
    const headers = this.getHeaders();
    this._http.get<IMeal[]>(this._baseUrl + "GetAllFavorite", { headers })
      .pipe(catchError(this.handleError))
      .subscribe(res => this.favoritesSubject.next(res));
  }

  // --------------------------
  // حذف مع تحديث فوري
  deleteFromFavorite(mealId: number) {
    const headers = this.getHeaders();
    // تحديث فوري
    const newList = this.favoritesSubject.value.filter(m => m.id !== mealId);
    this.favoritesSubject.next(newList);

    this._http.delete(this._baseUrl + `deleteFavorite?mealId=${mealId}`, { headers })
      .pipe(catchError(this.handleError))
      .subscribe(() => this.refreshFavorites());
  }

  // --------------------------
  // إضافة مع تحديث فوري
  AddFavoriteMeal(mealId: number) {
    const headers = this.getHeaders();

    // تحديث فوري
    const current = this.favoritesSubject.value;
    this.favoritesSubject.next([...current, { id: mealId } as IMeal]);

    return this._http.post<any>(
      this._baseUrl + "addFavorite",
      mealId,
      { headers }
    )
      .pipe(catchError(this.handleError))
      .subscribe({
        next: () => this.refreshFavorites(),
        error: (err) => console.log("ERROR IN ADD FAVORITE = ", err)
      });
  }
  //--------------addMeal---------------------------
  AddMeal(meal: IMeal) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    const body = meal;
    return this._http.post<any>(this._baseUrl + "AddMeal", body, { headers })
      .pipe(
        tap(() => {
          this.refreshFavorites();
        }),
        catchError(this.handleError)
      );
  }




  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
  }

  private handleError(error: HttpErrorResponse) {
    let message = '';

    if (error.status === 0) message = 'Cannot connect to server.';
    else if (error.status === 400) message = 'Bad request.';
    else if (error.status === 404) message = 'Not found.';
    else if (error.status === 401) message = 'Unauthorized.';
    else message = `Error ${error.status}: ${error.message}`;

    return throwError(() => new Error(message));
  }
}
