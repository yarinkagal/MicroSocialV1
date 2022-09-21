import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../notifications.service';
import { HttpClient } from '@angular/common/http';
import { ProfileComponent, Event } from '../profileData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public checkInButtonValue: string = "Check In";

  myEvents = [
    {
      category: "Play date",
      date: "25.09.22",
      time: "10:30"
    }
  ]

  public events = [
    {
      category: "Basketball",
      date: "20.09.22",
      time: "now"
    },
    {
      category: "Play date",
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

    //get all events
    this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/allEvents').subscribe((serverEvents) => {
      serverEvents.forEach( (serverEvent) => {
        this.events.push({
          category: serverEvent.category,
          date: serverEvent.date,
          time: serverEvent.time
        });
    })});

    //get my events
    this.http.get<Event[]>('https://microsocial.azurewebsites.net/events/GetUsersEvents/' + ProfileComponent.userEmail).subscribe((serverMyEvents) => {
      serverMyEvents.forEach( (serverMyEvent) => {
        this.myEvents.push({
          category: serverMyEvent.category,
          date: serverMyEvent.date,
          time: serverMyEvent.time
        });
    })});

    //get user information to check if he is checked in
    this.http.get<any>('https://microsocial.azurewebsites.net/users/GetUser/' + ProfileComponent.userEmail).subscribe((userInfo) => {
      let isCheckedIn: boolean =  userInfo.CheckedIn;
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

  public onJoinEventClicked(eventId:string): void {
    console.log(eventId);
  }

  public checkIn(): void {
    let checkedIn = this.checkInButtonValue === "Check In" ? true : false;
    this.http.post<any>('https://microsocial.azurewebsites.net/users/checkInOut', { Email: ProfileComponent.userEmail, CheckedIn: checkedIn}).subscribe();
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
