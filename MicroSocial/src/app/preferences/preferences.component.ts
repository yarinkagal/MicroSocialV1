import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profileData';

export class Preference {
  name: string;
  on: boolean

  constructor(name: string,on:boolean) {
    this.name = name;
    this.on = on;
  }
}
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.less']
})
export class PreferencesComponent implements OnInit {

  preferences: Preference[] | undefined;
  
  //= ["Basketball","Gym","Running","Sea walking","Dogs","Kids"];
  email = "";

  constructor(private http: HttpClient,
    private router: Router) { 

    }

  ngOnInit(): void {
    this.email = ProfileComponent.userEmail;
    const req = this.http.get<any>(`https://microsocial.azurewebsites.net/GetPreferences/${this.email}`);
      req.subscribe((response) => {
        if(response) {
          console.log("user prefernces " + JSON.stringify(response));
          this.preferences = response;

          // temp:
          // this.preferences = [{ name:"Basketball", on: true},{name:"Gym",on:false},
          // {name:"Running",on:false},{ name:"Sea walking",on:true},{name:"Dogs",on:true},
          // {name:"Kids",on:false}];
        }
        else {
          console.log("Invalid preferences");
        }
      });
  }

  onSkip(): void {
    this.router.navigate(['/home']); 
  }
}
