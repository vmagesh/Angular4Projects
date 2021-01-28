import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { WindowService } from './services/window.service';
import { CountdownModule } from 'ngx-countdown';
import { NgOtpInputModule } from 'ng-otp-input';
import { UserService, AuthService } from '@app/api-middleware';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HttpClientModule } from '@angular/common/http';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    LoginRoutingModule,
    InternationalPhoneNumberModule,
    CountdownModule,
    NgOtpInputModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    HttpClientModule
  ],
  declarations: [LoginComponent, PasswordStrengthComponent],
  providers: [WindowService, UserService, AuthService]
})
export class LoginModule {}
