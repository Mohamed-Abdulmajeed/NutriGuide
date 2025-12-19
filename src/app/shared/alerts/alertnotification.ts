import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Alertnotification {
  // 1. Success Toast (Small notification in the corner)
  showSuccess(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end', // Top right corner
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: 'success',
      title: message,
    });
  }

  // 2. Error Popup (Centered modal)
  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#22c55e', // Matches your primary green color
    });
  }

  // 3. Info/Warning Toast
  showInfo(message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'info',
      title: message,
    });
  }


  // 
  showNotification(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
    // تشغيل الصوت عند وصول الإشعار
    this.notificationSound.play().catch(err => console.log(err));

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end', // أعلى يمين
      showConfirmButton: false,
      timer: 4000, // يختفي بعد 4 ثواني
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: { popup: 'modern-toast' }
    });

    Toast.fire({
      icon: type,
      title: message,
    });
  }

  private notificationSound = new Audio('https://res.cloudinary.com/dah6fk4zr/video/upload/v1766050022/notification_eaidys.wav');

}
