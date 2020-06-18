import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { EventService } from "../../services/event/event.service";
import { UserService } from "../../services/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { EventInterface } from "../../interfaces/event/event-interface";
import { EventType } from "../../interfaces/event/event-type";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EventEdit } from "../../interfaces/event/event-edit";
import { HttpErrorResponse } from "@angular/common/http";
import { GeolocationService } from "../../services/geolocation.service";
import { EventsService } from "../../services/events.service";

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {
    public data: string = null;

    @ViewChild("input", null) input;
    location: string = null;

    event: EventInterface;
    types: EventType[] = [];
    eventId: number = null;

    eventEditInterface: EventEdit;
    eventEditForm: FormGroup;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    nameError: boolean;
    nameExistError: boolean;
    descriptionError: boolean;
    localisationError: boolean;
    dateError: boolean;
    typeError: boolean;

    constructor(
        private eventService: EventService,
        private ngZone: NgZone,
        private userService: UserService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        public toastController: ToastController,
        public translate: TranslateService,
        private geolocationService: GeolocationService,
        public events: EventsService
    ) {
        this.geolocationService.myMethod$.subscribe((data) => {
                this.data = data; // And he have data here too!
                this.location = this.data;
            }
        );

        this.eventId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.eventId)
            this.router.navigateByUrl('/tabs/events');

        this.getEvent();
        this.getTypes();

    }

    ngOnInit() {
    }

    buildForm(): void {

        this.getTypes();

        // Create event form
        this.eventEditForm = new FormGroup({

            description: new FormControl({value: this.event.description, disabled: false}, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(400),
                ]
            }),

            date: new FormControl({value: this.event.date, disabled: false}, {
                validators: [
                    Validators.required
                ]
            }),
        });
        this.location = this.event.localisation;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.createEvent();
        } else {
            this.presentToast('general');
        }
    }

    createEvent(): void {
        this.eventEditInterface = {
            id: this.eventId,
            description: this.eventEditForm.value.description,
            localisation: this.location,
            date: this.eventEditForm.value.date,
        };

        this.eventService.editEvent(this.eventEditInterface).subscribe(
            _ => {
                this.events.publishSomeData('updateEvent')
                this.router.navigateByUrl('/tabs/events/event/' + this.eventId, {state: {comingFromEdition: true}})
            },
            error => this.processError(error))
        ;
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();

        return !this.eventEditForm.invalid;
    }

    setAllErrorsToFalse(): void {
        this.serverError = false;
        this.unknownError = false;
        this.inputsError = false;
        this.nameError = false;
        this.nameExistError = false;
        this.descriptionError = false;
        this.localisationError = false;
        this.dateError = false;
        this.typeError = false;
    }

    checkInputsError(): void {
        if (this.eventEditForm.controls.description.errors) {
            this.descriptionError = true;
        }
        if (this.location == null || this.location == '') {
            this.localisationError = true;
        }
        if (this.eventEditForm.controls.date.errors) {
            this.dateError = true;
        }
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
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

    getEvent(): void {

        this.eventService.getEventById(this.eventId).subscribe(
            value => {
                this.event = value;
                if (!this.isOwner())
                    this.router.navigateByUrl('/tabs/events');
                this.buildForm();
            },
            e => this.processError(e)
        );
    }

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.event.owner.id == connectedUserId;
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'description':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.DESCRIPTION'),
                    duration: 2000
                });
                break;
            case 'localisation':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.LOCATION'),
                    duration: 2000
                });
                break;
            case 'date':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.DATE'),
                    duration: 2000
                });
                break;
            case 'back_input':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.BACK_INPUT'),
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
