import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { AesService } from './aes.service';
import { Router } from '@angular/router';
import { UserService, Configuration } from '../../api-middleware';
import { environment } from '@env/environment';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

export interface LoginContext {
  user_id: string;
  app_key: string;
  code: string;
  phno: string;
  jwt_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public defaultHeaders = new HttpHeaders();

  constructor(
    private http: Http,
    private aes: AesService,
    private router: Router,
    private userService: UserService,
    private credentialsService: CredentialsService,
    protected httpClient: HttpClient
  ) {}
  login(context: LoginContext, remember: boolean): Observable<Credentials> {
    this.credentialsService.setCredentials(context, remember);
    return of(context);
  }

  logout(): Observable<boolean> {
    this.credentialsService.setCredentials();
    return of(true);
  }

  public obj = {
    device_os: '2',
    device_os_version: 'android',
    device_make: 'google',
    device_model: 'lenevo',
    tnc_version_id: 'v1.1'
  };
  public enable: boolean = false;
  verified: boolean = false;
  app_key: string;
  captcha: any;
  result: any;
  phno: any;

  get_otp(code: any, phno: any) {
    var obj: any = this.newDeviceObj();
    localStorage.setItem('phno', phno);
    obj.country_code = code;
    obj.phone_number = phno;
    var final = this.aes.encrypt(obj);
    console.log({ inputData: final });
    console.log(obj);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/createregistration.php', { inputData: final });
  }

  web_verify_number(data: any) {
    let headers = this.defaultHeaders;
    // authentication (Bearer) required
    if (environment.API_KEY) {
      headers = headers.set('Authorization', 'Basic ' + environment.API_KEY);
    }
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code;
    obj.phone_number = data.phone_number;
    console.log(obj);
    return this.httpClient.post(environment.API_URL + '/v1/user/web-app/verify-phone-number', obj, {
      headers: headers
    });
  }

  web_crete_registration(data: any) {
    let headers = this.defaultHeaders;
    // authentication (Bearer) required
    if (environment.API_KEY) {
      headers = headers.set('Authorization', 'Basic ' + environment.API_KEY);
    }
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code;
    obj.phone_number = data.phone_number;
    obj.app_version = 'V10.12';
    obj.device_os = 1;
    obj.device_os_version = 12.1;
    obj.device_make = 'Google';
    obj.device_model = 'Motorola Moto G (4)';
    obj.device_id = 'fhzt_km5TGY:bFG0SSzinqD-4rUcQa-brq5bI4Luc_2iV-9gbcfo';
    console.log(obj);
    return this.httpClient.post(environment.API_URL + '/v1/user/create-registration', obj, {
      headers: headers
    });
  }

  web_sign_up(data: any) {
    let headers = this.defaultHeaders;
    // authentication (Bearer) required
    if (environment.API_KEY) {
      headers = headers.set('Authorization', 'Basic ' + environment.API_KEY);
    }
    console.log(data);
    var obj: any = {};
    obj.country_code = data.code;
    obj.phone_number = data.phone_number;
    obj.app_version = 'V10.12';
    obj.device_os = 1;
    obj.device_os_version = 12.1;
    obj.device_make = 'Google';
    obj.device_model = 'Motorola Moto G (4)';
    obj.device_id = 'fhzt_km5TGY:bFG0SSzinqD-4rUcQa-brq5bI4Luc_2iV-9gbcfo';
    obj.app_key = localStorage.getItem('app_key');
    obj.login_method = 1;
    obj.login_id = '';
    obj.email_id = data.email;
    obj.pin = 8761;
    obj.user_password = data.password;
    obj.time_zone = 'N/A';

    console.log(obj);
    return this.httpClient.post(environment.API_URL + '/v1/user/web-app/set-login', obj, {
      headers: headers
    });
  }

  register_user(user: any) {
    var data = user.value;
    console.log(data);
    var obj: any = this.obj;
    obj.country_code = +data.country_code;
    obj.phone_number = +data.phone_number;
    obj.app_key = localStorage.getItem('app_key');
    // obj.user_otp=data.user_otp
    obj.user_otp = '123456'; //chnage later
    obj.device_id = 'web-app';
    obj.time_zone = '';
    obj.pin = +data.password;
    console.log(obj);
    var final = this.aes.encrypt(obj);
    this.http.post(environment.API_URL + '/apisV1/userinfo/setpin.php', { inputData: final }).subscribe((res: any) => {
      // console.log(this.aes.decrypt(rex.text())).status_code)
      var val = this.aes.decrypt(res.text());
      localStorage.setItem('user_id', val.res_data.user_id);
      if (val.status_code == 200) this.router.navigateByUrl('/calendar');
    });
  }

  registerUser(data: any) {
    console.log(data);
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code.toString();
    obj.phone_number = data.phno.toString();
    obj.app_key = localStorage.getItem('app_key');
    obj.login_method = data.login_method;
    obj.login_id = data.login_id;
    obj.email_id = data.email_id;
    obj.device_id = 'web-app';

    // obj.time_zone=""
    // obj.pin=+data.password
    console.log(obj);
    var final = this.aes.encrypt(obj);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/setlogin.php', { inputData: final });
  }

  loginUser(data: any) {
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code.toString();
    obj.phone_number = data.phno.toString();
    obj.app_key = localStorage.getItem('app_key');
    obj.login_method = data.login_method;
    obj.login_id = data.login_id;
    obj.email_id = data.email_id;
    obj.pin = data.password;

    var final = this.aes.encrypt(obj);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/verifyloginandregister.php', { inputData: final });
  }

  verifypin(user: any) {
    var data = user.value;
    console.log(data);
    var obj: any = this.obj;
    obj.country_code = +data.country_code;
    obj.phone_number = +data.phone_number;
    obj.app_key = localStorage.getItem('app_key');
    // obj.user_otp=data.user_otp
    obj.user_otp = '123456'; //chnage later
    obj.device_id = 'web-app';
    obj.time_zone = '';
    obj.pin = data.password;
    console.log(obj);
    var final = this.aes.encrypt(obj);
    // console.log(final)
    this.http
      .post(environment.API_URL + '/apisV1/userinfo/verifypinandregister.php', { inputData: final })
      .subscribe((res: any) => {
        console.log(this.aes.decrypt(res.text()));
        var val = this.aes.decrypt(res.text());
        localStorage.setItem('user_id', val.res_data.user_id);
        if (val.status_code == 200) this.router.navigateByUrl('/calendar');
      });
  }

  get isLoggedIn(): boolean {
    const app_key = localStorage.getItem('app_key');
    const user_id = localStorage.getItem('user_id');
    return app_key !== null && user_id !== null ? true : false;
  }

  updateProfile(user: any) {
    var data = user.profile;
    console.log(data);
    var obj: any = this.newDeviceObj();
    obj.user_id = localStorage.getItem('user_id');
    obj.first_name = data.given_name;
    obj.app_key = localStorage.getItem('app_key');
    // obj.user_otp=data.user_otp
    obj.last_name = data.family_name; //chnage later
    obj.user_status = 'Available';
    obj.profile_pic_id = data.picture;
    obj.created_at_phone_timestamp = Date.now();
    var final = this.aes.encrypt(obj);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/profileupdate.php', { inputData: final });
  }

  getProfileInfo() {
    return this.userService.userProfileGet();
  }

  getPrfilePic(number: any): Observable<HttpResponse<any>> {
    return this.userService.userProfilePicDownloadRequestContactNumberGet(number);
  }

  registerWebUser(data: any) {
    console.log(data);
    var obj: any = {};

    obj.country_code = data.code;
    obj.phone_number = data.phno;
    obj.login_method = 1;
    obj.login_id = '';
    obj.email_id = data.email;
    obj.user_password = data.password;
    obj.app_key = localStorage.getItem('app_key');
    obj.device_id = 'web-app';
    obj.device_os = '2';
    obj.device_os_version = 'andriod';
    obj.device_make = 'google';
    obj.device_model = 'pixel';
    console.log(obj);
    var final = this.aes.encrypt(obj);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/webappsetlogin.php', { inputData: final });
  }

  loginWebUser(data: any) {
    let headers = this.defaultHeaders;
    // authentication (Bearer) required
    if (environment.API_KEY) {
      headers = headers.set('Authorization', 'Basic ' + environment.API_KEY);
    }
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code;
    obj.phone_number = data.phone_number;
    obj.user_password = data.password;
    console.log(obj);
    return this.httpClient.post(environment.API_URL + '/v1/user/web-app/login', obj, {
      headers: headers
    });
  }

  setPasswordWebUser(data: any) {
    let headers = this.defaultHeaders;
    // authentication (Bearer) required
    if (environment.API_KEY) {
      headers = headers.set('Authorization', 'Basic ' + environment.API_KEY);
    }
    var obj: any = this.newDeviceObj();
    obj.country_code = data.code;
    obj.phone_number = data.phone_number;
    obj.new_password = data.password;
    obj.email_id = data.email;
    console.log(obj);
    return this.httpClient.post(environment.API_URL + '/v1/user/web-app/update-password', obj, {
      headers: headers
    });
  }

  getAutheToken() {
    const obj = {
      app_key: localStorage.getItem('app_key'),
      user_id: localStorage.getItem('user_id')
    };
    console.log(obj);
    var final = this.aes.encrypt(obj);
    return this.http.post('http://68.183.170.212/auth/token', { inputData: final });
  }

  private newDeviceObj() {
    return {
      device_os: 2,
      device_os_version: 'android',
      device_make: 'google',
      device_model: 'pixel',
      app_version: 'v.1.0',
      time_zone: 'IST'
    };
  }
}
