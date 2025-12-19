export interface INotificationList {
    id: number;
    title: string;
    message: string;
    type: string;
    scheduleTime: string;
    isRead: boolean;
}

export interface MedicineNotification {
    medicineName: string;
    option: string;
    time: string;
}

