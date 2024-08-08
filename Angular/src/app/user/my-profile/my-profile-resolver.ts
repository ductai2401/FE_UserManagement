import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { User } from '@core/domain-classes/user';
import { Observable, mergeMap, of, take } from 'rxjs';
import { UserService } from '../user.service';
import { jwtDecode } from 'jwt-decode';
import { Claim } from '@core/domain-classes/claim';

@Injectable({ providedIn: 'root' })
export class MyProfileResolverService implements Resolve<User> {
  constructor(private userService: UserService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    return this.userService.getUserProfile() as Observable<User>;
  }
}
