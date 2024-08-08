import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { CommonError } from '@core/error-handler/common-error';
import { User } from '@core/domain-classes/user';
import { OnlineUser } from '@core/domain-classes/online-user';
import { SignalrService } from '@core/services/signalr.service';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginFormGroup: UntypedFormGroup;
  isLoading = false;
  userData: User;
  resultMessage: string;
  fieldTextType: boolean = false;
  lat: number;
  lng: number;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private authService: SocialAuthService,
    private signalrService: SignalrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createFormGroup();
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }

  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      this.isLoading = true;
      var userObject = Object.assign(this.loginFormGroup.value, {
        latitude: this.lat,
        longitude: this.lng,
      });
      this.sub$.sink = this.securityService.login(userObject).subscribe(
        () => {
          this.isLoading = false;
          this.toastr.success('User login successfully.');
          // admin-lte issue for side bar https://github.com/ColorlibHQ/AdminLTE/issues/3599
          this.router.navigate(['/']);
        },
        (err: CommonError) => {
          this.isLoading = false;
          if (err.messages) {
            err.messages.forEach((msg) => {
              this.toastr.error(msg);
            });
          } else if (err.error) {
            this.toastr.error(err.error as string);
          }
        }
      );
    }
  }

  createFormGroup(): void {
    this.loginFormGroup = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onRegistrationClick(): void {
    this.router.navigate(['/registration']);
  }

  logInWithSocial(provider: string) {
    let platform = '';
    if (provider == 'google') {
      platform = GoogleLoginProvider.PROVIDER_ID;
    } else if (provider == 'facebook') {
      platform = FacebookLoginProvider.PROVIDER_ID;
    }
    this.authService
      .signIn(platform)
      .then((response) => {
        this.isLoading = true;
        this.userData = {
          email: response.email,
          userName: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          provider: platform,
          latitude: this.lat,
          longitude: this.lng,
        };
        this.sub$.sink = this.securityService
          .socialLogin(this.userData)
          .subscribe(
            (c: UserAuth) => {
              this.isLoading = false;
              this.toastr.success('User login successfully.');
              this.router.navigate(['/']);
            },
            (err: CommonError) => {
              this.isLoading = false;
              err.messages.forEach((msg) => {
                this.toastr.error(msg);
              });
            }
          );
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }
}
