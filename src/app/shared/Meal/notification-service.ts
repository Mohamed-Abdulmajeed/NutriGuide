import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { INotificationList } from '../../models/Notification/notificationList';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private _baseUrl = `${environment.apiUrl}/api/Customers/`;

  constructor(private _http: HttpClient) { }
  private notSubject = new BehaviorSubject<INotificationList[] | null>(null);
  notifications$ = this.notSubject.asObservable();

  // ---------Login Request---------------------
  getNotification(): Observable<INotificationList[]> {
    if (this.notSubject.value !== null) {
      return this.notifications$ as Observable<INotificationList[]>;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.get<INotificationList[]>(this._baseUrl + "getNotification", { headers });
  }

  updateNotificationStatus(notificationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });
    return this._http.put(`${this._baseUrl}updateNotification?NotId=${notificationId}`, null, { headers })
      .pipe(
        tap(() => {
          this.notSubject.next(null);
          // Optionally, you can update the local cache here if needed;
        }),
      );
  }
}
