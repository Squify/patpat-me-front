import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventInterface } from '../../interfaces/event/event-interface';
import { EventType } from '../../interfaces/event/event-type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEdit } from '../../interfaces/event/event-edit';
import { HttpErrorResponse } from '@angular/common/http';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';
import { DateService } from '../../services/date/date.service';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.page.html',
    styleUrls: ['./event-edit.page.scss'],
})
export class EventEditPage implements OnInit {
    public data: string = null;

    @ViewChild('input', null) input;
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
    locationError: boolean;
    dateError: boolean;
    typeError: boolean;

    minDate: string;
    maxDate: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private router: Router,
        public translate: TranslateService,
        private dateService: DateService,
        private eventService: EventService,
        public errorService: ErrorService,
        private geolocationService: GeolocationService,
        private updateService: UpdateService,
        private userService: UserService
    ) {
        this.geolocationService.getData.subscribe((data) => {
                this.data = data;
                this.location = this.data;
            }
        );

        this.eventId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.eventId)
            this.router.navigateByUrl('/tabs/events');

        this.getEvent();
    }

    ngOnInit() {
    }

    buildForm(): void {

        this.minDate = this.dateService.getMinDate();
        this.maxDate = this.dateService.getMaxDate();
        this.getTypes();

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
        this.location = this.event.location;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.editEvent();
        } else {
            this.errorService.presentToast('default');
        }
    }

    editEvent(): void {

        this.eventEditForm.value.date = new Date(this.eventEditForm.value.date).toISOString();

        this.eventEditInterface = {
            id: this.eventId,
            description: this.eventEditForm.value.description,
            location: this.location,
            date: this.eventEditForm.value.date,
        };

        this.eventService.editEvent(this.eventEditInterface).subscribe(
            _ => {
                this.updateService.publishSomeData('updateEvent')
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
        this.locationError = false;
        this.dateError = false;
        this.typeError = false;
    }

    checkInputsError(): void {
        if (this.eventEditForm.controls.description.errors) {
            this.descriptionError = true;
        }
        if (this.location == null || this.location == '') {
            this.locationError = true;
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

    getTypes(): void {
        this.eventService.getEventType().subscribe(
            val => this.types = val,
            error => this.processError(error)
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
            error => this.processError(error)
        );
    }

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.event.owner.id == connectedUserId;
    }
}
