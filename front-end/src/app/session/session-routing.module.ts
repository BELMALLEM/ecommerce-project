import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { MembersPageComponent } from './components/members-page/members-page.component';


const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: 'members', component: MembersPageComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
