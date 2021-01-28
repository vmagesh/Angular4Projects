import { Component, OnInit, Input, Output, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { EventEmitter } from 'events';
import * as moment from 'moment';
import { environment } from '@env/environment';
import { ChatService, UserService, ChatGetMessageHistory, ChatSendMessage } from '@app/api-middleware';
import { AesService } from '@app/core/authentication/aes.service';
import { EventsService } from '@app/core/events.service';
import { SocketService } from '@app/core/socket.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'catch-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() meetingId: any;
  chatHistoyMessages: any = [];
  previous_index = 9999;
  message = '';
  getChatPoolhandler: any;
  private url = environment.CHAT_SOCKET;
  private socket: any;
  @ViewChild('chatWindow', { static: false }) private chatWindow: ElementRef;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private aes: AesService,
    private eventService: EventsService,
    private socketService: SocketService,
    public activeModal: NgbActiveModal
  ) {
    this.chatMessages.length = 0;
    this.chatHistoyMessages.length = 0;
    this.socket = this.socketService.Socket;
    this.socket.on('message-history', (res: any) => {
      this.chatMessages.length = 0;
      this.chatHistoyMessages.length = 0;
      this.chatHistoyMessages = this.sortChats(res);
    });
    this.socket.on('receive-message', (res: any) => {
      this.getEventChat();
    });
  }
  ngOnInit() {
    this.chatMessages.length = 0;
    this.chatHistoyMessages.length = 0;
    this.getEventChat();
  }

  get chatMessages() {
    return this.chatHistoyMessages.concat(
      this.eventService.Notifications.filter((n: { meeting_id: any }) => n.meeting_id === this.meetingId)
    );
  }

  set chatMessages(message: any) {
    this.chatMessages.length = 0;
    this.chatHistoyMessages.length = 0;
  }

  get HostNumber() {
    return localStorage.getItem('code').toString() + localStorage.getItem('phno').toString();
  }

  getEventChat() {
    let obj: ChatGetMessageHistory = {
      meeting_id: this.meetingId
    };
    this.socket.emit('get-message-history', obj);
  }

  sendEventChat() {
    if (!this.message || this.message.length == 0) {
      return false;
    }
    let obj: ChatSendMessage = {
      subject: '',
      sender_message_id: '',
      meeting_id: this.meetingId,
      message: this.message
    };
    this.socket.emit('send-message', obj);
    this.message = undefined;
  }

  private sortChats(chats: any) {
    return chats.sort((a: any, b: any) => {
      let x = moment();
      return moment(a.created_at).isSameOrBefore(b.created_at) ? -1 : 1;
    });
  }

  ngAfterViewChecked(): void {
    try {
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this.chatMessages.length = 0;
    this.chatHistoyMessages.length = 0;
    clearInterval(this.getChatPoolhandler);
    this.socket.emit('disconnect');
  }
}
