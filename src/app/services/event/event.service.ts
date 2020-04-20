import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CreateEvent} from '../../interfaces/create-event';
import {EventType} from '../../interfaces/event-type';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(
        private http: HttpClient,
    ) {
    }

    createEvent(createEvent: CreateEvent): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/event/create', createEvent);
    }

    getEventType(): Observable<EventType[]> {
        return this.http.get<EventType[]>(environment.BACKEND_URL + '/api/event/type');
    }
}
