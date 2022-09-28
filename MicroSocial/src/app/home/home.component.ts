import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
import { HttpClient } from '@angular/common/http';
import { Event } from '../profileData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public checkInButtonValue: string = "Check In";

  public myEvents = <any>[];
  public events = <any>[];
  public eventIds = <any>[];

  constructor(
    private readonly notificationsService: NotificationsService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    //get my events
    this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/GetUsersEvents/' + localStorage.getItem('user')).subscribe((serverMyEvents) => {
      serverMyEvents.forEach((serverMyEvent) => {
        this.myEvents.push({
          category: serverMyEvent.category,
          date: serverMyEvent.date,
          time: serverMyEvent.time,
          id: serverMyEvent.id
        });
        this.eventIds.push(serverMyEvent.id.toString());
      })
    });

    //get all events
    this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/allEvents').subscribe((serverEvents) => {
      serverEvents.forEach((serverEvent) => {
          if (!this.eventIds.includes(serverEvent.id.toString())) { 
            this.events.push({
              category: serverEvent.category,
              date: serverEvent.date,
              time: serverEvent.time,
              id: serverEvent.id
            });
          }
      })
    });

    //get user information to check if he is checked in
    this.http.get<any>('https://microsocial.azurewebsites.net/users/GetUser/' + localStorage.getItem('user')).subscribe((userInfo) => {
      let isCheckedIn: boolean = userInfo.CheckedIn;
      this.checkInButtonValue = isCheckedIn ? "Check Out" : "Check In";
    });

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

  public onJoinEventClicked(eventId: string): void {
    console.log(eventId);
    this.http.post<Object>('https://microsocial.azurewebsites.net/events/addParticipants', { Id: eventId, ParticipantsList: [{ Email: localStorage.getItem('user') }] }).subscribe((obj) => {
      if (obj) {
        console.log("added to event");
        this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/GetUsersEvents/' + localStorage.getItem('user')).subscribe((serverMyEvents) => {
          this.myEvents = [];
          serverMyEvents.forEach((serverMyEvent) => {
            this.myEvents.push({
              category: serverMyEvent.category,
              date: serverMyEvent.date,
              time: serverMyEvent.time,
              id: serverMyEvent.id
            });
          })
        });
      }
      else {
        console.log("error adding to event");
      }
    });
  }

  public onLeaveEventClicked(eventId: string): void {
    console.log(eventId);
    this.http.post<Object>('https://microsocial.azurewebsites.net/events/removeParticipants', { Id: eventId, ParticipantsList: [{ Email: localStorage.getItem('user') }] }).subscribe((obj) => {
      if (obj) {
        console.log("removed from event");
        this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/GetUsersEvents/' + localStorage.getItem('user')).subscribe((serverMyEvents) => {
          this.myEvents = [];
          serverMyEvents.forEach((serverMyEvent) => {
            this.myEvents.push({
              category: serverMyEvent.category,
              date: serverMyEvent.date,
              time: serverMyEvent.time,
              id: serverMyEvent.id
            });
          })
        });
      }
      else {
        console.log("error removing from event");
      }
    });
  }

  public checkIn(): void {
    let checkedIn = this.checkInButtonValue === "Check In" ? true : false;
    this.http.post<any>('https://microsocial.azurewebsites.net/users/checkInOut', { Email: localStorage.getItem('user'), CheckedIn: checkedIn }).subscribe();
    if (this.checkInButtonValue === "Check In") {
      this.checkInButtonValue = "Check Out";
      console.log("Checked In");
    }
    else if (this.checkInButtonValue === "Check Out") {
      this.checkInButtonValue = "Check In";
      console.log("Checked out");
    }
    else {
      console.log("Checked in/ out failed");
    }
  }
}
