import { MeetingParticipants } from '../api-middleware';

export class Event {
  title: string;
  time_start: any;
  time_end: any;
  location?: string;
  notes?: string;
  phno: MeetingParticipants[];
  status: string;
  id: any;
  lat: any;
  long: any;
  meeting_seq_id: any;
  recur_meeting_id: any;
  creator: any;
  recurrence: any;
  allowForwarding: any;
  repeat_count: any;
  repeat_every: any;
  repeat_every_dwm: any;
  participants_deleted: any;
  participants_added: any;
  meeting_cancelled: any;
}
