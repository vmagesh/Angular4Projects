export * from './auth.service';
import { AuthService } from './auth.service';
export * from './chat.service';
import { ChatService } from './chat.service';
export * from './group.service';
import { GroupService } from './group.service';
export * from './meeting.service';
import { MeetingService } from './meeting.service';
export * from './terms.service';
import { TermsService } from './terms.service';
export * from './user.service';
import { UserService } from './user.service';
export * from './location.service';
import { LocationService } from './location.service';
export const APIS = [
  AuthService,
  ChatService,
  GroupService,
  MeetingService,
  TermsService,
  UserService,
  LocationService
];
