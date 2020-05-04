import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {User} from '../interfaces/user/user';
import {UserService} from '../services/user/user.service';


@Injectable({
    providedIn: 'root'
})
export class LoggedInPersonResolver implements Resolve<User> {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        return this.userService.getRemoteUser();
    }
}
