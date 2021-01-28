import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { FormGroup, FormBuilder, NgForm, Validators, FormControl } from '@angular/forms';
import { UserService } from '@app/core/user.service';
import { LocationService } from '../../api-middleware/api/location.service';
import { CalenderService } from '../calendar.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { AddParticipants, EditMeeting, GetParticipants, CancelMeeting, DeleteMeeting, UpdateParticipantStatus } from '@app/api-middleware';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  //appointmentForm!: FormGroup;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India];
  inputText = 'text';
  editMode = false;
  disableTagInput = false;
  editCancelEvent = false;
  UserStatus = new FormControl();
  statuses: any[] = [];
  eventParticipants: any[] = [];
  currentUserMeetingParticipant: any;
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

  set_recurrence: boolean = false;
  allow_forwarding: boolean = false;

  codes = [
    { country: 'IN', country_code: 91 },
    { country: 'AU', country_code: 61 },
    { country: 'UK', country_code: 44 },
    { country: 'US', country_code: 1 }
  ];

  address = '';
  display_numbers: any[] = [];
  repeat_types = [
    { val: 0, text: 'Day(s)' },
    { val: 1, text: 'Week(s)' },
    { val: 2, text: 'Month(s)' }
  ];

  public appointmentForm = this.formBuilder.group({
    subject: ['', Validators.required],
    start_time: [null, Validators.required],
    end_time: [null, Validators.required],
    location: [null, Validators.required],
    set_recurrence: [null, Validators.required],
    allow_forwarding: [null, Validators.required],
    repeat_interval: [null, Validators.required],
    repeat_mode: [null, Validators.required],
    repeat_count: [null, Validators.required],
    participants: [null, Validators.required],
    UserStatus: [null, Validators.required],
    description: [null, Validators.required],
    phoneno: [null, Validators.required]
  });

  location: '';
  meeting_id = 0;
  private data: string;
  recur_meeting_id = 0;
  everyCount:Array<any> = [];
  recurrence: boolean = false;
  //@Input() public type: any;
  @Input() public appointment: any;
  @ViewChild('location', { static: false }) locationref: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  locationInfo: any[] = [];
  locations = this.formBuilder.group({
    startDate: [null, Validators.required],
    startTime: [null, Validators.required]
  });
  submitted: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private locationService: LocationService,
    private calenderService: CalenderService,
    private modalService: NgbActiveModal,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.everyCount = Array.from({length:99},(v,k)=>k+1);
    this.locations = userService.UserLocations;
    console.log('Inside constructor');
  }

  toEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.appointmentForm.enable();
      this.formControls.participants.enable();
      this.disableTagInput = false;
    } else {
      this.appointmentForm.disable();
      this.formControls.participants.disable();
      this.disableTagInput = true;
    }
  }

  enableCancel() {
    this.editCancelEvent = !this.editCancelEvent;
    console.log('called', this.editCancelEvent);

    if (this.editCancelEvent) {
      this.editCancelEvent = true;
    } else {
      this.editCancelEvent = false;
    }
  }

  ngOnInit() {
    //console.log('Logs', this.appointment);
    //console.log(this.appointment.title);
    if (this.appointment.type == 'edit') {
      this.formControls.subject.setValue(this.appointment.title);
      this.formControls.start_time.setValue(this.appointment.start_time);
      this.formControls.end_time.setValue(this.appointment.end_time);
      this.appointmentForm.get('location').setValue(this.appointment.location);
      this.formControls.set_recurrence.setValue(this.appointment.set_recurrence);
      this.formControls.end_time.setValue(this.appointment.end_time);
      this.formControls.allow_forwarding.setValue(this.appointment.allowForwarding);
      this.formControls.repeat_count.setValue(this.appointment.repeat_count);
      this.formControls.repeat_interval.setValue(this.appointment.repeat_interval);
      this.formControls.repeat_mode.setValue(this.appointment.repeat_mode);
      this.meeting_id = this.appointment.meeting_id;
      this.recur_meeting_id = this.appointment.recur_meeting_id;
      //console.log(';www', this.meeting_id);
      //console.log(';www', this.recur_meeting_id);
      for (let i = 0; i < this.appointment.particpants.length; i++) {
        //console.log('sssss');
        //console.log(this.appointment.particpants[i].contact_number);
        this.display_numbers.push(this.appointment.particpants[i].contact_number);
      }

      this.formControls.participants.setValue(this.display_numbers);
      //console.log('Received:',this.appointment.particpants);
      //this.formControls.participants.setValue(this.appointment.particpants);

      let parts = this.formControls.participants.value;
      //console.log('partss', parts);
      parts.splice(0, this.appointment.particpants);
      //console.log('Parts', this.formControls.participants);
      this.formControls.participants.setValue(parts);
      //console.log('Inside constructor');
      this.getParticipants();
      //this.appointmentForm.disable();
      this.user_options();
      console.log('Status',this.statuses);
      this.appointmentForm.disable();
      this.formControls.start_time.disabled;
      //console.log('Final form',formdata);
    } else {
      this.createEventForm();
    }

    //this.formControls.location.setValue(this.appointment.address);
  }

  public onSelect(item: any) {
    console.log('tag selected: value is ' + item);
  }

  getLocations() {
    this.locationService.locationGet().subscribe(
      (res: any) => {
        console.log(res);
        if (res.status_code == 200 && !res.is_error) {
          this.locations = res.res_data;
          this.userService.UserLocations = this.locations;
          //  this.router.navigateByUrl('/calendar')
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  get formControls() {
    return this.appointmentForm.controls;
  }

  update() {
    let formValue = this.appointmentForm.value;
    var obj: EditMeeting = {
      subject: formValue.subject,
      start_time: formValue.start_time.toISOString().substr(0, 19),
      end_time: formValue.end_time.toISOString().substr(0, 19),
      location: formValue.location,
      longitude: '',
      latitude: '',
      set_recurrence: this.appointment.set_recurrence,
      meeting_id: this.appointment.meeting_id,
      recur_meeting_id: this.appointment.recur_meeting_id
    };

    this.calenderService.updateMeeting(obj).subscribe(
      (res: any) => {
        var req = res;
        if (req.status_code === 200 && !req.is_error) {
          this.passEntry.emit('update');
          //this.showSuccess(req.display_msg);
          this.appointmentForm.reset();
          //this.closeModal(true);
          this.toast.fire({
            icon: 'success',
            title: req.display_msg
          });
          this.modalService.close(this.appointment);
          //modalService.clos
        } else {
          this.toast.fire({
            icon: 'error',
            title: req.display_msg
          });
        }
      },
      error => {
        console.log(error.error.display_msg);
        this.toast.fire({
          icon: 'error',
          title: error.error.display_msg
        });
      }
    );
  }

  closeModal(success: any) {
    this.appointmentForm.reset();
    this.modalService.close(success);
  }
  addPartispants(phoneNumber: any) {
    var obj: AddParticipants = {
      set_recurrence: this.formControls.set_recurrence.value,
      recur_meeting_id: this.appointment.recur_meeting_id,
      meeting_id: this.appointment.meeting_id,
      participants: [phoneNumber]
    };
    this.calenderService.addParticipants(obj).subscribe(res => {
      var req = res;
      if (req.status_code === 200 && !req.is_error) {
        this.toast.fire({
          icon: 'success',
          title: 'Successsfully Added'
        });
      } else {
        this.toast.fire({
          icon: 'error',
          title: req.display_msg
        });
      }
      console.log(req);
    });
  }

  removeParticipant(participant: any) {
    var obj: AddParticipants = {
      set_recurrence: this.appointment.set_recurrence,
      recur_meeting_id: this.appointment.recur_meeting_id,
      meeting_id: this.appointment.meeting_id,
      participants: [participant]
    };
    this.calenderService.removeParticpants(obj).subscribe(res => {
      var req = res;
      if (req.status_code === 200 && !req.is_error) {
        //this.showSuccess("Participant removed successfully");
        this.toast.fire({
          icon: 'success',
          title: 'Participant removed successfully'
        });
        this.getParticipants();
      } else {
        this.toast.fire({
          icon: 'error',
          title: req.display_msg
        });
      }
      console.log(req);
    });
  }

  confirmDelete() {
    this.confirmationDialogService.confirm('Do you really want to Delete?').then(confirmed => {
      if (confirmed) {
        return confirmed;
      }
    });

    return true;
  }

  get canRemovePartispants() {
    return moment(this.formControls.start_time.value)
      .local()
      .isAfter();
  }
  remove_participant(participant: any) {
    console.log('Remoed:', participant);
    if (this.appointment && this.appointment.meeting_id > 0 && !this.canRemovePartispants) {
      return false;
    }
    const index = this.display_numbers.indexOf(participant, 0);
    //if (index > -1) {
    if (this.appointment && this.appointment.meeting_id) {
      console.log('The dialog was closed');
      this.confirmationDialogService.confirm('Do you really want to Delete?').then(confirmed => {
        if (confirmed) {
          //this.display_numbers.splice(index, 1);
          this.formControls.participants.setValue(this.display_numbers);
          this.removeParticipant(participant);
        } else {
          this.display_numbers.push(participant);
          this.formControls.participants.setValue(this.display_numbers);
        }
      });
    } else {
      //this.display_numbers.splice(index, 1);
      this.display_numbers.push(participant);
      this.formControls.participants.setValue(this.display_numbers);
    }
    //}
  }

  /* verify_user(phoneNumber: any) {
    console.log('sss', phoneNumber);
    console.log('Phone', phoneNumber[phoneNumber.length - 1].value);
    let phno = this.addCountryCode(phoneNumber[phoneNumber.length - 1].value);
    //phno = '+' + phno;
    console.log('Phone', phno);

    if (phno && !this.checkParticipantsExits(phno)) {
      if (this.appointment && this.appointment.meeting_id) {
        this.addPartispants(phno);
        phoneNumber.value = '';
      } else {
        this.display_numbers.pop();
        this.display_numbers.push(phno);
        console.log(this.display_numbers);
        this.formControls.participants.setValue(this.display_numbers);
        phoneNumber.value = '';
      }
    }
  }*/

  public onTagEdited(item: any) {
    console.log('tag edited: current value is ' + item);
  }

  verify_user() {
    console.log(this.appointmentForm.value.phoneno);
    let phno = this.appointmentForm.value.phoneno.dialCode + this.appointmentForm.value.phoneno.number;
    phno = phno.replace('+','');
    phno = phno.replace(' ','');
    console.log('After notmalize',phno);
    // this.addCountryCode(this.appointmentForm.value.phoneno);
    console.log('Found', phno.replace('+',''));
    if (phno && !this.checkParticipantsExits(phno)) {
      console.log('Participants not exist');
      if (this.appointment && this.appointment.meeting_id) {
        this.addPartispants(phno);
        this.display_numbers.push(phno);
        this.appointmentForm.controls.phoneno.setValue('');
      } else {
        console.log('exist');
        this.display_numbers.push(phno);
        console.log(this.display_numbers);
        this.formControls.participants.setValue(this.display_numbers);
        this.appointmentForm.controls.phoneno.setValue('');
      }
    }
  }

  addEvent(form: any) {
    this.submitted = true;
    if (form.invalid) {
      return false;
    }

    let formdata: any = form.value;
    let phoneNumber = this.addCountryCode(formdata.phno);
    if (phoneNumber && !this.checkParticipantsExits(phoneNumber)) {
      this.display_numbers.push(phoneNumber);
    }

    let hostNumber = this.userService.Code + this.userService.PhoneNumber;
    console.log('host', hostNumber);
    let parts = this.formControls.participants.value;
    console.log('parts', parts);
    console.log('parts[0]', parts[0]);

    if (parts[0] != hostNumber) {
      parts.splice(0, 0, hostNumber);
    }
    //console.log('this.appointmentForm.value',)
    this.formControls.participants.setValue(parts);
    this.calenderService.createEvent(this.appointmentForm.value).subscribe(
      res => {
        var req = res;
        console.log(req);
        if (req.status_code === 200 && !req.is_error) {
          this.display_numbers = [];
          this.toast.fire({
            icon: 'success',
            title: req.display_msg
          });
          this.passEntry.emit(formdata.location);
          this.modalService.close(this.appointment);
          console.log('Success');
          this.display_numbers = [];
        } else {
          this.toast.fire({
            icon: 'error',
            title: req.display_msg
          });
        }
      },
      error => {
        console.log(error.error.display_msg);
        this.toast.fire({
          icon: 'error',
          title: error.error.display_msg
        });
      }
    );
  }

  checkParticipantsExits(phoneNumber: string) {
    let part = this.formControls.participants.value.find((p: any) => p == phoneNumber);
    return part ? true : false;
  }

  addCountryCode(phoneNumber: any) {
    if (!phoneNumber) {
      return null;
    }
    let countryCodeExits = false;
    this.codes.forEach(code => {
      if (phoneNumber.toString().startsWith(code.country_code)) {
        countryCodeExits = true;
        return false;
      }
    });
    console.log('Country code', this.userService.Code);
    if (!countryCodeExits) {
      return this.userService.Code + phoneNumber.toString();
    }
    return phoneNumber;
  }

  get subject() {
    return this.appointmentForm.get('subject');
  }

  get repeat_count() {
    return this.appointmentForm.get('repeat_count');
  }

  get repeat_interval() {
    return this.appointmentForm.get('repeat_interval');
  }
  get participants() {
    return this.appointmentForm.get('participants');
  }

  createEventForm(data?: any) {
    // Mininum date to display on the time control,(i.e Current time) so the event cannot be created for the past time.
    let mins = new Date().getTime();
    let diffMins = 30 * 60000 - (mins % (30 * 60000));

    // Default start time is the next half hour from the current time.
    let tstart = new Date(new Date().getTime() + diffMins);

    // Default end time is next 30 mins from the start time.
    let tend = new Date(new Date().getTime() + diffMins + 30 * 60000);

    // Default location for the event.
    //this.address = this.locations[0].name;

    this.appointmentForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      start_time: [tstart],
      end_time: [tend],
      location: [this.address],
      latitude: [''],
      longitude: [''],
      set_recurrence: [0],
      allow_forwarding: [0],
      repeat_interval: [1, [Validators.required, Validators.pattern('([1-9]{1,2}[0]?|99)')]],
      repeat_mode: [0],
      repeat_count: [1, [Validators.required, Validators.pattern('([1-9]{1,2}[0]?|99)')]],
      participants: ['', [Validators.required]],
      //change
      event_category: [0],
      business_link_id: [0],
      phoneno: ['']
    });

    //console.log(this.appointmentForm.value);
    /*this.formControls.repeat_mode.valueChanges.subscribe(s => {
      console.log(s);
    });*/
    this.formControls.start_time.valueChanges.subscribe(s => {
      // console.log(s);
      this.formControls.end_time.setValue(
        moment(s)
          .add(30, 'minutes')
          .toDate()
      );
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.appointment.controls;
  }
  rec_display(event: any) {
    //console.log(event);
    if (event.currentTarget.checked) {
      //console.log('if ec');
      this.formControls.set_recurrence.setValue(1);
      this.formControls.repeat_interval.setValue(1);
      this.formControls.repeat_mode.setValue(1);
      this.formControls.repeat_count.setValue(1);
    } else {
      //console.log('if ec1');
      this.formControls.set_recurrence.setValue(0);
      this.formControls.repeat_interval.setValue(0);
      this.formControls.repeat_mode.setValue(0);
      this.formControls.repeat_count.setValue(0);
    }
  }

  setAllowForwarding(event: any) {
    //console.log('Allow fwd', event.currentTarget.checked);
    if (event.currentTarget.checked) {
      //console.log('sss');
      this.formControls.allow_forwarding.setValue(1);
    } else {
      //console.log('sss');
      this.formControls.allow_forwarding.setValue(0);
    }
    /*if(this.data.meeting_id){
        this.updateEventOptions();
    }*/
  }

  getParticipants() {
    //console.log('Meeting0', this.appointment.meeting_id);
    var obj: GetParticipants = {
      meeting_id: this.appointment.meeting_id,
      request_type: 1,
      previous_index: 0,
      max_limit: 100
    };

    let subs = this.calenderService.getParticipentList(obj).subscribe(res => {
      console.log('event particcant', res);
      this.eventParticipants = res.res_data;
      this.eventParticipants.forEach((participant: any) => {
        //  this.event.phno.push(participant);
        if (participant.contact_number == this.userService.LoggedInUser.phoneNumber) {
          this.currentUserMeetingParticipant = participant;
          var status =
            this.EventHost == this.User.phoneNumber && !this.appointment.is_cancelled
              ? 1
              : this.currentUserMeetingParticipant.status;
          this.UserStatus.setValue(status);
        }
      });
      /*this.appointment.start_time = new Date(new Date(this.appointment.start_time).getTime() - this.timezoneOffset * 60000)//event.MeetingStartTimestamp
            this.appointment.end_time = new Date(new Date(this.appointment.end_time).getTime() - this.timezoneOffset * 60000)
            this.appointmentForm.patchValue(this.appointment);
            this.formControls.start_time.setValue(new Date(this.appointment.start_time));
            this.formControls.end_time.setValue(new Date(this.appointment.end_time));
            this.display_numbers = this.eventParticipants.map((p: any) => p.contact_number);
            this.formControls.participants.setValue(this.display_numbers);*/
    });
    //  this.subscriptions.push(subs);
  }
  get EventHost() {
    return this.appointment.particpants[0].contact_number;
  }
  get User() {
    return this.userService.LoggedInUser;
  }
  user_options() {
    console.log('this', this.appointment.particpants);
    if (this.appointment.particpants[0].contact_number == this.userService.LoggedInUser.phoneNumber) {
      this.statuses = [
        { id: 1, name: 'Scheduled' },
        { id: 6, name: 'Cancel' }
      ];
    } else {
      this.statuses = [
        { id: 0, name: 'Respond' },
        { id: 3, name: 'Accept' },
        { id: 4, name: 'Decline' },
        { id: 5, name: 'Tentative' }
      ];
    }
  }

  public cancelEventConfirmationDialog() {
    this.confirmationDialogService.confirm('Do you really want to Cancel event?').then(confirmed => {
      if (confirmed) {
        this.cancelEvent();
      }
    });
  }

  public deleteEventConfirmationDialog() {
    this.confirmationDialogService.confirm('Do you really want to Delete event?').then(confirmed => {
      if (confirmed) {
        this.deleleEvent();
      }
    });
  }

  cancelEvent() {
    let data: CancelMeeting = {
      set_recurrence: this.appointment.set_recurrence,
      recur_meeting_id: this.appointment.recur_meeting_id,
      meeting_id: this.appointment.meeting_id
    };

    
    this.calenderService.cancelEvent(data).subscribe(
      req => {
        if (req.status_code === 200 && !req.is_error) {
          //this.deleleEvent();
          this.toast.fire({
            icon: 'success',
            title: 'Meeting Cancelled Successsfully'
          });
          this.modalService.close(this.appointment);
        } else {
          this.toast.fire({
            icon: 'error',
            title: 'Error'
          });
        }
        //this.showError(req.display_numbers);
      },
      err => {
        this.toast.fire({
          icon: 'error',
          title: 'Error'
        });
      }
    );
  }

  onChange(event: any) {
    console.log(event.target.value);
    if (event.target.value == "6") {
      this.cancelEvent();
      //this.cancelEventConfirmationDialog();
    } else if (event && event.target.value != 6) {
      this.updateStatus(event.target.value);
    }
  }

  get canEdit() {
    return moment(this.formControls.start_time.value).isAfter();
  }

  deleleEvent() {
    console.log('Started to delete');
    let data: DeleteMeeting = {
      set_recurrence: this.appointment.set_recurrence,
      recur_meeting_id: this.appointment.recur_meeting_id,
      meeting_id: this.appointment.meeting_id
    };

    this.calenderService.removeEvent(data).subscribe(
      req => {
        if (req.status_code === 200 && !req.is_error) {
          //this.calenderService.removeEvent(data);
          this.toast.fire({
            icon: 'success',
            title: req.display_msg
          });
          console.log('ssssssssss', this.appointment.location);
          this.passEntry.emit('delete');
          //this.passEntry.emit(this.appointment.type);
          this.modalService.close(this.appointment);
        } else {
          this.toast.fire({
            icon: 'error',
            title: req.display_msg
          });
        }
        //this.showError(req.display_numbers);
      },
      error => {
        this.toast.fire({
          icon: 'error',
          title: error.error.display_msg
        });
      }
    );
  }

  updateStatus(status:any) {
    let data: UpdateParticipantStatus = {
        set_recurrence: this.appointment.set_recurrence,
        recur_meeting_id: this.appointment.recur_meeting_id,
        meeting_id: this.appointment.meeting_id,
        status: status
    }
    console.log('Update status:',data)
    this.calenderService.updateStatus(data)
        .subscribe((req) => {
            if (req.status_code === 200 && !req.is_error) {
                this.toast.fire({
                  icon: 'success',
                  title: req.display_msg
                });
            } else {
                this.toast.fire({
                  icon: 'error',
                  title: req.display_msg
                });
            }
            //this.showError(req.display_numbers);
        }, err => { 
          this.toast.fire({
            icon: 'error',
            title: err.error.display_msg
          }); 
    })
  }
}
