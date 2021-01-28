import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserManagementComponent, AddUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementRoutingModule,
    InternationalPhoneNumberModule
  ],
  entryComponents: [AddUserComponent]
})
export class UserManagementModule {}
