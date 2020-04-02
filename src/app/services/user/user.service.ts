import {Injectable} from '@angular/core';
import {CreateAccount} from '../../interfaces/create-account';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
    ) {
    }

    createUser(createAccount: CreateAccount): Observable<any> {
      return this.http.post<any>(environment.BACKEND_URL + '/api/user/create', createAccount);
    }
}
