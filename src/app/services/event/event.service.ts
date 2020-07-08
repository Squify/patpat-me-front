import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EventCreate } from '../../interfaces/event/event-create';
import { EventType } from '../../interfaces/event/event-type';
import { EventInterface } from '../../interfaces/event/event-interface';
import { EventEdit } from '../../interfaces/event/event-edit';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(
        private http: HttpClient,
    ) {
    }

    createEvent(createEvent: EventCreate): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/event/create', createEvent);
    }

    editEvent(eventEdit: EventEdit): Observable<any> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/event/edit', eventEdit);
    }

    getEventType(): Observable<EventType[]> {
        return this.http.get<EventType[]>(environment.BACKEND_URL + '/api/event/type');
    }

    getEventById(eventId: number): Observable<EventInterface> {

        const params: HttpParams = new HttpParams().set('eventId', eventId.toString());
        return this.http.get<EventInterface>(environment.BACKEND_URL + '/api/event', {params});
    }

    getEvents(): Observable<EventInterface[]> {
        return this.http.get<EventInterface[]>(environment.BACKEND_URL + '/api/events');
    }

    changeEventParticipation(eventId: number): Observable<EventInterface> {
        return this.http.post<any>(environment.BACKEND_URL + '/api/event/participation', eventId);
    }
}
