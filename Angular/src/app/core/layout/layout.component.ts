import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/domain-classes/user';
import { SecurityService } from '@core/security/security.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.setProfile();
  }

  setProfile() {
    this.route.data.subscribe((data: { profile: User }) => {
      if (data.profile) {
        this.securityService.updateUserProfile(data.profile);
      }
    });
  }
}
