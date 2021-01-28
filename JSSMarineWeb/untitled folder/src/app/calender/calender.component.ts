import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalenderService } from './calendar.service';
import { MeetingInfo, GetParticipants, LocationService } from '@app/api-middleware';
import { EventsService } from '@app/core/events.service';
import { EventInput, Calendar } from '@fullcalendar/core';
import { Event } from './events';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/core/user.service';
import { AppointmentComponent } from './appointment/appointment.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { analytics } from 'firebase';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as moment from 'moment';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, animate, style } from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('.3s ease-in', style({ transform: 'translateX(0%)' }))
      ])
    ])
  ]
})
export class CalenderComponent implements OnInit, AfterViewInit {
  //@ViewChild(AppointmentComponent) child: ChildComponent;
  model: NgbDateStruct;
  date: { year: number; month: number };
  @ViewChild(AppointmentComponent, { static: false }) child: AppointmentComponent;
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  calendarEvents: EventInput[] = [];
  private _events: any = [];
  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;
  calendarApi: Calendar;
  initialized = false;
  locationFilter = '-1';
  visible = false;
  selectedItem: any = '';
  inputChanged: any = '';

  items2: any[] = [
    { id: 0, payload: { label: 'Tom' } },
    { id: 1, payload: { label: 'John' } },
    { id: 2, payload: { label: 'Lisa' } },
    { id: 3, payload: { label: 'Js' } },
    { id: 4, payload: { label: 'Java' } },
    { id: 5, payload: { label: 'c' } },
    { id: 6, payload: { label: 'vc' } }
  ];
  config2: any = { placeholder: 'test', sourceField: ['payload', 'label'] };

  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Usa'
    },
    {
      id: 2,
      name: 'England'
    }
  ];

  searchMeetingData: any = [];

  selectEvent(event: any) {
    this.eventclick(event, true);
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    this.searchMeetingData = [];
    for (var i = 0; i < this.allCalendarEvents.length; i++) {
      this.searchMeetingData.push({
        meeting_id: this.allCalendarEvents[i].meeting_id,
        name: this.allCalendarEvents[i].subject
      });
    }
  }

  calendarOptions = {
    aspectRatio: 1.8,
    plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin],
    header: {
      left: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay  today  prev,next'
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    views: {
      dayGrid2W: {
        type: 'dayGrid',
        duration: { weeks: 2 },
        dateIncrement: { weeks: 1 },
        buttonText: '2T'
      },
      theme: 'bootstrap',
      dayGrid3W: {
        type: 'dayGrid',
        duration: { weeks: 3 },
        dateIncrement: { weeks: 1 },
        buttonText: '3T',
        visibleRange: function(currentDate: any) {
          console.log(currentDate);
          return {
            start: currentDate.clone().subtract(1, 'weeks'),
            end: currentDate.clone().add(3, 'weeks') // exclusive end, so 3
          };
        }
      }
    },
    defaultView: 'dayGridMonth'
  };
  readonly: boolean = true;
  filterDatePicker: string;
  public event: Event = {
    title: '',
    time_end: '',
    time_start: '',
    location: '',
    notes: '',
    phno: [],
    status: '',
    id: '',
    lat: '',
    long: '',
    meeting_seq_id: '',
    recur_meeting_id: '',
    creator: '',
    recurrence: '',
    allowForwarding: '',
    repeat_count: '',
    repeat_every: '',
    repeat_every_dwm: '',
    participants_added: [],
    participants_deleted: [],
    meeting_cancelled: 0
  };
  private eventCopy: any;
  address: any;
  display_numbers: any[] = [];
  currentUserMeetingParticipant: any;
  now = new Date();
  timezoneOffset = this.now.getTimezoneOffset();
  tstart: Date;
  tend: Date;
  locations: any = [];
  phno = localStorage.getItem('phno');
  code = localStorage.getItem('code');
  statuses: any[];
  locationButtonName = 'Location';

  constructor(
    private calenderService: CalenderService,
    private eventService: EventsService,
    private userService: UserService,
    private modalService: NgbModal,
    private locationService: LocationService,
    private spinnerService: Ng4LoadingSpinnerService,
    private calendar: NgbCalendar
  ) {
    this.locations = userService.UserLocations;
    this.eventService.getEventupdate().subscribe(message => {
      console.log('message', message);
      if (message === 'TRUE') {
        this.processEvents();
      }
    });
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
  filterEventsOnLocation(selectedLocation: any) {
    //console.log('Called for filter',selectedLocation);
    this.locationFilter = selectedLocation;
    console.log('Selected Location', this.locationFilter);
    this.displayEvents(this.allCalendarEvents);
  }
  ngOnInit() {
    this.spinnerService.show();
    this.getLocations();
    setTimeout(() => {
      this._events = this.processEvents();
    }, 1000);
    this.filterEventsOnLocation('-1');
    console.log('Location', this.locations);
    this.spinnerService.hide();
  }

  ngAfterViewInit(): void {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('height', window.innerHeight - 160);
    console.log(moment().format('HH:mm'));
    calendarApi.scrollToTime(moment().format('HH:mm'));
  }
  processEvents() {
    //console.log('Callinf==========================');
    this.displayEvents(this.allCalendarEvents);
  }

  public get allCalendarEvents() {
    return this.eventService.Events;
  }

  isEventCreatedByLoggedinUser(event: any) {
    return event.host_contact_number === this.User.phoneNumber;
  }

  displayEvents(allEvents: any[]) {
    let all_events: any = [];
    // events = events.filter(e => !this.locationFilter || this.locationFilter == e.location);
    console.log('Location filter:', this.locationFilter);
    let events =
      this.locationFilter != '-1'
        ? allEvents.filter((e: { location: string }) => !this.locationFilter || this.locationFilter == e.location)
        : allEvents;
    console.log('Events:', events);
    console.log('Lenght of event', events.length);
    events.forEach((event: any) => {
      if (event) {
        var temp: any = {};
        temp.title = Number(event.is_cancelled) > 0 ? 'Canceled:' + event.subject : event.subject;
        temp.start = new Date(event.start_time).getTime() - this.timezoneOffset * 60000;
        temp.end = new Date(event.end_time).getTime() - this.timezoneOffset * 60000;
        temp.id = event.recur_meeting_id;
        //temp.daysOfWeek= [ '0','4' ];
        temp.allDay = true;
        temp.extendedProps = { meeting_seq_id: event.meeting_id, meeting_status: Number(event.is_cancelled ? 1 : 0) };
        temp.backgroundColor = !event.is_cancelled ? '#deecf9' : '#ffcccb';
        if (this.isEventCreatedByLoggedinUser(event)) {
          temp.classNames = !event.is_cancelled ? ['accepted-event'] : ['canceled-event'];
        } else {
          let currentUserEventStatus = event.status;
          switch (currentUserEventStatus) {
            case 1:
              temp.classNames = ['respond-event'];
              break;
            case 2:
              temp.classNames = ['tentitive-event'];
              break;
            case 3:
              temp.classNames = ['accepted-event'];
              break;
            case 4:
              temp.classNames = ['canceled-event'];
              break;
            case 5:
              temp.classNames = ['canceled-event'];
              break;
            default:
              temp.classNames = ['respond-event'];
              break;
          }
        }
        all_events.push(temp);
      }
    });
    console.log('Calander events:', this.calendarEvents);
    this.calendarEvents = all_events;
  }

  eventRender($event: any) {
    if ($event.event.extendedProps.meeting_status > 0) {
      $($event.el)
        .find('.fc-title')
        .css({ 'text-decoration': 'line-through' });
    }
  }

  eventclick(event: any, serachEvent: boolean) {
    this.spinnerService.show();
    setTimeout(() => this.spinnerService.hide(), 800);
    this.readonly = true;
    if (!serachEvent) {
      var obj: MeetingInfo = {
        meeting_ids: [event.extendedProps.meeting_seq_id]
      };
    } else {
      var obj: MeetingInfo = {
        meeting_ids: [event.meeting_id]
      };
    }
    this.calenderService.getMeetinInfo(obj).subscribe(res => {
      var req = res;
      //console.log(req);
      var event: any = req.res_data[0];
      console.log('req.res_data[0]',req.res_data[0]);
      this.event.title = event.subject;
      this.event.time_start = new Date(new Date(event.start_time).getTime() - this.timezoneOffset * 60000); //event.MeetingStartTimestamp
      this.event.time_end = new Date(new Date(event.end_time).getTime() - this.timezoneOffset * 60000);
      this.address = event.location;
      this.event.lat = event.latitude;
      this.event.long = event.longitude;
      this.event.creator = event.participants[0].contact_number;
      this.event.meeting_seq_id = event.meeting_id;
      this.event.recur_meeting_id = event.recur_meeting_id;
      this.event.recurrence = event.set_recurrence;
      this.event.allowForwarding = event.allow_forwarding;
      this.event.repeat_count = event.repeat_count;
      this.event.repeat_every = event.repeat_interval;
      this.event.repeat_every_dwm = event.repeat_mode;
      this.event.location = event.location;
      this.event.meeting_cancelled = event.is_cancelled ? 1 : 0;
      this.eventCopy = Object.assign({}, this.event);
      this.user_options();
      var obj: GetParticipants = {
        meeting_id: event.meeting_id,
        request_type: 1,
        previous_index: 0,
        max_limit: 100
      };
      this.event.phno = [];
      //this.getcurrenttime(event);
      this.getParticipants(obj);
      //this.openModal('edit', '');
      console.log('Before');
    });
  }

  datesRender($event: any) {
    this.eventService.EventSyncedStartTime = $event.view.props.dateProfile.currentRange.start;
    this.eventService.EventSyncedEndTime = $event.view.props.dateProfile.currentRange.end;
    this.eventService.getEvents();
    //console.log('Render events:',this.eventService.getEvents());
  }

  get User() {
    return this.userService.LoggedInUser;
  }

  getParticipants(obj: GetParticipants) {
    this.calenderService.getParticipentList(obj).subscribe(res => {
      var participants = res.res_data;
      //console.log('Particpants',participants);
      this.display_numbers = res.res_data;
      participants.forEach((participant: any) => {
        this.event.phno.push(participant);
        if (participant.contact_number == this.User.phoneNumber) {
          this.currentUserMeetingParticipant = participant;
        }
      });
      this.event.phno = participants;
      console.log('Assigned', this.event.phno);
      this.openModal('edit', '');
    });
  }
  getcurrenttime(data?: any) {
    // Mininum date to display on the time control,(i.e Current time) so the event cannot be created for the past time.
    let mins = new Date(this.now).getTime();
    let diffMins = 30 * 60000 - (mins % (30 * 60000));

    // Default start time is the next half hour from the current time.
    this.tstart = new Date(new Date(this.now).getTime() + diffMins);

    // Default end time is next 30 mins from the start time.
    this.tend = new Date(new Date(this.now).getTime() + diffMins + 30 * 60000);

    // Default location for the event.
    this.address = this.locations[0].name;
  }

  openModal(type: any, appointment: any) {
    const modalRef = this.modalService.open(AppointmentComponent);
    modalRef.componentInstance.user = type;
    if (type === 'add') {
      modalRef.componentInstance.appointment = {
        type: type
      };
      modalRef.componentInstance.passEntry.subscribe((result: any) => {
        setTimeout(() => {
          this._events = this.processEvents();
        }, 500);
        this.filterEventsOnLocation(result);
      });
    } else {
      modalRef.componentInstance.appointment = {
        type: type,
        title: this.event.title,
        start_time: this.event.time_start,
        end_time: this.event.time_end,
        location: this.address,
        set_recurrence: this.event.recurrence,
        allowForwarding: this.event.allowForwarding,
        repeat_count: this.event.repeat_count,
        repeat_interval: this.event.repeat_every,
        repeat_mode: this.event.repeat_every_dwm,
        particpants: this.event.phno,
        meeting_id: this.event.meeting_seq_id,
        recur_meeting_id: this.event.recur_meeting_id,
        is_cancelled: this.event.meeting_cancelled
      };

      modalRef.componentInstance.passEntry.subscribe((result: any) => {
        if (result == 'delete') {
          this.eventService.removeEvent(this.event);
          setTimeout(() => {
            this._events = this.processEvents();
          }, 500);
          for (var i = 0; i < this.allCalendarEvents.length; i++) {
            if (this.allCalendarEvents[i].meeting_id == this.event.meeting_seq_id) {
              this.allCalendarEvents.splice(i);
            }
          }
          this.filterEventsOnLocation(this.locationFilter);
        } else {
          this.eventService.removeEvent(this.event);
          setTimeout(() => {
            this._events = this.processEvents();
          }, 500);
          this.filterEventsOnLocation(this.locationFilter);
        }
      });
    }
  }

  user_options() {
    if (this.event.creator == this.code + this.phno) {
      this.statuses = [{ id: 6, name: 'Cancel' }];
    } else {
      this.statuses = [
        { id: 3, name: 'Accept' },
        { id: 4, name: 'Decline' },
        { id: 5, name: 'Tentative' }
      ];
    }
  }

  gotodate(selectedDate: any) {
    console.log('date', selectedDate.day.toString().length);
    console.log('month', selectedDate.year);
    console.log('date', selectedDate.month.toString().length);
    let formattedMonth = '';
    let formattedDay = '';
    if (selectedDate.month.toString().length == 1) {
      formattedMonth = '0' + selectedDate.month.toString();
    } else {
      formattedMonth = selectedDate.month.toString();
    }

    if (selectedDate.day.toString().length == 1) {
      formattedDay = '0' + selectedDate.day.toString();
    } else {
      formattedDay = selectedDate.day.toString();
    }

    this.filterDatePicker = selectedDate.year + '-' + formattedMonth + '-' + formattedDay;
    console.log('Original date', this.filterDatePicker);
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.filterDatePicker);
  }

  onSelect(item: any) {
    this.selectedItem = item;
  }

  onInputChangedEvent(val: string) {
    this.inputChanged = val;
  }
}
