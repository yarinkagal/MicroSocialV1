import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.less']
})
export class PreferencesComponent implements OnInit {

  preferences: any | undefined;
  
  email: string | null = '';

  constructor(private http: HttpClient,
    private router: Router) { 

    }

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    const req = this.http.get<any>(`https://microsocial.azurewebsites.net/users/GetUser/${this.email}`);  
      req.subscribe((response) => {
        if(response) {
          console.log("user prefernces " + JSON.stringify(response));
          this.preferences = response.preferences;
        }
        else {
          console.log("Invalid preferences");
        }
      });
  }

  chipControlOnSelect(event: any,preference: any) {
      this.preferences[preference] = event.selected;
  }

  public selectChip(item: MatChip) {
    item.selected = !item.selected;
  }

  saveAndProceed() {

    let data = {
      email: this.email,
      preferences: this.preferences
    };

    const req = this.http.put<any>('https://microsocial.azurewebsites.net/users/setPreferences', data);
    req.subscribe((response) => {
        console.log("preferences saved");
        
      this.router.navigate(['/home']); 
    });
  }

  onSkip(): void {
    this.router.navigate(['/home']); 
  }

  public keepOriginalOrder = (a: any, b: any) => a.key;
}
