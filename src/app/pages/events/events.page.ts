import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { EventService } from '../../services/event/event.service';
import { EventInterface } from '../../interfaces/event/event-interface';
import { UpdateService } from '../../services/update/update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-events',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage {

    events: EventInterface[] = [];
    filters = [];
    filterArgs = [];

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;

    constructor(
        private menu: MenuController,
        private eventService: EventService,
        private errorService: ErrorService,
        private updateService: UpdateService,
    ) {
    }

    ngOnInit() {

        this.getEvents();
        this.getTypes();

        this.updateService.getObservable().subscribe((data) => {
            switch (data) {
                case 'createEvent':
                    this.getEvents();
                    break;
                case 'updateEvent':
                    this.getEvents();
                    break;
                default:
                    break;
            }
        });
    }

    getEvents(): void {

        this.events = [];
        this.eventService.getEvents().subscribe(
            val => this.events = val,
            // error => this.processError(error)
        );
    }

    openFilter() {
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }

    updateArgs() {
        this.filterArgs = [];
        this.filters.forEach(filter => {
            if (filter.value === true) {
                this.filterArgs.push(filter.label);
            }
        });
    }

    getTypes(): void {
        this.eventService.getEventType().subscribe(
            val => {
                val.forEach((type) => {
                        const filter = {
                            name: '',
                            label: type.name,
                            value: false
                        };
                        this.filters.push(filter);
                    }
                );
            }
        );
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.errorService.presentToast('back_input');
                    break;
                case 500:
                    this.serverError = true;
                    this.errorService.presentToast('back_server');
                    break;
                default:
                    this.unknownError = true;
                    this.errorService.presentToast('back_unknown');
                    break;
            }
        } else {
            this.unknownError = true;
            this.errorService.presentToast('back_unknown');
        }
    }
}
