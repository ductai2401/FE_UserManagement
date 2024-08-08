import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { MyProfileResolverService } from './user/my-profile/my-profile-resolver';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: LayoutComponent,
    resolve: { profile: MyProfileResolverService },
    children: [
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'actions',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./action/action.module').then((m) => m.ActionModule),
      },
      {
        path: 'pages',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./page/page.module').then((m) => m.PageModule),
      },
      {
        path: 'page-action',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./page-action/page-action.module').then(
            (m) => m.PageActionModule
          ),
      },
      {
        path: 'roles',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./role/role.module').then((m) => m.RoleModule),
      },
      {
        path: 'users',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'login-audit',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./login-audit/login-audit.module').then(
            (m) => m.LoginAuditModule
          ),
      },
      {
        path: 'sessions',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./session/session.module').then((m) => m.SessionModule),
      },
      {
        path: 'appsettings',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./app-settings/app-settings.module').then(
            (m) => m.AppSettingsModule
          ),
      },
      {
        path: 'email-template',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./email-template/email-template.module').then(
            (m) => m.EmailTemplateModule
          ),
      },
      {
        path: 'send-email',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./email-send/email-send.module').then(
            (m) => m.EmailSendModule
          ),
      },
      {
        path: 'logs',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./n-log/n-log.module').then((m) => m.NLogModule),
      },
      {
        path: 'email-smtp',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./email-smtp-setting/email-smtp-setting.module').then(
            (m) => m.EmailSmtpSettingModule
          ),
      },
      {
        path: '**',
        redirectTo: '/',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
