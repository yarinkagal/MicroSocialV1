import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.less']
})
export class CreateEventComponent {

  constructor() { 
  }

  eventTypes = [
    {value: 'basketball-0', viewValue: 'Basketball game'},
    {value: 'music-1', viewValue: 'Music Session'},
    {value: 'playDate-2', viewValue: 'Play Date'},
    {value: 'workout-3', viewValue: 'Workout'}
  ];

  form: FormGroup = new FormGroup({
    eventType: new FormControl(''),
    eventDate: new FormControl(''),
  });

  createEvent() {
    if (this.form.valid) {
      this.createEventEM.emit(this.form.value);
    }
  }

  @Output() createEventEM = new EventEmitter();

}
