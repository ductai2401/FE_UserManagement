import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from '@core/domain-classes/user';
import { SecurityService } from '@core/security/security.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200)),
    ]),
  ],
})
export class SidebarComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  appUserAuth: User = null;

  constructor(private securityService: SecurityService) {
    super();
  }
  ngAfterViewInit(): void {
    $('[data-widget="treeview"]').Treeview('init');
  }

  ngOnInit() {
    this.setTopLogAndName();
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe((c) => {
      if (c) {
        this.appUserAuth = c;
        if (this.appUserAuth.profilePhoto) {
          this.appUserAuth.profilePhoto = `${environment.apiUrl}${this.appUserAuth.profilePhoto}`;
        }
      }
    });
  }
}
