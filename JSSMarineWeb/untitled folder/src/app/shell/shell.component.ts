import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/core/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { AuthenticationService, CredentialsService } from '@app/core';
import { SocketService } from '@app/core/socket.service';
import { ProfileService } from '@app/profile/profile.service';
import { Profile } from '@app/api-middleware';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
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
  constructor(
    private auth: AuthenticationService,
    private userService: UserService,
    private socketService: SocketService,
    private domSanitizer: DomSanitizer,
    private credService: CredentialsService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.getUserProfile();
    this.getProfilePic();
    this.socketService.initialiseSocket();
  }

  getUserProfile() {
    this.auth.getProfileInfo().subscribe(
      (res: any) => {
        var val = res;
        console.log(val);
        if (val.status_code == 200) {
          this.userService.LoggedInUser = val.res_data;
        } else {
          this.userService.LoggedInUser = val.res_data;
          this.toast.fire({
            icon: 'error',
            title: 'Cannot get profile info'
          });
        }
      },
      err => {
        //First time user hard update profile
        if (err.status == '404') {
          let profileData: Profile = {
            first_name: 'Business User',
            user_status: 'Available'
          };
          this.profileService.updateProfile(profileData).subscribe(
            (res: any) => {
              this.getUserProfile();
            },
            error => {
              this.toast.fire({
                icon: 'error',
                title: err.error.display_msg
              });
            }
          );
        }
      }
    );
  }

  getProfilePic() {
    this.auth.getPrfilePic(this.userService.Code.toString() + this.userService.PhoneNumber.toString()).subscribe(
      (res: any) => {
        let TYPED_ARRAY = new Uint8Array(res);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        this.userService.UserProfilePic = this.domSanitizer.bypassSecurityTrustUrl(
          'data:image/png;base64, ' + base64String
        );
      },
      error => {
        this.userService.UserProfilePic = '';
        console.log(error);
      }
    );
  }
}
