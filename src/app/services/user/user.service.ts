import {Injectable} from '@angular/core';
import {CreateAccount} from '../../interfaces/user/create-account';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {User} from '../../interfaces/user/user';
import {catchError, share} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private observableUser: BehaviorSubject<User>;

    constructor(
        private http: HttpClient,
    ) {
        this.observableUser = new BehaviorSubject(null);
        this.observableUser.pipe(share());
    }

    createUser(createAccount: CreateAccount): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/user/create', createAccount);
    }

    getRemoteUser(): Observable<User> {
        // If there was an HTTP error, as is the case when we try to get the user and none is connected, we return null (see catchError())
        return this.http.get<User>(environment.BACKEND_URL + '/api/auth/user')
            .pipe(catchError((err: any, caught: Observable<User>) => of(null)));
    }

    setPerson(user: User): void {
        this.observableUser.next(user);
    }

    getUser(): BehaviorSubject<User> {
        return this.observableUser;
    }
}
