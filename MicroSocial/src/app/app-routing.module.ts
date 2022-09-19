import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferencesComponent } from './preferences/preferences.component';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'preferences', component: PreferencesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
