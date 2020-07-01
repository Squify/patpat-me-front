import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { EventInterface } from '../../interfaces/event/event-interface';
import { EventType } from '../../interfaces/event/event-type';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

    event: EventInterface;
    types: EventType[] = [];
    eventId: number = null;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    userIsOwnerError: boolean;

    selectedSegment = 'informationSegment';
    participationIcon = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private router: Router,
        public translate: TranslateService,
        public errorService: ErrorService,
        private eventService: EventService,
        public updateService: UpdateService,
        private userService: UserService,
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

    ionViewDidEnter() {
        if (history.state.comingFromEdition) {
            this.ngZone.run(() => this.getEvent())
        }
    }

    openMaps() {
        window.open('https://maps.google.com/?q=' + this.event.location)
    }

    getEvent(): void {

        this.eventService.getEventById(this.eventId).subscribe(
            value => {
                this.event = value;
                this.isMember();
            },
            error => this.processError(error)
        );
    }

    changeEventParticipation(): void {

        this.eventService.changeEventParticipation(this.event.id).subscribe(
            _ => {
                this.getEvent();
                this.updateService.publishSomeData('updateEvent');
            },
            error => this.processError(error)
        );
        this.ngZone.run(() => this.getEvent())
    }

    isMember(): void {

        let connectedUser;
        this.userService.getUser().subscribe(user => connectedUser = user)

        if (this.event.members.find(element => element.id == connectedUser.id)) {
            this.participationIcon = 'person-remove-outline';
        } else {
            this.participationIcon = 'person-add-outline';
        }
    }

    getTypes(): void {
        this.eventService.getEventType().subscribe(
            val => this.types = val,
            error => this.processError(error)
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

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.errorService.presentToast('back_input');
                    break;
                case 417:
                    this.userIsOwnerError = true;
                    this.errorService.presentToast('event_back_userIsOwner');
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
