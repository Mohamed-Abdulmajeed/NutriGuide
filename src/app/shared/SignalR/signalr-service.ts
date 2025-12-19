import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MedicineNotification } from '../../models/Notification/notificationList';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {


  private hubConnection!: signalR.HubConnection;
  public medicineReminder$ = new Subject<MedicineNotification>();
  private isStarted = false;
  public start() {
    if (this.isStarted) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/notificationHub`)
      .withAutomaticReconnect()
      .build();


    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        const id = localStorage.getItem('id');
        if (id) {
          this.hubConnection.invoke('JoinCustomerGroup', Number(id));
        }
        this.isStarted = true;
      })
      .catch(err => console.error('SignalR Error: ', err));

    this.hubConnection.off('MedicineReminder');


    this.hubConnection.on('MedicineReminder', (data: MedicineNotification) => {
      console.log('🔔 Notification received:', data);
      this.medicineReminder$.next(data);
    });
  }


}
