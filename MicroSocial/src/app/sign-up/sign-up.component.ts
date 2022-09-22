import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent {

  public email:string = '';
  public password:string = '';  
  
  constructor(private http: HttpClient,
              private router: Router) { }
  
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      const user = {
        Email: this.email,
        Password: this.password
      };
      const req = this.http.post<boolean>('https://microsocial.azurewebsites.net/users/signUp', user);
      req.subscribe((response) => {
        if(response) {
          console.log("user signed up!");
          localStorage.setItem('user',user.Email);
          this.router.navigate(['/home']); 
        }
        else {
          console.log("user already exists");
        }
      });
    }
  }
}
