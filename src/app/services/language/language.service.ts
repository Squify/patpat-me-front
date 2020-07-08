import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Language } from '../../interfaces/user/language';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../interfaces/user/user';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    user: User;
    subscriptionUser: Subscription;
    language: string = 'fr';

    constructor(
        private http: HttpClient,
        private translate: TranslateService,
        private userService: UserService,
    ) {
        this.getUserDetail();
    }

    getUserDetail(): void {
        this.subscriptionUser = this.userService.getRemoteUser().subscribe(
            user => this.user = user
        );
    }

    getLanguage(): Observable<Language[]> {
        return this.http.get<Language[]>(environment.BACKEND_URL + '/api/languages');
    }

    changeLanguage(selectedLanguage): void {
        if (selectedLanguage === 'FR')
            this.language = 'fr';
        else if (selectedLanguage === 'EN')
            this.language = 'en';
        this.setLanguage();
    }

    setLanguage() {
        this.getUserDetail();
        if (this.user) {
            this.translate.setDefaultLang(this.user.language.name.toLowerCase());
            this.translate.use(this.user.language.name.toLowerCase());
        } else {
            this.translate.setDefaultLang(this.language);
            this.translate.use(this.language);
        }
    }
}
