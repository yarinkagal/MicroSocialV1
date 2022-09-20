import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profileData';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.less']
})
export class PreferencesComponent implements OnInit {

  preferences: any[] = ["Basketball","Gym","Running","Sea walking","Dogs","Kids"];
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
        }
        else {
          console.log("Invalid user");
        }
      });
  }

}
