import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserGender } from '../../interfaces/user/user-gender';
import { environment } from '../../../environments/environment';
import { AnimalGender } from 'src/app/interfaces/animal/animal-gender';

@Injectable({
    providedIn: 'root'
})
export class GenderService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAnimalGender(): Observable<AnimalGender[]> {
        return this.http.get<AnimalGender[]>(environment.BACKEND_URL + '/api/animal/genders');
    }

    getUserGender(): Observable<UserGender[]> {
        return this.http.get<UserGender[]>(environment.BACKEND_URL + '/api/genders');
    }
}
