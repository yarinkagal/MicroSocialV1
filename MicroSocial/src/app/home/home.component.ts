import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(
    private readonly notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {

    const button = document.getElementById('notifications');
    if (button) {
        button.addEventListener('click', () => {
        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            this.notificationsService.randomNotification();
          }
        });
      })
    }

  }

}
