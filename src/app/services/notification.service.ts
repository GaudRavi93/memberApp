import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  async scheduleNotification(title: string, body: string, scheduleTime: Date) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: 1,
          schedule: { at: scheduleTime },
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }
}
