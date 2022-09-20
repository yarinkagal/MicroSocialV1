import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
import { HttpClient } from '@angular/common/http';

interface Event {
  id: string;
  maxParticipants: number;
  owner: string;
  category: string;
  time: string;
  date: string;
  //participantsList: List<User>;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  myEvents = [
    {
      category: "Play Date",
      date: "25.09.22",
      time: "10:30"
    }
  ]

  events = [
    {
      category: "Basketball",
      date: "20.09.22",
      time: "now"
    },
    {
      category: "Play Date",
      date: "25.09.22",
      time: "10:30"
    },
    {
      category: "Music Session",
      date: "25.09.22",
      time: "16:00"
    }
  ]

  constructor(
    private readonly notificationsService: NotificationsService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/allEvents').subscribe((events) => {
      events.forEach( (event) => {
        this.events.push({
          category: event.category,
          date: event.date,
          time: event.time
        });
    })});

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
