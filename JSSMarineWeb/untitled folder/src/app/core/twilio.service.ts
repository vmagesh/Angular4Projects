import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { URLSearchParams } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  twilioserviceId: any;
  twilioAuthKey: any;
  twilioAuthToken: any;
  constructor(private httpClient: HttpClient) {
    this.twilioserviceId = environment.twilio.serviceId;
    this.twilioAuthKey = environment.twilio.appKey;
    this.twilioAuthToken = environment.twilio.authToken;
    console.log(this.twilioserviceId);
    console.log(this.twilioAuthKey);
    console.log(this.twilioAuthToken);
  }

  sendVoiceOtp(phoneno: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(this.twilioAuthKey + ':' + this.twilioAuthToken)
      })
    };
    console.log(httpOptions);
    phoneno = phoneno.replace('+', '');
    let body = `To=%2B${phoneno}&Channel=call`;
    console.log(body);
    return this.httpClient
      .post<any>(`https://verify.twilio.com/v2/Services/${this.twilioserviceId}/Verifications`, body, httpOptions)
      .pipe(
        tap((res: any) => {
          console.log(res);
        })
      );
  }

  verifyVoiceOtp(phoneno: any, otp: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(this.twilioAuthKey + ':' + this.twilioAuthToken)
      })
    };
    console.log(httpOptions);
    phoneno = phoneno.replace('+', '');
    let body = `To=%2B${phoneno}&Code=${otp}`;
    console.log(body);
    return this.httpClient
      .post<any>(`https://verify.twilio.com/v2/Services/${this.twilioserviceId}/VerificationCheck`, body, httpOptions)
      .pipe(
        tap((res: any) => {
          console.log(res);
        })
      );
  }
}
