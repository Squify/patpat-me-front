import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../../interfaces/user/user';
import { UserService } from '../../services/user/user.service';
import { LanguageService } from '../../services/language/language.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        readonly router: Router,
        readonly languageService: LanguageService,
        readonly userService: UserService,
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.userService.getRemoteUser().pipe(
            take(1),
            map((user: User) => {

                if (user) {
                    this.userService.setPerson(user);

                    this.languageService.changeLanguage(user.language);

                    return true;

                } else {
                    this.router.navigateByUrl('login');
                    return false;
                }
            })
        );
    }
}
