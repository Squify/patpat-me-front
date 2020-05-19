import {Component, NgZone, OnInit} from '@angular/core';
import {EventService} from '../../services/event/event.service';
import {EventInterface} from '../../interfaces/event/event-interface';
import {EventType} from '../../interfaces/event/event-type';
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

    event: EventInterface;
    types: EventType[] = [];
    eventId: number = null;

    selectedSegment = 'informationSegment';
    type = 'Randonnée';
    url = '/src/assets/images/event-type/' + this.type + '.jpg';
    private img = '/assets/images/grumpy.jpg';

    constructor(
        private eventService: EventService,
        private ngZone: NgZone,
        private userService: UserService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {

        this.eventId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.eventId) {
            this.router.navigateByUrl('/tabs/events');
        }

        this.getTypes();
        this.getEvent();
    }

    getEvent(): void {

        this.eventService.getEventById(this.eventId).subscribe(
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

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.event.owner.id == connectedUserId;
    }

}
