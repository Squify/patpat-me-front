import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import places from 'places.js';

@Component({
    selector: 'app-places',
    templateUrl: './places.component.html',
    styleUrls: ['./places.component.scss'],
})
export class PlacesComponent implements AfterViewInit, OnDestroy {
    private instance = null;
    public data: string;

    @ViewChild('input', null) input;
    @Output() onChange? = new EventEmitter();
    @Input() defaultLocation: string;

    constructor(
        private ngZone: NgZone,
        private geolocationService: GeolocationService,
    ) {
    }

    ngAfterViewInit() {
        this.instance = places({
            container: this.input.nativeElement
            // places options
        });
        this.ngZone.run(() => this.input.nativeElement.value = this.defaultLocation);
    }

    ngOnDestroy() {
        this.instance.destroy();
    }

    sendValue() {
        this.geolocationService.sendData(this.input.nativeElement.value);
    }
}
