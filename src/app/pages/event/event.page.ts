import {Component, NgZone, OnInit} from '@angular/core';
import {EventService} from '../../services/event/event.service';
import {EventInterface} from '../../interfaces/event/event-interface';
import {EventType} from '../../interfaces/event/event-type';

@Component({
    selector: 'app-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

    event: EventInterface;
    types: EventType[] = [];

    selectedSegment = 'informationSegment';
    type = 'Randonnée';
    url = '/src/assets/images/event-type/' + this.type + '.jpg';
    private img = '/assets/images/grumpy.jpg';

    constructor(
        private eventService: EventService,
        private ngZone: NgZone
    ) {
    }

    ngOnInit() {
        this.getTypes();
        this.getEvent();
    }

    getEvent(): void {

        this.eventService.getEventById(1).subscribe(
            value => {
                this.event = value;
            },
            e => console.log(e)
        );
    }

    changeEventParticipation(): void {

        this.eventService.changeEventParticipation(this.event.id).subscribe(
            _ => // TODO : gestion erreur
                e => console.log(e)
        );
        this.ngZone.run(() => this.getEvent())
    }

    getTypes(): void {
        this.eventService.getEventType().subscribe(
            val => {
                val.forEach((type) => {
                        const typeToAdd: EventType = {
                            id: type.id,
                            name: type.name
                        };
                        this.types.push(typeToAdd);
                    }
                );
            }
        );
    }

    segmentChanged(ev: any) {

        this.selectedSegment = ev.detail.value;
    }
}
