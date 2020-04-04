import {Injectable} from '@angular/core';
import {CreateAccount} from '../../interfaces/create-account';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import { User } from 'src/app/interfaces/user';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    

    constructor(
        private http: HttpClient,
    ) { }

    createUser(createAccount: CreateAccount): Observable<any> {
      return this.http.post<any>(environment.BACKEND_URL + '/api/user/create', createAccount);
    }

    getUser(): Observable<User> {
        return this.http.get<User>(environment.BACKEND_URL + '/api/user/get');
    }
    
}
