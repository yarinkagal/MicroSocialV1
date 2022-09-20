import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferencesComponent } from './preferences/preferences.component';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'home', component: HomeComponent },
  { path: 'qr-scanner', component: QrScannerComponent },
  { path: 'create-event', component: CreateEventComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
