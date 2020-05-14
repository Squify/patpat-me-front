import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CreateEvent} from '../../interfaces/event/create-event';
import {EventType} from '../../interfaces/event/event-type';
import {EventInterface} from "../../interfaces/event/event-interface";

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

    public getEventById(eventId: number): Observable<EventInterface> {

        const params: HttpParams = new HttpParams().set('eventId', eventId.toString());
        return this.http.get<EventInterface>(environment.BACKEND_URL + '/api/event', {params});
    }

    getEvents(): Observable<EventInterface[]> {
        return this.http.get<EventInterface[]>(environment.BACKEND_URL + '/api/events');
    }
}
