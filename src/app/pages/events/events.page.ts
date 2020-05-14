import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {EventService} from "../../services/event/event.service";
import {EventInterface} from "../../interfaces/event/event-interface";

@Component({
    selector: 'app-events',
    templateUrl: 'events.page.html',
    styleUrls: ['events.page.scss']
})
export class EventsPage {

    events: EventInterface[] = [];
    filters = [
        {
            name: '',
            label: 'Randonnée',
            value: false
        },
        {
            name: '',
            label: 'Promenade',
            value: false
        },
        {
            name: '',
            label: 'Rencontre',
            value: false
        },
        {
            name: '',
            label: 'Jeux',
            value: false
        },
        {
            name: '',
            label: 'Pique nique',
            value: false
        },
        {
            name: '',
            label: 'Sortie en mer',
            value: false
        }
    ];

    filterArgs = [];

    constructor(
        private menu: MenuController,
        private eventService: EventService,
    ) {
    }

    ngOnInit() {
        this.getEvents();
    }

    getEvents(): void {

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
                        };
                        this.events.push(eventToAdd);
                    }
                );
            }
        );

      console.log(this.events);
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
}
