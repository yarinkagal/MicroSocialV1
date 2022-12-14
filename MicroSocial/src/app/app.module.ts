import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PreferencesComponent } from './preferences/preferences.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips';

import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';

import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateEventComponent } from './create-event/create-event.component';
import { QrScannerDialogComponent } from './qr-scanner/qr-scanner-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NotificationsService } from './notifications.service';

@NgModule({
  declarations: [
    AppComponent,
    PreferencesComponent,
    SignInComponent,
    SignUpComponent,
    QrScannerComponent,
    CreateEventComponent,
    QrScannerDialogComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxScannerQrcodeModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
  ],
  providers: [
    MatDatepickerModule,
    NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
