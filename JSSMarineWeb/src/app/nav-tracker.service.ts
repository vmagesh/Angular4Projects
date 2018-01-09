//Reference - http://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavTrackerService {

  constructor() { }
  
  private currentPageValue = new Subject<any>();
  
  sendMessage(message: string) {
      this.currentPageValue.next({ text: message });
  }

  clearMessage() {
      this.currentPageValue.next();
  }

  getCurrentPageValue(): Observable<any> {
      return this.currentPageValue.asObservable();
  }

}
