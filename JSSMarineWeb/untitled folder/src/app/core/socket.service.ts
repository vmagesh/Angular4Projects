import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatAuthenticate, ChatDeliveredRoom, ChatWelcomeMessage } from '../api-middleware';
import { EventsService } from './events.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private _socket: any;
  private url = environment.CHAT_SOCKET;
  constructor(private eventService: EventsService) {}

  public get Socket() {
    return this._socket;
  }

  private connect() {
    this._socket.connect();
  }

  initialiseSocket() {
    this._socket = io(this.url, { transports: ['websocket'] });
    console.log('Intialising Socket Connection....');
    this.connect();
    this._socket.on('connect', (res: any) => {
      console.log('Socket Connection Established ....');
      console.log(this._socket.disconnected); // false
      this.authorise();
      this.subscribeToMessages();
    });
  }

  authorise() {
    let authenticatePayload: ChatAuthenticate = {
      Authorization: localStorage.getItem('jwt-token')
    };
    this._socket.emit('authenticate', authenticatePayload);
    console.log('Socket Autherising...');
  }

  subscribeToMessages() {
    this._socket.on('welcome-message', (res: ChatWelcomeMessage) => {
      if (res) {
        console.log('Socket Authorised..');
        this._socket.emit('get-undelivered-messages');
      }
    });

    this._socket.on('authentication-response', (res: any) => {
      if (!res.is_error) {
        console.log('Socket Authorised..');
        // this._socket.emit('get-undelivered-messages');
      }
    });
    this._socket.on('receive-message', (res: any) => {
      this.eventService.Notifications = res;
      this.sendRoomDelivered(res, false);
    });
    // this._socket.on('meeting-update', (res) => {
    //     this.eventService.Notifications = res;
    //     this.sendRoomDelivered(res.meeting_id);
    // });
    this._socket.on('receive-system-message', (res: any) => {
      this.eventService.Notifications = res;
      let refreshEvents = Number(res.display_recur_msg) == 0 ? true : false;
      // Only Call get events apis if recur_message is 0.
      this.sendRoomDelivered(res, refreshEvents);
    });
    this._socket.on('disconnect', (reason: any) => {
      console.log(reason);
      //  if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      this.connect();
      //  }
      // else the socket will automatically try to reconnect
    });
  }

  private sendRoomDelivered(response: any, refreshEvents: any) {
    const data: ChatDeliveredRoom = {
      meeting_ids: [response.id]
    };
    this._socket.emit('delivered-room', data);
    console.log('delivered');
    if (refreshEvents) {
      this.eventService.getEvents();
    }
  }

  disconnect() {
    this._socket.emit('disconnect');
  }
}
