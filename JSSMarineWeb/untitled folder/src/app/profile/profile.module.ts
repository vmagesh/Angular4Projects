import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationComponent } from './components/location/location.component';
import { LocationFilterPipe } from '@app/core/location-filter-pipe';
import { SubscriptionFilterPipe } from '@app/core/subscription-filter-pipe';
import { InvoiceFilterPipe } from '@app/core/invoice-filter-pipe';

@NgModule({
  declarations: [ProfileComponent, LocationComponent, LocationFilterPipe, SubscriptionFilterPipe, InvoiceFilterPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProfileRoutingModule],
  entryComponents: [LocationComponent]
})
export class ProfileModule {}
