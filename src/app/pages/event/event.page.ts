import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { EventInterface } from '../../interfaces/event/event-interface';
import { EventType } from '../../interfaces/event/event-type';
import { UserService } from "../../services/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

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
    defaultProfilePic = '/assets/images/grumpy.jpg';

    constructor(
        private eventService: EventService,
        private ngZone: NgZone,
        private userService: UserService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public toastController: ToastController,
        public translate: TranslateService
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
        window.open("https://maps.google.com/?q=" + this.event.localisation)
    }

    getEvent(): void {

        this.eventService.getEventById(this.eventId).subscribe(
            value => {
                this.event = value;
            },
            e => this.processError(e)
        );
    }

    changeEventParticipation(): void {

        this.eventService.changeEventParticipation(this.event.id).subscribe(
            _ =>
                e => this.processError(e)
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

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
                    break;
                case 417:
                    this.userIsOwnerError = true;
                    this.presentToast('back_userIsOwner');
                    break;
                case 500:
                    this.serverError = true;
                    this.presentToast('back_server');
                    break;
                default:
                    this.unknownError = true;
                    this.presentToast('back_unknown');
                    break;
            }
        } else {
            this.unknownError = true;
            this.presentToast('back_unknown');
        }
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'owner':
                toast = await this.toastController.create({
                    message: this.translate.instant('EVENT.OWNER_MESSAGE'),
                    duration: 2000
                });
                break;
            case 'back_input':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.BACK_INPUT'),
                    duration: 2000
                });
                break;
            case 'back_userIsOwner':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER_IS_OWNER'),
                    duration: 2000
                });
                break;
            case 'back_server':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.BACK_SERVER'),
                    duration: 2000
                });
                break;
            case 'back_unknown':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.BACK_UNKNOWN'),
                    duration: 2000
                });
                break;
            default:
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.DEFAULT'),
                    duration: 3000
                });
                break;
        }
        toast.present();
    }
}
