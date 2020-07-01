import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EventCreate } from '../../interfaces/event/event-create';
import { EventService } from '../../services/event/event.service';
import { EventType } from '../../interfaces/event/event-type';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';
import { DateService } from '../../services/date/date.service';

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.page.html',
    styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {
    public data: string = null;

    @ViewChild('input', null) input;
    location: string = null;

    createEventInterface: EventCreate;
    createEventForm: FormGroup;
    types: EventType[] = [];

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
        private router: Router,
        public translate: TranslateService,
        private dateService: DateService,
        private eventService: EventService,
        public errorService: ErrorService,
        private geolocationService: GeolocationService,
        private updateService: UpdateService,
    ) {
        this.geolocationService.getData.subscribe((data) => {
                this.data = data;
                this.location = this.data;
            }
        );

        this.buildForm();
        this.minDate = this.dateService.getMinDate();
        this.maxDate = this.dateService.getMaxDate();
    }

    ngOnInit() {
    }

    buildForm(): void {

        this.getTypes();

        this.createEventForm = new FormGroup({
            name: new FormControl('', {
                validators: [
                    Validators.required,
                ]
            }),
            description: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(400),
                ]
            }),
            date: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
            type: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
        });
    }

    getTypes(): void {
        this.eventService.getEventType().subscribe(
            val => this.types = val,
            error => this.processError(error)
        );
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

    submit(): void {
        if (this.formIsValid()) {
            this.createEvent();
        } else {
            this.errorService.presentToast('default');
        }
    }

    createEvent(): void {
        this.createEventInterface = {
            name: this.createEventForm.value.name,
            description: this.createEventForm.value.description,
            location: this.location,
            date: this.createEventForm.value.date,
            type: this.createEventForm.value.type,
        };

        this.eventService.createEvent(this.createEventInterface).subscribe(
            _ => {
                this.createEventForm.reset();
                this.updateService.publishSomeData('createEvent')
                this.router.navigateByUrl('');
            },
            error => this.processError(error))
        ;
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();

        return !this.createEventForm.invalid;
    }

    checkInputsError(): void {
        if (this.createEventForm.controls.name.errors) {
            this.nameError = true;
        }
        if (this.createEventForm.controls.description.errors) {
            this.descriptionError = true;
        }
        if (this.location == null || this.location == '') {
            this.locationError = true;
        }
        if (this.createEventForm.controls.date.errors) {
            this.dateError = true;
        }
        if (this.createEventForm.controls.type.errors) {
            this.typeError = true;
        }
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.errorService.presentToast('back_input');
                    break;
                case 417:
                    this.nameExistError = true;
                    this.errorService.presentToast('event_name_exist');
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
