import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AppoinmentsComponent } from './appoinments.component';
import { extract } from '@app/core';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/appointments', pathMatch: 'full' },
    { path: 'appointments', component: AppoinmentsComponent, data: { title: extract('Appointments') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppoinmentsRoutingModule {}
