import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalenderRoutingModule } from './calender-routing.module';
import { CalenderComponent } from './calender.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentComponent } from './appointment/appointment.component';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgBootstrapDatetimeAngularModule } from 'ng-bootstrap-datetime-angular';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [CalenderComponent, AppointmentComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    CalenderRoutingModule,
    FullCalendarModule,
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgBootstrapDatetimeAngularModule,
    TagInputModule,
    FormsModule,
    AutocompleteLibModule,
    BrowserAnimationsModule,
    BrowserModule,
    NgxIntlTelInputModule
  ],
  exports: [CalenderComponent],
  providers: [ConfirmationDialogService],
  entryComponents: [AppointmentComponent, ConfirmationDialogComponent]
})
export class CalenderModule {}
