import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './session.component';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path:'',
    component: SessionComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'online_users_list' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
