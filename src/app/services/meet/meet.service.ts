import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MetUser } from '../../interfaces/user/met-user';

@Injectable({
    providedIn: 'root'
})
export class MeetService {

    constructor(
        private http: HttpClient
    ) {
    }

    getMetUsers(): Observable<MetUser[]> {
        return this.http.get<MetUser[]>(environment.BACKEND_URL + '/api/meet/users');
    }
}
