import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';
import { UserService } from '@app/core/user.service';
import { CalenderService } from '@app/calender/calendar.service';
import { ConfigService } from '@app/core/config.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  actvities: any = [];
  user_id = localStorage.getItem('user_id');
  app_key = localStorage.getItem('app_key');
  latest_previous_index = 0;
  moreActivties: any = [];
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    onOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private calenderService: CalenderService
  ) {
    this.user = this.userService.LoggedInUser;
    if (this.user == undefined) {
      this.userService.LoggedInUser = {};
      this.userService.LoggedInUser['contactNumber'] = '';
      this.userService.LoggedInUser['email'] = '';
      this.userService.LoggedInUser['profilePic'] = '';
      this.userService.LoggedInUser['phoneNumber'] = '';
      this.user = this.userService.LoggedInUser;
    }
  }

  ngOnInit() {
    //this.getActivityLog();
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get loggedInUser() {
    return this.userService.LoggedInUser;
  }

  getActivityLog() {
    var obj = {
      user_id: this.user_id,
      app_key: this.app_key,
      previous_index: 999999,
      max_limit: 10
    };
    this.calenderService.getActivityLog(0, 10).subscribe(
      res => {
        var req = res;
        console.log(res);
        if (req.status_code === 200 && !req.is_error) {
          if (req.latest_previous_index && this.latest_previous_index === 0) {
            this.latest_previous_index = req.latest_previous_index;
          }
          //   req.res_data.foreach(res =>{
          //     res = res.replace(")@!@",'').replace("#@!","").replace("#@~","").replace("~@#","");
          //  })
          if (req.res_data && req.res_data.length > 0) {
            if (this.actvities.length > 0 && this.checkForNewAvctivies(this.actvities, req.res_data)) {
              // this.getEvents();
            }

            this.actvities = req.res_data.concat(this.moreActivties);
          }
          // clearTimeout(this.activityLogHandler);
        }
      },
      err => {
        console.log(err.message);
      }
    );
  }

  getMoreActivities() {
    var obj = {
      user_id: this.user_id,
      app_key: this.app_key,
      previous_index: this.latest_previous_index,
      max_limit: 10
    };
    console.log(obj);
    this.calenderService.getActivityLog(this.latest_previous_index, 10).subscribe(res => {
      let req = res;
      if (req.status_code === 200 && !req.is_error) {
        this.latest_previous_index = req.latest_previous_index ? req.latest_previous_index : 0;
        if (req.res_data && req.res_data.length > 0) {
          this.moreActivties = this.moreActivties.concat(req.res_data);
          this.actvities = this.actvities.concat(this.moreActivties);
        }
        console.log(this.actvities);
      }
    });
  }

  checkForNewAvctivies(oldActivities: any, newActivities: any) {
    const latestNewActivity = newActivities[0];
    let result = false;
    if (
      oldActivities[0].message_id !== latestNewActivity.message_id &&
      latestNewActivity.content.toUpperCase().indexOf('EVENT') > -1
    ) {
      result = true;
    }
    return result;
  }
}
