import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '@app/core/user.service';
import { AuthenticationService } from '@app/core';
import { AesService } from '@app/core/authentication/aes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @Input() public user: any;
  userForm!: FormGroup;
  mobileNoError = '';
  selectedCountryCode: string;
  typedPhoneNo: string;
  phoneno: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private aes: AesService,
    public activeModal: NgbActiveModal
  ) {
    this.userForm = this.formBuilder.group({
      phoneno: ['', []],
      emailid: ['', []],
      businessname: ['', []],
      password: ['', []],
      confirmpassword: ''
    });
  }

  ngOnInit() {}

  emptyError() {
    this.mobileNoError = '';
  }

  checkPhoneNoExist() {
    if (this.userForm.value.phoneno && this.userForm.value.phoneno.length > 10) {
      this.mobileNoError = '';
      this.userService.Code = this.selectedCountryCode;
      this.userService.PhoneNumber = this.typedPhoneNo;
      this.authenticationService
        .web_verify_number({ code: this.userService.Code, phone_number: this.userService.PhoneNumber, login_method: 4 })
        .subscribe(
          (res: any) => {
            var req = this.aes.decrypt(res.text());
            if (!req.is_error) {
              if (req.res_data.phone_number_exist === 1) {
                this.mobileNoError = 'User already exists!';
              }
            } else {
              if (req.status_code == '400') {
                this.mobileNoError = 'Invalid Mobile No!';
              } else {
                this.mobileNoError = req.display_msg;
              }
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  countryCodeChangeEvent(event: any) {
    this.selectedCountryCode = event.target.value.split(' ')[0].replace('+', '');
    this.typedPhoneNo = event.target.value.split(' ')[1];
  }
}
