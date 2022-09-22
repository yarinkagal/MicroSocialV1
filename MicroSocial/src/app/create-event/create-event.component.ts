import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Event } from '../profileData';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.less']
})
export class CreateEventComponent {

  public eventTime: string = '';
  public eventDate: Date = new Date();
  public eventCategory: string = '';

  constructor(private http: HttpClient,
              private router: Router) { 
  }

  eventTypes = [
    {value: 'basketball-0', viewValue: "Basketball game"},
    {value: 'music-1', viewValue: "Music Session"},
    {value: 'playDate-2', viewValue: "Play Date"},
    {value: 'workout-3', viewValue: "Workout"},
    {value: 'gameRoom-4', viewValue: "Game Room - Floor 3"},
    {value: 'bikeRide-5', viewValue: "Bike ride"},
    {value: 'seaWalk-6', viewValue: "Sea walk"}
  ];

  form: FormGroup = new FormGroup({
    eventCategory: new FormControl(''),
    eventDate: new FormControl(''),
    eventTime: new FormControl(''),
  });

  createEvent() {
    if (this.form.valid) {
      let date: string = '';
      if(this.eventDate.getUTCDate() < 10) {
        date += '0'
      }
      date += this.eventDate.getUTCDate().toString();
      if((this.eventDate.getUTCMonth()+1) < 10) {
        date += '0'
      }
      date += (this.eventDate.getUTCMonth()+1).toString();
      date += this.eventDate.getFullYear().toString();
      let time = this.eventTime;
      time = time.replace(':', '');

      const newEvent = <Partial<Event>>{
        category: this.eventTypes.filter(item => item.value === this.eventCategory)[0].viewValue,
        time: time,
        date: date,
        owner: localStorage.getItem('user')
      };
      const req = this.http.post<string>('https://microsocial.azurewebsites.net/events/addevent', newEvent);
      req.subscribe((response) => {
        if(response) {
          console.log("Event Created!");
          this.router.navigate(['/home']); 
        }
        else {
          console.log("Invalid event");
        }
      });
    }
  }
}
