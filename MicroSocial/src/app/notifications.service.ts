import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  public randomNotification(): void {

  }

  public sendNotificationToCheckedInUsers(user: number, activityId: number, date: Date): void {

  }
  public sendNotificationToOwnerUser(user: number, activityId: number): void {
    
  }
}
