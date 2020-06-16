import { Component, NgZone } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { EventService } from "../../services/event/event.service";
import { EventInterface } from "../../interfaces/event/event-interface";

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
    ) {
    }

    ngOnInit() {
        this.getEvents();
        this.getTypes();
    }

    ionViewDidEnter() {
        this.ngZone.run(() => this.getEvents())
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
