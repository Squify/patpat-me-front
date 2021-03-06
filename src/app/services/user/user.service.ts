import { Injectable } from '@angular/core';
import { AccountCreate } from '../../interfaces/user/account-create';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user/user';
import { catchError, share } from 'rxjs/operators';
import { AccountEdit } from '../../interfaces/user/account-edit';
import { Animal } from '../../interfaces/animal/animal';
import { Friend } from '../../interfaces/user/friend';


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

    createUser(accountCreate: AccountCreate): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/user/create', accountCreate);
    }

    updateUser(accountEdit: AccountEdit): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/user/update', accountEdit);
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

    getUserAnimals(): Observable<Animal[]> {
        return this.http.get<Animal[]>(environment.BACKEND_URL + '/api/animals');
    }

    getUserInformationsById(userId: number): Observable<Friend> {

        const params: HttpParams = new HttpParams().set('userId', userId.toString());
        return this.http.get<Friend>(environment.BACKEND_URL + '/api/user', {params});
    }

    getUserFriends(): Observable<any> {

        return this.http.get<any>(environment.BACKEND_URL + '/api/user/friends');
    }

    loadProfilePics(): string[] {
        let picPaths = [];
        picPaths.push(environment.default_profile_pic)
        for (let i = 1; i <= 24; i++) {
            picPaths.push('/assets/images/profile_pic/profile_' + i + '.png')
        }
        return picPaths;
    }
}
