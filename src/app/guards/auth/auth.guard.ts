import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {mergeMap, take} from 'rxjs/operators';
import {User} from '../../interfaces/user';

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

        const test = this.userService.getRemoteUser().pipe(
            take(1),
            mergeMap((user: User) => {

                if (user) {
                    this.userService.setPerson(user);

                    // if (user.language) {
                    //     this.translate.setDefaultLang(user.language);
                    //     this.translate.use(user.language);
                    // }

                } else {
                    this.router.navigateByUrl('/login');
                    return of(false);
                }
            })
        );

        console.log('auth gard : ', test.subscribe());
        return test;

    }

}
