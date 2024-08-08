import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { UserAuth } from '../domain-classes/user-auth';
import { CommonHttpErrorService } from '../error-handler/common-http-error.service';
import { CommonError } from '../error-handler/common-error';
import { User } from '@core/domain-classes/user';
import { Router } from '@angular/router';
import { ClonerService } from '@core/services/clone.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  // securityObject: UserAuth = new UserAuth();
  private _securityObject$: BehaviorSubject<User> = new BehaviorSubject<User>(
    null
  );

  private _claims: { [key: string]: string } = null;

  public get Claims(): { [key: string]: string } {
    if (this._claims) {
      return this._claims;
    }

    const token = localStorage.getItem('bearerToken');
    if (token) {
      this._claims = jwtDecode(token);
    }
    return this._claims;
  }

  public get securityObject$(): Observable<User> {
    return this._securityObject$;
    // return this._securityObject$.pipe(
    //   map((c) => {
    //     if (c) {
    //       return c;
    //     }
    //     let token = localStorage.getItem('bearerToken');
    //     if (token) {
    //       const jwtpayload = jwtDecode<User>(token);
    //       this._securityObject$.next(jwtpayload);
    //       return jwtpayload;
    //     }
    //     return null;
    //   })
    // );
  }
  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    private router: Router,
    private clonerService: ClonerService
  ) {}

  login(entity: User): Observable<UserAuth | CommonError> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http
      .post<UserAuth>('user/login', entity)
      .pipe(
        tap((resp) => {
          localStorage.setItem('bearerToken', resp.bearerToken);
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  isLogin(): boolean {
    const authStr = localStorage.getItem('bearerToken');
    if (authStr) return true;
    else return false;
  }

  socialLogin(entity: User): Observable<UserAuth | CommonError> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http
      .post<UserAuth>('SocialLogin/login', entity)
      .pipe(
        tap((resp) => {
          localStorage.setItem('bearerToken', resp.bearerToken);
        })
      )
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  logout(): void {
    this.resetSecurityObject();
  }

  resetSecurityObject(): void {
    localStorage.removeItem('bearerToken');
    this._securityObject$.next(null);
    this._claims = null;
    this.router.navigate(['/login']);
  }

  updateUserProfile(user: User) {
    this._securityObject$.next(user);
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="['claimType1','claimType2','claimType3']"
  // tslint:disable-next-line: typedef
  hasClaim(claimType: any): boolean {
    let ret = false;
    // See if an array of values was passed in.
    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType);
    } else {
      const claims: string[] = claimType;
      if (claims) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }
    return ret;
  }

  private isClaimValid(claimType: string): boolean {
    let ret = false;
    claimType = claimType.toLowerCase();
    // Attempt to find the claim
    if (Object.keys(this.Claims).indexOf(claimType) > -1) {
      ret = true;
    }
    return ret;
  }
}
