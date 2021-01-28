import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService, untilDestroyed } from '@app/core';
import { WindowService } from './services/window.service';
import { UserService } from '@app/core/user.service';
import { AesService } from '@app/core/authentication/aes.service';
import { AuthService, CUAuth } from '../api-middleware';
import { ConfigService } from '@app/core/config.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { CountdownComponent } from 'ngx-countdown';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { TwilioService } from '@app/core/twilio.service';
import * as $ from 'jquery';
const log = new Logger('Login');
export const LOGIN_METHOD = {
  GOOGLE: 1,
  FACEBOOK: 2,
  EMAIl: 3,
  NOT_SET: 4
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];

  currentYear: number = new Date().getFullYear();
  version: string | null = environment.version;
  error: any | undefined;
  success: any | undefined;
  stepOneForm!: FormGroup;
  stepTwoForm!: FormGroup;
  stepThreeForm!: FormGroup;
  stepFourForm!: FormGroup;
  registerCheckSMS = true;
  registerCheckIVR = false;
  selectedCountryCode: string;
  typedPhoneNo: string;
  windowRef: any;
  result: any;
  firebaseCredentials: any;
  step = 1;
  enable = false;
  headerText = 'Log In';
  user: any;
  mobileNoError = '';
  passwordNotExist = false;
  selectedView = 'login';
  generatingOtp = false;
  verifyingOtp = false;
  registeringUser = false;
  phoneNoInvalid = false;
  disablePassword = false;
  showOTP = false;
  passwordIsValid = false;
  passwordMatching = true;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  @ViewChild('checkSms', { static: false }) checkSms: ElementRef<HTMLElement>;
  otpConfig = {
    allowNumbersOnly: true,
    isPasswordInput: false,
    length: 6,
    inputStyles: {
      width: '30px',
      height: '30px',
      'font-size': '12px',
      'border-bottom': '1px solid',
      'border-left': 'none',
      'border-right': 'none',
      'border-top': 'none',
      'border-radius': 'unset'
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    public afAuth: AngularFireAuth,
    private win: WindowService,
    private aes: AesService,
    private userService: UserService,
    private af: AuthService,
    private twilioService: TwilioService,
    private elementRef: ElementRef
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });
    this.windowRef.recaptchaVerifier.render().then((widgetId: any) => {
      this.win.recaptchaWidgetId = widgetId;
    });
    $('.country-dropdown').on('click', () => {
      alert();
    });
  }

  ngOnDestroy() {}

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.stepOneForm = this.formBuilder.group({
      phoneno: ['', []],
      password: ['', []],
      register_sms: ['', []],
      register_ivr: ['', []],
      remember: false
    });
    this.stepTwoForm = this.formBuilder.group({
      otp: [123456, [Validators.required, Validators.minLength(6)]]
    });
    this.stepThreeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.stepFourForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      showpassword: false
    });
  }

  countryCodeChangeEvent() {
    if (this.stepOneForm.value.phoneno) {
      this.selectedCountryCode = this.stepOneForm.value.phoneno.dialCode.replace('+', '');
      this.typedPhoneNo = this.stepOneForm.value.phoneno.number.replace(/ /g, '');
      this.typedPhoneNo = this.typedPhoneNo.replace(/-/g, '');
    }
  }

  resetAllInputFields() {
    this.stepOneForm.controls.phoneno.setValue('');
    this.error = '';
    this.success = '';
    this.mobileNoError = '';
    this.stepOneForm.value.password = '';
    this.stepOneForm.value.remember = false;
    this.stepThreeForm.value.email = '';
    this.stepFourForm.value.password = '';
    this.stepFourForm.value.confirmPassword = '';
    this.stepOneForm.reset();
    this.stepThreeForm.reset();
    this.stepFourForm.reset();
    this.passwordNotExist = false;
    this.registeringUser = false;
    if (this.checkSms) {
      let el: HTMLElement = this.checkSms.nativeElement;
      el.click();
    }
  }

  changeRegisterOTP(type: string) {
    console.log(type);
    if (type == 'sms') {
      this.registerCheckSMS = true;
      this.registerCheckIVR = false;
    } else {
      this.registerCheckIVR = true;
      this.registerCheckSMS = false;
    }
  }

  emptyError() {
    this.mobileNoError = '';
    this.disablePassword = true;
  }

  onOtpChange(event: any) {
    this.stepTwoForm.controls.otp.setValue(event);
  }

  handleCountdownTimmer(event: any) {
    if (event.left === 0) {
      this.showOTP = !this.showOTP;
    }
  }

  enableInputs() {
    this.mobileNoError = '';
    this.disablePassword = false;
    this.phoneNoInvalid = false;
  }

  pastCode: string;
  checkPhoneNoExist() {
    if (this.stepOneForm.value.phoneno && this.stepOneForm.value.phoneno.number.length > 8) {
      if (this.pastCode) {
        if (this.pastCode != this.stepOneForm.value.phoneno.dialCode) {
          this.pastCode = this.stepOneForm.value.phoneno.dialCode;
          this.stepOneForm.controls.phoneno.setValue('');
          return;
        }
        this.pastCode = this.stepOneForm.value.phoneno.dialCode;
      } else {
        this.pastCode = this.stepOneForm.value.phoneno.dialCode;
      }
      this.mobileNoError = '';
      this.userService.Code = this.stepOneForm.value.phoneno.dialCode.replace('+', '');
      this.userService.PhoneNumber = this.stepOneForm.value.phoneno.number.replace(/ /g, '');
      this.userService.PhoneNumber = this.userService.PhoneNumber.replace(/-/g, '');
      this.authenticationService
        .web_verify_number({ code: this.userService.Code, phone_number: this.userService.PhoneNumber, login_method: 4 })
        .subscribe(
          (res: any) => {
            var req = res;
            if (!req.is_error) {
              if (req.res_data.phone_number_exist && req.res_data.password_exist) {
                if (this.selectedView == 'login') {
                  this.userService.Email = req.res_data.email_id_mask;
                  this.disablePassword = false;
                  this.login();
                } else if (this.selectedView == 'register') {
                  this.error = '';
                  this.success = '';
                  this.mobileNoError = 'User already exists!';
                  this.phoneNoInvalid = true;
                  this.disablePassword = true;
                } else {
                  this.phoneNoInvalid = false;
                  this.get_otp();
                }
              } else if (req.res_data.phone_number_exist && req.res_data.password_exist === false) {
                this.passwordNotExist = true;
                this.phoneNoInvalid = false;
                if (this.selectedView == 'forgot') this.get_otp();
                else this.selectedView = 'forgot';
              } else if (req.res_data.phone_number_exist === false) {
                if (this.selectedView == 'login' || this.selectedView == 'forgot') {
                  this.error = '';
                  this.success = '';
                  this.mobileNoError = 'User Not Registered!';
                  this.phoneNoInvalid = true;
                  this.disablePassword = true;
                } else {
                  this.phoneNoInvalid = false;
                  this.get_otp();
                }
              }
            } else {
              if (req.status_code == '400') {
                this.error = '';
                this.success = '';
                this.mobileNoError = 'Invalid Mobile No!';
                this.phoneNoInvalid = true;
                this.disablePassword = true;
              } else {
                this.error = '';
                this.success = '';
                this.mobileNoError = req.display_msg;
                this.phoneNoInvalid = true;
                this.disablePassword = true;
              }
            }
          },
          error => {
            if (error) {
              let errorMsg = error.error;
              if (errorMsg.is_error) {
                if (errorMsg.status_code === 400 && errorMsg.display_msg === 'Phone number not registered') {
                  console.log(this.selectedView);
                  if (this.selectedView == 'login' || this.selectedView == 'forgot') {
                    this.error = '';
                    this.success = '';
                    this.mobileNoError = 'User Not Registered!';
                    this.phoneNoInvalid = true;
                    this.disablePassword = true;
                  } else if (this.selectedView == 'register') {
                    this.phoneNoInvalid = false;
                    this.get_otp();
                  } else {
                    this.error = '';
                    this.success = '';
                    this.mobileNoError = errorMsg.display_msg;
                    this.phoneNoInvalid = true;
                    this.disablePassword = true;
                  }
                }
              }
            }
            console.log(error);
          }
        );
    } else {
      this.mobileNoError = 'Invalid mobile no.';
      this.phoneNoInvalid = true;
    }
  }

  telFocusOut() {
    if (this.pastCode && this.stepOneForm.value.phoneno) {
      if (this.pastCode != this.stepOneForm.value.phoneno.dialCode) {
        this.pastCode = this.stepOneForm.value.phoneno.dialCode;
        this.stepOneForm.controls.phoneno.setValue('');
        return;
      }
      this.pastCode = this.stepOneForm.value.phoneno.dialCode;
    } else {
      if (this.stepOneForm.value.phoneno) this.pastCode = this.stepOneForm.value.phoneno.dialCode;
    }
  }

  login() {
    localStorage.removeItem('credentials');
    sessionStorage.removeItem('credentials');
    localStorage.removeItem('logedInUser');
    sessionStorage.removeItem('logedInUser');
    this.error = '';
    this.success = '';
    const data = {
      code: this.selectedCountryCode,
      phone_number: this.typedPhoneNo,
      password: this.stepOneForm.value.password
    };
    console.log(data);
    this.authenticationService.loginWebUser(data).subscribe(
      (res: any) => {
        //var val = this.aes.decrypt(res.text());
        let val = res;
        if (val.status_code == 200 && val.res_data.user_id) {
          let data: CUAuth = { user_id: val.res_data.user_id, app_key: val.res_data.app_key };
          this.af.authTokenPost(data).subscribe(
            res => {
              if (res.status_code == 200 && !res.is_error) {
                localStorage.setItem('jwt-token', res.token);
                const credData = {
                  user_id: val.res_data.user_id,
                  app_key: val.res_data.app_key,
                  code: this.selectedCountryCode,
                  phno: this.typedPhoneNo,
                  jwt_token: res.token
                };
                ConfigService.setToken(res.token);
                const login$ = this.authenticationService.login(credData, this.stepOneForm.value.remember);
                login$
                  .pipe(
                    finalize(() => {
                      this.stepOneForm.markAsPristine();
                    }),
                    untilDestroyed(this)
                  )
                  .subscribe(
                    credentials => {
                      log.debug(`${credentials.user_id} successfully logged in`);
                      this.router.navigate([this.route.snapshot.queryParams.redirect || '/calendar'], {
                        replaceUrl: true
                      });
                    },
                    error => {
                      log.debug(`Login error: ${error}`);
                      this.error = error.message;
                      this.success = '';
                    }
                  );
              }
            },
            error => {
              this.error = error.message;
              this.success = '';
            }
          );
        } else if (val.status_code == 200 && (!val.res_data.business_user || val.res_data.business_user == '0')) {
          this.error = 'Not a business user! Please Upgrade!';
          this.success = '';
        } else {
          this.error = val.display_msg;
          this.success = '';
        }
      },
      (err: any) => {
        if (err) {
          let errorMsg = err.error;
          if (errorMsg.is_error) {
            this.error = errorMsg.display_msg;
            this.success = '';
          }
        }
      }
    );
  }

  get_otp() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    this.userService.Code = this.selectedCountryCode;
    this.userService.PhoneNumber = this.typedPhoneNo;
    this.error = '';
    this.success = '';
    this.generatingOtp = true;

    //test
    /*this.generatingOtp = false;
    this.showOTP = true;
    this.step = 2;*/
    this.authenticationService
      .web_verify_number({
        code: '+' + this.userService.Code,
        phone_number: this.userService.PhoneNumber,
        login_method: 1
      })
      .subscribe(
        (res: any) => {
          var req = res;
          console.log(res);
          console.log(res.is_error);
          if (req.is_error == 0) {
            if (
              (req.res_data.phone_number_exist == 0 && this.selectedView == 'register') ||
              (req.res_data.phone_number_exist == 1 && this.selectedView == 'forgot')
            ) {
              var phone_number = '+' + this.userService.Code.toString() + this.userService.PhoneNumber.toString();
              if (this.registerCheckSMS) {
                this.result = firebase
                  .auth()
                  .signInWithPhoneNumber(phone_number, appVerifier)
                  .then(confirmationResult => {
                    this.generatingOtp = false;
                    this.showOTP = true;
                    this.step = 2;
                    this.windowRef.ConfirmationResult = confirmationResult;
                  })
                  .catch(error => {
                    console.log(error);
                    this.generatingOtp = false;
                    this.windowRef.recaptchaVerifier.reset(this.win.recaptchaWidgetId);
                    this.error = error;
                    this.success = '';
                  });
              } else if (this.registerCheckIVR) {
                this.twilioService.sendVoiceOtp(phone_number).subscribe(
                  res => {
                    console.log(res);
                    if (res) {
                      if (res.status == 'pending') {
                        this.generatingOtp = false;
                        this.showOTP = true;
                        this.step = 2;
                      }
                    }
                    console.log(res);
                  },
                  error => {
                    console.log(error);
                  }
                );
              }
            } else {
              this.generatingOtp = false;
              this.error = 'Already Registered User';
              this.success = '';
            }
          } else {
            this.generatingOtp = false;
            if (req.status_code == '400') {
              this.error = 'Invalid Mobile No.';
              this.success = '';
            }
          }
        },
        err => {
          var resp = err.error;
          if (resp.is_error && resp.display_msg == 'Phone number not registered' && this.selectedView == 'register') {
            var phone_number = '+' + this.userService.Code.toString() + this.userService.PhoneNumber.toString();
            if (this.registerCheckSMS) {
              this.result = firebase
                .auth()
                .signInWithPhoneNumber(phone_number, appVerifier)
                .then(confirmationResult => {
                  this.generatingOtp = false;
                  this.showOTP = true;
                  this.step = 2;
                  this.windowRef.ConfirmationResult = confirmationResult;
                })
                .catch(error => {
                  this.generatingOtp = false;
                  this.windowRef.recaptchaVerifier.reset(this.win.recaptchaWidgetId);
                  if (error.code == 'auth/invalid-phone-number') this.error = 'Invalid mobile number';
                  else this.error = error;
                  this.success = '';
                });
            } else if (this.registerCheckIVR) {
              this.twilioService.sendVoiceOtp(phone_number).subscribe(
                res => {
                  if (res) {
                    if (res.status == 'pending') {
                      this.generatingOtp = false;
                      this.showOTP = true;
                      this.step = 2;
                    }
                  }
                },
                error => {
                  if (error.error.message == 'Invalid parameter: To') {
                    this.generatingOtp = false;
                    this.error = 'Invalid mobile number';
                    this.success = '';
                  } else {
                    this.generatingOtp = false;
                    this.error = error.error.message;
                    this.success = '';
                  }
                }
              );
            }
          }
        }
      );
  }

  verify() {
    this.error = false;
    this.success = '';
    this.verifyingOtp = true;
    //test
    //this.enable = false;
    //this.registerWebPhoneNumber();
    if (this.registerCheckSMS) {
      this.result.then((confirmationResult: any) => {
        if (this.stepTwoForm.value.otp) {
          this.windowRef.ConfirmationResult.confirm(this.stepTwoForm.value.otp)
            .then((result: any) => {
              this.enable = false;
              this.registerWebPhoneNumber();
            })
            .catch((error: any) => {
              this.verifyingOtp = false;
              this.error = 'Invalid OTP';
              this.success = '';
              this.enable = false;
              this.windowRef.recaptchaVerifier.reset(this.win.recaptchaWidgetId);
            });
          return this.enable;
        }
      });
    } else if (this.registerCheckIVR) {
      if (this.stepTwoForm.value.otp) {
        var phone_number = '+' + this.userService.Code.toString() + this.userService.PhoneNumber.toString();
        this.twilioService.verifyVoiceOtp(phone_number, this.stepTwoForm.value.otp).subscribe(res => {
          if (res) {
            if (res.status == 'approved') {
              this.enable = false;
              this.registerWebPhoneNumber();
            } else {
              this.verifyingOtp = false;
              this.error = 'Invalid OTP';
              this.success = '';
              this.enable = false;
              this.windowRef.recaptchaVerifier.reset(this.win.recaptchaWidgetId);
            }
          }
        });
      }
    }
  }

  registerWebPhoneNumber() {
    console.log(this.selectedView);
    let data = {
      code: this.userService.Code,
      phone_number: this.userService.PhoneNumber,
      login_method: this.userService.LoginMethod
    };
    this.authenticationService.web_crete_registration(data).subscribe(
      res => {
        this.verifyingOtp = false;
        var req = res;
        this.step = 3;
        this.userService.AppKey = req['res_data'].app_key;
        this.userService.LoginMethod = req['res_data'].login_method;
        this.userService.User.user_exist = req['res_data'].user_exist;
        localStorage.setItem('app_key', req['res_data'].app_key);
      },
      error => {
        this.verifyingOtp = false;
        this.error = error;
        this.success = '';
      }
    );
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(result => {
          this.user = result.additionalUserInfo;
          this.userService.LoginMethod = 1;
          this.stepThreeForm.controls.email.setValue(this.user.profile.email);
          this.step = 3;
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });
    });
  }

  setPassword() {
    this.error = '';
    this.step = 4;
    this.userService.LoginMethod = LOGIN_METHOD.EMAIl;
  }

  updateWebUser() {
    console.log(this.selectedView);
    if (this.selectedView === 'register') {
      this.registerWebUser();
    } else {
      this.updatePassword();
    }
  }

  updatePassword() {
    this.registeringUser = true;
    let data = this.stepOneForm.value;
    data['code'] = this.userService.Code;
    data['phone_number'] = this.userService.PhoneNumber;
    data['email'] = this.stepThreeForm.value.email;
    data['password'] = this.stepFourForm.value.password;
    this.userService.LoginMethod = LOGIN_METHOD.GOOGLE;
    this.authenticationService.setPasswordWebUser(data).subscribe(
      (res: any) => {
        var val = res;
        console.log(val);
        if (val.status_code == 200) {
          this.stepOneForm = this.formBuilder.group({
            phoneno: ['', []],
            password: ['', []],
            register_sms: ['', []],
            register_ivr: ['', []],
            remember: false
          });
          this.step = 1;
          this.selectedView = 'login';
          this.passwordNotExist = false;
          this.resetAllInputFields();
          this.success = 'Password reset successfully';
        } else {
          this.error = val.display_msg;
          this.success = '';
          this.registeringUser = false;
        }
      },
      error => {
        if (error.error.is_error) {
          if (error.error.display_msg == 'Incorrect email_id') {
            this.step = 3;
            this.registeringUser = false;
            this.error = 'Invalid Email';
            this.success = '';
            console.log(error);
            console.log(this.error);
          } else {
            this.registeringUser = false;
            this.error = error.error.display_msg;
            this.success = '';
          }
        } else {
          this.registeringUser = false;
          this.error = error.error.display_msg;
          this.success = '';
        }
      }
    );
  }

  registerWebUser() {
    this.registeringUser = true;
    let data = this.stepOneForm.value;
    data['code'] = this.userService.Code;
    data['phone_number'] = this.userService.PhoneNumber;
    data['email'] = this.stepThreeForm.value.email;
    data['password'] = this.stepFourForm.value.password;
    this.userService.LoginMethod = LOGIN_METHOD.GOOGLE;
    console.log(data);
    this.authenticationService.web_sign_up(data).subscribe(
      (res: any) => {
        var val = res;
        if (val.status_code == 200) {
          localStorage.setItem('user_id', val.res_data.user_id);
          this.userService.User.user_id = val.res_data.user_id;
          let user = {
            profile: {
              given_name: ' ',
              family_name: this.stepOneForm.value.phoneno.toString(),
              picture: ''
            }
          };
          this.step = 1;
          this.selectedView = 'login';
          this.stepOneForm.controls.phoneno.setValue('');
          this.resetAllInputFields();
          this.success = 'Successfully registered';
        } else {
          this.error = 'Something went wrong';
          this.success = '';
          this.registeringUser = false;
        }
      },
      error => {
        this.registeringUser = false;
        this.error = error;
        this.success = '';
      }
    );
  }

  passwordValid(event: any) {
    this.passwordIsValid = event;
  }

  checkConfirmPassword() {
    if (this.stepFourForm.value.password == this.stepFourForm.value.confirmPassword) this.passwordMatching = true;
    else this.passwordMatching = false;
  }
}
