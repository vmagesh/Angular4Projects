import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { GetMeetingList } from '../api-middleware/model/getMeetingList';
import { CalenderService } from '@app/calender/calendar.service';

interface Notification {
  Meeting_Id: number;
  Messages: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private _events: any = [];
  private _events_last_synced = '1975-01-01';
  private eventsUpdate: Subject<string> = new Subject();
  private _notifications: any = [];
  private _event_last_synced_start_time = moment().startOf('day');
  private _evednt_last_synced_end_time = moment().endOf('day');
  private _selectedEvent: any = null;
  constructor(private calenderService: CalenderService) {}

  public get Events() {
    return this._events;
  }

  public set Events(data) {
    this._events_last_synced = data.last_synced;
    let localCacheData = this._events;
    if (!localCacheData) {
      this._events = data.newEvents;
    } else {
      data.newEvents.forEach((event: any) => {
        let index = localCacheData.findIndex((e: any) => e.meeting_id === event.meeting_id);
        if (index > -1) {
          localCacheData[index] = event;
        } else {
          localCacheData.push(event);
        }
      });
      this._events = localCacheData;
    }
  }

  public get EventLastSynced() {
    return this._events_last_synced;
  }

  public get EventSyncedStartTime() {
    return this._event_last_synced_start_time;
  }

  public set EventSyncedStartTime(value) {
    this._event_last_synced_start_time = value;
  }

  public get EventSyncedEndTime() {
    return this._evednt_last_synced_end_time;
  }

  public set EventSyncedEndTime(value) {
    this._evednt_last_synced_end_time = value;
  }

  public get Notifications() {
    return this._notifications;
  }

  public set Notifications(value) {
    this._notifications.push(value);
  }

  public getEventupdate(): Observable<string> {
    return this.eventsUpdate.asObservable();
  }

  setEventUpdate(message: string) {
    this.eventsUpdate.next(message);
  }

  public get Event() {
    return this._selectedEvent;
  }
  public set Event(value) {
    this._selectedEvent = value;
  }

  public getEvents() {
    let data: GetMeetingList = {
      start_time: this._event_last_synced_start_time.toString(),
      end_time: this._evednt_last_synced_end_time.toString()
    };
    this.calenderService.getMeetings(data).subscribe(
      (res: any) => {
        var req = res;
        //  localStorage.setItem('last_sync_timestamp_for_events', req.sync_timestamp);

        var data = {
          newEvents: req.res_data,
          last_synced: ''
        };
        this.Events = data;

        if (req.res_data.length > 0) {
          this.setEventUpdate('TRUE');
        }
        //  this.updateEventCache(events)
        // this.allCalendarEvents = events;
        var all_events: any[] = [];
        // this.processEvents();

        // this.upComingEvents.forEach((e:any) => {
        //     console.log(e.title)
        //     console.log(moment(e.start).format("YYYY MMM DD"));
        // });
        // console.log(this.upComingEvents);
      },
      error => {
        console.log(error);
      }
    );
  }

  public removeEvent(event: any) {
    this._events = this._events.filter((e: any) => e.meeting_id !== event.meeting_id);
    this.setEventUpdate('TRUE');
  }
}
