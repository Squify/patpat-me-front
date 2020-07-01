import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {
    getData: Observable<any>;
    private dataSubject = new Subject<any>();

    constructor() {
        this.getData = this.dataSubject.asObservable();
    }

    sendData(data) {
        this.dataSubject.next(data);
    }
}
