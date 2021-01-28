import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '@app/core/user.service';
import { Profile, UploadProfilePic, SubscriptionInfoResponseData, AuthService, CUAuth } from '@app/api-middleware';
import { ProfileService } from './profile.service';
import Swal from 'sweetalert2';
import { AuthenticationService, CredentialsService, Credentials } from '@app/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LocationComponent } from './components/location/location.component';
import { PaymentService } from '@app/api-middleware/api/payment.service';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { ConfigService } from '@app/core/config.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService as UserService1 } from '@app/api-middleware';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  invoiceLoading = false;
  profileForm!: FormGroup;
  base64textString = '';
  fileData: File = null;
  locationDataSource: any[] = [];
  user: any;
  location: any = {};
  disableChangePic = true;
  currentBusName = '';
  locationFilter: string = '';
  subscriptionDataSource: SubscriptionInfoResponseData[] = [];
  subscriptionFilter: string = '';
  invoiceFilter: string = '';
  showInvoiceHistory: boolean = false;
  invoiceHistory: any = [];
  credential: Credentials = {
    user_id: '',
    app_key: '',
    code: '',
    phno: '',
    jwt_token: ''
  };
  opacityClass: string = 'middle';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthenticationService,
    private profileService: ProfileService,
    private paymentService: PaymentService,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private http: Http,
    private af: AuthService,
    private spinnerService: Ng4LoadingSpinnerService,
    private credentialsService: CredentialsService,
    private confirmationDialogService: ConfirmationDialogService,
    private userService1: UserService1
  ) {
    this.user = this.userService.LoggedInUser;
    console.log(this.user);
    this.createForm();
  }

  ngOnInit() {
    this.getProfilePic();
    this.getLocations();
    this.getAllSubscripton();
  }

  changeOpacity(change: boolean) {
    if (change) this.opacityClass = 'middle opacity-important';
    else this.opacityClass = 'middle';
  }

  private createForm() {
    this.profileForm = this.formBuilder.group({
      businessname: [this.user.first_name, []]
    });
    this.currentBusName = this.user.first_name;
  }

  get loggedInUser() {
    return this.userService.LoggedInUser;
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.fileData);
      this.disableChangePic = false;
    }
  }

  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.userService.UserProfilePic = this.domSanitizer.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.base64textString
    );
  }

  getProfilePic() {
    this.spinnerService.show();
    this.auth.getPrfilePic(this.userService.Code.toString() + this.userService.PhoneNumber.toString()).subscribe(
      (res: any) => {
        console.log(res);
        let TYPED_ARRAY = new Uint8Array(res);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        this.userService.UserProfilePic = this.domSanitizer.bypassSecurityTrustUrl(
          'data:image/png;base64, ' + base64String
        );
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
        if (error) {
          if (error.status == 404) {
            /*this.toast.fire({
              icon: 'warning',
              title: 'Profile picture not found'
            });*/
          } else {
            this.toast.fire({
              icon: 'error',
              title: error.statusText
            });
          }
        }
        this.spinnerService.hide();
      }
    );
  }

  updateProfile() {
    console.log(this.profileForm.value.businessname);
    if (!this.profileForm.value.businessname) {
      //this.profileForm.value.businessname = this.user.first_name;
      this.toast.fire({
        icon: 'error',
        title: 'Name field should not be empty'
      });
    } else {
      if (this.currentBusName == this.profileForm.value.businessname) {
        this.toast.fire({
          icon: 'warning',
          title: 'Nothing to update'
        });
      } else {
        let profileData: Profile = {
          first_name: this.profileForm.value.businessname,
          user_status: 'Available'
        };
        this.profileService.updateProfile(profileData).subscribe(
          (res: any) => {
            console.log(res);
            if (!res.is_error) {
              let userData = this.userService.LoggedInUser;
              userData['first_name'] = this.profileForm.value.businessname;
              this.userService.LoggedInUser = userData;
              this.toast.fire({
                icon: 'success',
                title: 'Profile updated successfully'
              });
              this.currentBusName = this.profileForm.value.businessname;
            }
          },
          error => {
            this.toast.fire({
              icon: 'error',
              title: 'Unable to update profile'
            });
          }
        );
      }
    }
  }

  updateProfilePicture() {
    let data: UploadProfilePic = {
      image_data: 'image/png;base64,' + this.base64textString
    };
    if (this.base64textString) {
      this.profileService.uploadFile(data).subscribe(
        (res: any) => {
          if (!res.is_error) {
            this.base64textString = '';
            this.getProfilePic();
            this.toast.fire({
              icon: 'success',
              title: 'Profile picture updated successfully'
            });
            this.disableChangePic = true;
          }
        },
        error => {
          this.toast.fire({
            icon: 'error',
            title: 'Unable to update profile picture'
          });
          this.disableChangePic = true;
        }
      );
    }
  }

  openModal(type: any, location: any) {
    const modalRef = this.modalService.open(LocationComponent);
    console.log(type);
    if (type === 'add') {
      modalRef.componentInstance.location = {
        type: type
      };
    } else {
      console.log(type);
      modalRef.componentInstance.location = {
        type: type,
        locationname: location.name.split(':::')[0],
        country: location.name.split(':::')[1],
        state: location.name.split(':::')[3],
        city: location.name.split(':::')[5]
      };
    }
    modalRef.result.then(result => {
      if (result) {
        let request = result.locationname + ':::' + result.country + ':::' + result.state + ':::' + result.city;
        if (type === 'add') {
          this.addLocation(request);
        } else {
          this.editLocation(request, location['id']);
        }
      }
    });
  }

  getLocations() {
    this.spinnerService.show();
    this.profileService.getLoations().subscribe(
      (res: any) => {
        if (res.status_code == 200 && !res.is_error) {
          this.userService.UserLocations = res.res_data;
          this.locationDataSource = this.userService.UserLocations;
        }
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
        this.spinnerService.hide();
      }
    );
  }

  addLocation(value: any) {
    this.location['id'] = '';
    this.location['code'] = '1';
    this.location['latitude'] = '';
    this.location['longitude'] = '';
    this.location['name'] = value;
    this.profileService.addLocation(this.location).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status_code == 200 && !res.is_error) {
          this.toast.fire({
            icon: 'success',
            title: 'Location added successfully'
          });
          this.getLocations();
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error while adding location'
          });
        }
      },
      error => {
        if (error.error.is_error) {
          this.toast.fire({
            icon: 'error',
            title: error.error.display_msg
          });
        }
      }
    );
  }

  editLocation(value: any, id: any) {
    this.location['id'] = id;
    this.location['code'] = '1';
    this.location['latitude'] = '';
    this.location['longitude'] = '';
    this.location['name'] = value;
    this.profileService.editLocation(this.location).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status_code == 200 && !res.is_error) {
          this.toast.fire({
            icon: 'success',
            title: 'Location updated successfully'
          });
          this.getLocations();
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error while updating location'
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteLocation(location: any) {
    this.profileService.deleteLocation(location.id).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status_code == 200 && !res.is_error) {
          this.toast.fire({
            icon: 'success',
            title: 'Location deleted successfully'
          });
          this.getLocations();
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error while deleting location'
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllSubscripton() {
    this.spinnerService.show();
    this.paymentService.subscriptionsGet().subscribe(
      (res: any) => {
        if (res.status_code == 200 && !res.is_error) {
          this.subscriptionDataSource = res.res_data;
          console.log(this.subscriptionDataSource);
          this.subscriptionDataSource.sort((a: any, b: any) => {
            return <any>new Date(b.current_period_end) - <any>new Date(a.current_period_end);
          });
        }
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
        this.spinnerService.hide();
      }
    );
  }

  public unsubscribeConfirmationDialog(subscriptionid: string) {
    console.log(subscriptionid);
    this.confirmationDialogService.confirm('Are you sure to unsubscribe?').then(confirmed => {
      if (confirmed) {
        this.cancelSubscription(subscriptionid);
      }
    });
  }

  cancelSubscription(subscriptionid: string) {
    this.paymentService.subscriptionDelete(subscriptionid).subscribe(
      (res: any) => {
        if (res.status_code == 200 && !res.is_error) {
          this.toast.fire({
            icon: 'success',
            title: 'Your plan has been unsubscribed'
          });
          this.updateJWTToken();
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error while unsubscribing'
          });
        }
      },
      error => {
        this.toast.fire({
          icon: 'error',
          title: 'Error while unsubscribing'
        });
      }
    );
  }

  getInvoiceHistory(subscriptionid: string) {
    this.invoiceLoading = true;
    this.spinnerService.show();
    this.paymentService.invoiceListGet(subscriptionid).subscribe(
      (res: any) => {
        if (res.status_code == 200 && !res.is_error) {
          this.invoiceHistory = res.res_data;
          if (this.invoiceHistory.length == 0) {
            this.toast.fire({
              icon: 'info',
              title: 'Invoice not available'
            });
          } else {
            this.showInvoiceHistory = true;
            this.invoiceLoading = false;
          }
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error while getting invoice'
          });
          this.showInvoiceHistory = false;
          this.invoiceLoading = false;
        }
        this.spinnerService.hide();
      },
      error => {
        this.toast.fire({
          icon: 'error',
          title: 'Error while getting invoice'
        });
        this.showInvoiceHistory = false;
        this.invoiceLoading = false;
        this.spinnerService.hide();
      }
    );
  }

  updateJWTToken() {
    let credentials = this.credentialsService.credentials;
    console.log(credentials);
    let data: CUAuth = { user_id: credentials.user_id, app_key: credentials.app_key };
    this.af.authTokenPost(data).subscribe(
      res => {
        if (res.status_code == 200 && !res.is_error) {
          localStorage.setItem('jwt-token', res.token);
          ConfigService.setToken(res.token);
          this.credential.app_key = this.credentialsService.credentials.app_key;
          this.credential.code = this.credentialsService.credentials.code;
          this.credential.jwt_token = res.token;
          this.credential.phno = this.credentialsService.credentials.phno;
          this.credential.user_id = this.credentialsService.credentials.user_id;
          this.credentialsService.setCredentials(this.credential, true);
          this.getAllSubscripton();
        }
      },
      error => {
        this.toast.fire({
          icon: 'error',
          title: 'Error while getting token'
        });
      }
    );
  }

  convertAmount(amount: any) {
    return Number(amount) / 100;
  }

  deleteAccount() {
    this.userService1.userDeleteAccountDelete().subscribe(
      (res: any) => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }
}
