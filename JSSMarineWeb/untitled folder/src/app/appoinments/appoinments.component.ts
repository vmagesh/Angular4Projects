import { Component, OnInit } from '@angular/core';
import { EventsService } from '@app/core/events.service';
import { MeetingInfoResponseData } from '@app/api-middleware';
import { CalenderService } from '@app/calender/calendar.service';
import { GetMeetingList } from '@app/api-middleware/model/getMeetingList';
import { AuthenticationService } from '@app/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-appoinments',
  templateUrl: './appoinments.component.html',
  styleUrls: ['./appoinments.component.scss']
})
export class AppoinmentsComponent implements OnInit {
  pastAppoinments?: Array<MeetingInfoResponseData>;
  upcomingAppoinments?: Array<MeetingInfoResponseData>;
  currentDate: any;
  pastAppoinmenmentStart: any;
  upcomingAppoinmenmentEnd: any;
  upcomingAppoinmentLoading: boolean = true;
  pastAppoinmentLoading: boolean = true;
  imageMap: any = {};
  upcomingAppointmentFilter: string = '';
  pastAppointmentFilter: string = '';

  constructor(
    private eventService: EventsService,
    private auth: AuthenticationService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private calenderService: CalenderService
  ) {}

  ngOnInit() {
    let days = 10;
    this.currentDate = new Date();
    this.pastAppoinmenmentStart = new Date(this.currentDate.getTime() - days * 24 * 60 * 60 * 1000);
    this.upcomingAppoinmenmentEnd = new Date(this.currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    this.getUpcomingAppoinments();
    this.getPastAppoinments();
  }

  convert(str: any) {
    console.log(str);
    console.log(str.toString());
    return str.toLocaleString();
  }

  getUpcomingAppoinments() {
    let data: GetMeetingList = {
      start_time: this.currentDate.toString(),
      end_time: this.upcomingAppoinmenmentEnd.toString()
    };
    this.calenderService.getMeetings(data).subscribe(
      (res: any) => {
        var req = res;
        this.upcomingAppoinments = req.res_data;
        this.upcomingAppoinments.forEach(each => {
          this.imageMap[each['host_contact_number']] = null;
          console.log(this.convert(new Date(each.start_time)));
          //each.start_time=new Date(each.start_time).toLocaleString();
          //each.end_time=new Date(each.end_time).toLocaleString();
        });
        console.log(this.upcomingAppoinments);
        this.upcomingAppoinments = this.upcomingAppoinments.sort(
          (a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.end_time).getTime()
        );
        for (let key in this.imageMap) {
          this.imageMap[key] = this.getProfilePicByMobileNo(key);
        }
        this.upcomingAppoinmentLoading = false;
      },
      error => {
        console.log(error);
        this.upcomingAppoinmentLoading = false;
      }
    );
  }

  getPastAppoinments() {
    let data: GetMeetingList = {
      start_time: this.pastAppoinmenmentStart.toString(),
      end_time: this.currentDate.toString()
    };
    this.calenderService.getMeetings(data).subscribe(
      (res: any) => {
        var req = res;
        this.pastAppoinments = req.res_data;
        this.pastAppoinments.forEach(each => {
          this.imageMap[each['host_contact_number']] = null;
        });
        this.pastAppoinments = this.pastAppoinments.sort(
          (a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.end_time).getTime()
        );
        for (let key in this.imageMap) {
          this.imageMap[key] = this.getProfilePicByMobileNo(key);
        }
        this.pastAppoinmentLoading = false;
      },
      error => {
        this.pastAppoinmentLoading = false;
        console.log(error);
      }
    );
  }

  getProfilePicByMobileNo(phoneno: any) {
    this.auth.getPrfilePic(phoneno.toString()).subscribe(
      (res: any) => {
        let TYPED_ARRAY = new Uint8Array(res);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        let profilePic = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + base64String);
        this.imageMap[phoneno] = profilePic;
      },
      error => {
        console.log(error);
      }
    );
    return this.imageMap[phoneno];
  }

  openChat(meetingId: any) {}

  openModal(meetingId: any) {
    console.log(meetingId);
    const modalRef = this.modalService.open(ChatComponent);
    modalRef.componentInstance.meetingId = meetingId;
    modalRef.result.then(result => {
      if (result) {
      }
    });
  }
}
