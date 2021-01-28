import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppoinmentsRoutingModule } from './appoinments-routing.module';
import { AppoinmentsComponent } from './appoinments.component';
import { ChatComponent } from './components/chat/chat.component';
import { EventNamePipe } from '@app/core/event-name-pipe';
import { AppointmentFilterPipe } from '@app/core/appointment-filter-pipe';

@NgModule({
  declarations: [AppoinmentsComponent, ChatComponent, EventNamePipe, AppointmentFilterPipe],
  imports: [CommonModule, FormsModule, AppoinmentsRoutingModule],
  entryComponents: [ChatComponent]
})
export class AppoinmentsModule {}
