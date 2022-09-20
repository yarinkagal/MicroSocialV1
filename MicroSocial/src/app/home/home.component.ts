import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  myEvents = [
    {
      eventType: "Play Date",
      eventDate: "25.09.22",
      eventTime: "10:30"
    }
  ]

  events = [
    {
      eventType: "Basketball",
      eventDate: "20.09.22",
      eventTime: "now"
    },
    {
      eventType: "Play Date",
      eventDate: "25.09.22",
      eventTime: "10:30"
    },
    {
      eventType: "Music Session",
      eventDate: "25.09.22",
      eventTime: "16:00"
    }
  ]

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
