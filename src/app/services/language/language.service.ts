import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Language } from '../../interfaces/user/language';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    language: string = 'fr';

    constructor(
        private http: HttpClient,
        private translate: TranslateService
    ) {
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
        this.translate.setDefaultLang(this.language);
        this.translate.use(this.language);
    }
}
