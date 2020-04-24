import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Credentials} from '../interfaces/password/credentials';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
      private http: HttpClient
  ) { }

  /**
   * POST the person's login data and get back a Person object if the authentication is successful
   * @param credentials
   * Person credentials
   */
  login(credentials: Credentials): Observable<User> {
    // Login credentials must be passed this way, because Spring Security expects the data to come from a form
    const formData = new HttpParams()
        .set('username', credentials.mail)
        .set('password', credentials.password);

    return this.http.post<User>(environment.BACKEND_URL + '/api/login', formData);
  }

  /**
   * Logout the currently logged in person
   */
  logout() {
    return this.http.post<any>(environment.BACKEND_URL + '/api/auth/logout', null);
  }
}
