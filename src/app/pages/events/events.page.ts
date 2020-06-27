import { Component, NgZone } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { EventService } from "../../services/event/event.service";
import { EventInterface } from "../../interfaces/event/event-interface";
import { UpdateService } from "../../services/update/update.service";

@Component({
    selector: 'app-events',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage {

    events: EventInterface[] = [];
    filters = [];
    filterArgs = [];

    constructor(
        private menu: MenuController,
        private eventService: EventService,
        private ngZone: NgZone,
        public updateService: UpdateService,
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
            val => {
                val.forEach((event) => {
                        const eventToAdd: EventInterface = {
                            id: event.id,
                            name: event.name,
                            description: event.description,
                            localisation: event.localisation,
                            date: event.date,
                            type: event.type,
                            owner: event.owner,
                            members: event.members,
                        };
                        this.events.push(eventToAdd);
                    }
                );
            }
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
}
