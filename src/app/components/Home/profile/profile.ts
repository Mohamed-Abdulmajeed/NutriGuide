import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProfileService } from '../../../shared/Profile/profile-service';
import { ICustomer, IMedcicine } from '../../../models/Profile/icustomer';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe, CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    CommonModule,
    DecimalPipe,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true,
})
export class Profile {
  private profileService = inject(ProfileService);

  private currentCustomerSubject = new BehaviorSubject<ICustomer | null>(null);
  currentCustomer$: Observable<ICustomer | null> = this.currentCustomerSubject.asObservable() as Observable<ICustomer>;


  selectedDisease: string = '';
  selectedAvoidFood: string = '';
  medicineTimes: string[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.profileService.getCustomer().subscribe(
      customer => this.currentCustomerSubject.next(customer),
      err => console.error('Error loading customer data:', err)
    );
  }

  // 


  activityLevels = [
    { label: 'خامل (تمرين قليل أو معدوم)', value: 1.2 },
    { label: 'نشيط قليلاً (1-3 أيام/أسبوع)', value: 1.375 },
    { label: 'نشيط باعتدال (3-5 أيام/أسبوع)', value: 1.55 },
    { label: 'نشيط جداً (6-7 أيام/أسبوع)', value: 1.725 },
    { label: 'نشيط للغاية (عمل بدني شاق)', value: 1.9 },
  ];
  getActivityLabel(value: number): string {
    const level = this.activityLevels.find(l => l.value === value);
    return level ? level.label : 'غير محدد';
  }


  // ------------------- NEW HELPER FUNCTION -------------------
  private _hideModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }

  // ------------------- Height/Weight/Activity Methods -------------------

  updateHeight(newHeight: number) {
    this.profileService.UpdateHieght(newHeight).subscribe({
      next: () => {
        console.log('Height updated successfully, re-fetching customer data for new metrics...');

        this.profileService.getCustomer().subscribe(
          customer => {
            this.currentCustomerSubject.next(customer);
            this._hideModal('editHeightModal');
            this.cd.detectChanges();
          },
          err => console.error('Error re-fetching customer data after height update:', err)
        );

      },
      error: (err) => console.error('Error updating height:', err)
    });
  }

  // =====================================
  updateActivity(newActivity: number) {

    if (isNaN(newActivity) || newActivity < 1 || newActivity > 5) {
      console.error('Invalid activity level input. Must be a decimal number between 1.000 and 5.000.');
      return;
    }

    this.profileService.UpdateActivity(newActivity).subscribe({
      next: () => {
        console.log('Activity updated successfully, re-fetching customer data for new metrics...');

        this.profileService.getCustomer().subscribe(
          customer => {
            this.currentCustomerSubject.next(customer);
            this._hideModal('editActivityModal');
            this.cd.detectChanges();

          },
          err => console.error('Error re-fetching customer data after activity update:', err)
        );
      },
      error: (err) => console.error('Error updating activity:', err)
    });
  }

  updateWeight(newWeight: number) {
    this.profileService.UpdateWieght(newWeight).subscribe({
      next: () => {
        console.log('Weight updated successfully, re-fetching customer data for new metrics...');

        this.profileService.getCustomer().subscribe(
          customer => {
            this.currentCustomerSubject.next(customer);
            this._hideModal('editWeightModal');
            this.cd.detectChanges();
          },
          err => console.error('Error re-fetching customer data after weight update:', err)
        );
      },
      error: (err) => console.error('Error updating weight:', err)
    });
  }

  // ------------------- Disease Methods -------------------

  addDisease(disease: string) {
    const trimmed = (disease || '').trim();
    if (!trimmed) {
      console.warn('Empty disease name — aborting addDisease.');
      return;
    }

    this.profileService.AddDisease(trimmed).subscribe({
      next: () => {
        console.log('Disease added successfully');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newDiseases = [...customer.chronicDiseases, trimmed];
          this.currentCustomerSubject.next({ ...customer, chronicDiseases: newDiseases });
        }
        this.selectedDisease = '';
        this._hideModal('addDiseaseModal');
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error adding disease:', err)
    });
  }

  editDisease(newDisease: string, oldDisease: string) {
    const trimmedNew = (newDisease || '').trim();
    const trimmedOld = (oldDisease || '').trim();

    if (!trimmedNew || !trimmedOld) {
      console.warn('Empty disease name found — aborting editDisease.');
      return;
    }

    this.profileService.UpdateDisease(trimmedNew, trimmedOld).subscribe({
      next: () => {
        console.log(`Disease updated successfully from '${trimmedOld}' to '${trimmedNew}'`);
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newDiseases = customer.chronicDiseases.map(d =>
            d === trimmedOld ? trimmedNew : d
          );
          this.currentCustomerSubject.next({ ...customer, chronicDiseases: newDiseases });
        }
        this.selectedDisease = '';
        this._hideModal('editDiseaseModal');
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error updating disease:', err)
    });
  }

  deleteDisease(disease: string) {
    this.profileService.deleteDisease(disease).subscribe({
      next: () => {
        console.log('Disease deleted successfully');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newDiseases = customer.chronicDiseases.filter(d => d !== disease);
          this.currentCustomerSubject.next({ ...customer, chronicDiseases: newDiseases });
        }
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error deleting disease:', err)
    });
  }

  // ------------------- Avoid Food Methods -------------------

  addAvoidFood(food: string) {
    const trimmed = (food || '').trim();
    if (!trimmed) {
      console.warn('Empty food name — aborting addAvoidFood.');
      return;
    }

    this.profileService.AddAvoidFood(trimmed).subscribe({
      next: () => {
        console.log('Avoid food added successfully');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newAvoidFoods = [...customer.avoidFoods, trimmed];
          this.currentCustomerSubject.next({ ...customer, avoidFoods: newAvoidFoods });
        }
        this.selectedAvoidFood = '';
        this._hideModal('addAvoidFoodModal');
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error adding avoid food:', err)
    });
  }

  editAvoidFood(newFood: string, oldFood: string) {
    const trimmedNew = (newFood || '').trim();
    const trimmedOld = (oldFood || '').trim();

    if (!trimmedNew || !trimmedOld) {
      console.warn('Empty food name found — aborting editAvoidFood.');
      return;
    }

    this.profileService.UpdateAvoidFood(trimmedNew, trimmedOld).subscribe({
      next: () => {
        console.log(`Avoid food updated successfully from '${trimmedOld}' to '${trimmedNew}'`);
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newAvoidFoods = customer.avoidFoods.map(f =>
            f === trimmedOld ? trimmedNew : f
          );
          this.currentCustomerSubject.next({ ...customer, avoidFoods: newAvoidFoods });
        }
        this.selectedAvoidFood = '';
        this._hideModal('editAvoidFoodModal');
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error updating avoid food:', err)
    });
  }

  deleteAvoidFood(food: string) {
    this.profileService.deleteAvoidFood(food).subscribe({
      next: () => {
        console.log('Avoid food deleted successfully');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newAvoidFoods = customer.avoidFoods.filter(f => f !== food);
          this.currentCustomerSubject.next({ ...customer, avoidFoods: newAvoidFoods });
        }
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error deleting avoid food:', err)
    });
  }

  // ------------------- Medicine Methods -------------------

  addTimeToMedicines(time: string) {
    if (!time) {
      console.warn('Empty time — aborting addTimeToMedicines.');
      return;
    }
    if (!this.medicineTimes.includes(time)) {
      this.medicineTimes = [...this.medicineTimes, time];
    }
    this.cd.detectChanges();

  }

  removeTimeFromMedicines(time: string) {
    this.medicineTimes = this.medicineTimes.filter(t => t !== time);
  }

  deleteMedicine(medicineName: string) {
    this.profileService.deleteMedicine(medicineName).subscribe({
      next: () => {
        console.log('Medicine deleted successfully');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newMedicines = customer.medicines.filter(m => m.medicineName !== medicineName);
          this.currentCustomerSubject.next({ ...customer, medicines: newMedicines });
        }
        this.cd.detectChanges();

      },
      error: (err) => console.error('Error deleting medicine:', err)
    });
  }

  addMedicine(medicineName: string, option: string, times: string[]) {

    if (!medicineName || !option || !times || times.length === 0) {
      console.error("الرجاء إدخال جميع حقول الدواء.");
      return;
    }

    console.log('Sending Medicine Request with:', {
      medicineName: medicineName,
      option: option,
      time: times
    });

    this.profileService.AddMedicine(medicineName, option, times).subscribe({
      next: () => {
        console.log('Medicine added successfully. Updating local data.');
        const customer = this.currentCustomerSubject.getValue();
        if (customer) {
          const newMedicine: IMedcicine = { medicineName, option, times: times };
          const newMedicines = [...customer.medicines, newMedicine];
          this.currentCustomerSubject.next({ ...customer, medicines: newMedicines });
        }
        this.medicineTimes = [];
        this._hideModal('addMedicineModal');
        this.cd.detectChanges();


      },
      error: (err) => console.error('Error adding medicine:', err)
    });
  }


}