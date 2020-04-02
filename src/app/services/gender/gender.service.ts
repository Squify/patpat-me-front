import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserGender} from '../../interfaces/user-gender';
import {environment} from '../../../environments/environment';
import {log} from 'util';

@Injectable({
    providedIn: 'root'
})
export class GenderService {
    genders: UserGender[];

    constructor(
        private http: HttpClient
    ) {
    }

    getUserGender(): Observable<UserGender[]> {
        return this.http.get<UserGender[]>(environment.BACKEND_URL + '/api/genders');
    }
}
