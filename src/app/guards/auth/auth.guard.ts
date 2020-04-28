import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        readonly userService: UserService,
        readonly router: Router
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.userService.getRemoteUser().pipe(
            take(1),
            map((user: User) => {

                if (user) {
                    this.userService.setPerson(user);

                    // if (user.language) {
                    //     this.translate.setDefaultLang(user.language);
                    //     this.translate.use(user.language);
                    // }

                    return true;

                } else {
                    this.router.navigateByUrl('/login');
                    return false;
                }
            })
        );
    }
}
