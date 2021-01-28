import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { UserManagementComponent } from './user-management.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/user-management', pathMatch: 'full' },
    { path: 'user-management', component: UserManagementComponent, data: { title: extract('UserManagement') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserManagementRoutingModule {}
