import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import {
  MeetingService,
  ValidateParticipantStatus,
  InlineResponse20013,
  CreateMeeting,
  MeetingInfo,
  MeetingInfoResponse,
  GetParticipants,
  ChatService,
  AddParticipants,
  RemoveParticipants,
  EditMeeting,
  DeleteMeeting,
  UpdateEventOptions,
  CancelMeeting,
  UpdateParticipantStatus,
  CreateLink
} from '../api-middleware';
import { GetMeetingList } from '../api-middleware/model/getMeetingList';
import { AesService } from '@app/core/aes.service';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  // private token: string;

  constructor(
    private http: Http,
    private aes: AesService,
    private router: Router,
    private meetingService: MeetingService,
    private ch: ChatService
  ) {}

  getUserMeetingIds() {
    return this.meetingService.meetingIdGet();
  }

  verifyParticipants(data: ValidateParticipantStatus): Observable<InlineResponse20013> {
    return this.meetingService.meetingValidateParticipantStatusPost(data);
  }

  createEvent(data: CreateMeeting) {
    return this.meetingService.meetingCreatePost(data);
  }

  getMeetinInfo(data: MeetingInfo): Observable<MeetingInfoResponse> {
    return this.meetingService.meetingInfoPost(data);
  }

  getMeetings(data: GetMeetingList): Observable<MeetingInfoResponse> {
    return this.meetingService.meetingListPost(data);
  }

  getParticipentList(data: GetParticipants) {
    return this.meetingService.meetingGetParticipantsPost(data);
  }

  getActivityLog(index: any, limit: any) {
    return this.ch.chatActivityLogPreviousIndexMaxLimitGet(index, limit);
  }

  addParticipants(data: AddParticipants) {
    return this.meetingService.meetingAddParticipantsPost(data);
  }

  removeParticpants(data: RemoveParticipants) {
    return this.meetingService.meetingRemoveParticipantsPost(data);
  }

  updateMeeting(data: EditMeeting) {
    return this.meetingService.meetingEditPost(data);
  }

  removeMeeting(data: DeleteMeeting) {
    return this.meetingService.meetingDeletePost(data);
  }

  updateEventOptions(data: UpdateEventOptions) {
    return this.meetingService.meetingUpdateEventOptionsPost(data);
  }

  cancelEvent(data: CancelMeeting) {
    return this.meetingService.meetingCancelPost(data);
  }

  removeEvent(data: DeleteMeeting) {
    console.log('Delete Meeting:', data);
    return this.meetingService.meetingDeletePost(data);
  }

  updateStatus(data: UpdateParticipantStatus) {
    return this.meetingService.meetingUpdateParticipantStatusPost(data);
  }

  shareMeetingLink(data: CreateLink) {
    return this.meetingService.meetingCreateLinkPost(data);
  }

  createMeeting(data: any) {
    var final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/createmeeting.php', { inputData: final });
  }

  getEventData(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/getmeetinginfo.php', { inputData: final });
  }

  updateParticipentList(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/updateparticipantstatus.php', { inputData: final });
  }

  updateEvent(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/editmeeting.php', { inputData: final });
  }

  verifyUser(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/userinfo/getcontactinfo.php', { inputData: final });
  }

  getEventChats(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/chat/getchatmsg.php', { inputData: final });
  }

  sendChat(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/chat/updatechatdata.php', { inputData: final });
  }

  removePartispants(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/deletemeetingparticipants.php', { inputData: final });
  }

  shareMeetingLinLink(data: any) {
    let final = this.aes.encrypt(data);
    return this.http.post(environment.API_URL + '/apisV1/meetings/createmeetinglink.php', { inputData: final });
  }

  private newDeviceObj() {
    return {
      device_os: '0',
      device_os_version: 'android',
      device_make: 'google',
      device_model: 'pixel',
      tnc_version_id: 'v1.1'
    };
  }
}
