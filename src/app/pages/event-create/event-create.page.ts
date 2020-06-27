import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { EventCreate } from '../../interfaces/event/event-create';
import { EventService } from '../../services/event/event.service';
import { EventType } from '../../interfaces/event/event-type';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { GeolocationService } from "../../services/geolocation/geolocation.service";
import { UpdateService } from "../../services/eventsObs/update.service";

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.page.html',
    styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {
    public data: string = null;

    @ViewChild("input", null) input;
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
        public toastController: ToastController,
        private eventService: EventService,
        public translate: TranslateService,
        public router: Router,
        private geolocationService: GeolocationService,
        public updateService: UpdateService
    ) {
        this.geolocationService.myMethod$.subscribe((data) => {
                this.data = data; // And he have data here too!
                this.location = this.data;
            }
        );

        this.buildForm();
        this.getMinDate();
        this.getMaxDate();
    }

    ngOnInit() {
    }

    getMinDate() {
        const today = new Date();
        if (today.getMonth()+1 < 10)
            this.minDate = today.getFullYear() + '-' + 0 + (today.getMonth()+1) + '-' + (today.getDate() + 1) + 'T00:00:00+02:00';
        else
            this.minDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + (today.getDate() + 1) + 'T00:00:00+02:00';
    }

    getMaxDate() {
        const today = new Date();
        if (today.getMonth()+1 < 10)
            this.maxDate =  (today.getFullYear() + 10)+'-'+0+(today.getMonth()+1)+'-'+today.getDate()+'T'+23+':'+59+':'+59;
        else
            this.maxDate = (today.getFullYear() + 10)+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T'+23+':'+59+':'+59;
    }

    buildForm(): void {

        this.getTypes();

        // Create event form
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

            fk_id_type: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
        });
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
            this.presentToast('general');
        }
    }

    createEvent(): void {
        this.createEventInterface = {
            name: this.createEventForm.value.name,
            description: this.createEventForm.value.description,
            localisation: this.location,
            date: this.createEventForm.value.date,
            type: this.createEventForm.value.fk_id_type,
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
        if (this.createEventForm.controls.fk_id_type.errors) {
            this.typeError = true;
        }
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
                    break;
                case 417:
                    this.nameExistError = true;
                    this.presentToast('name_exist');
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
            case 'name':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.NAME'),
                    duration: 2000
                });
                break;
            case 'name_exist':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.NAME_ALREADY_USED'),
                    duration: 2000
                });
                break;
            case 'description':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.DESCRIPTION'),
                    duration: 2000
                });
                break;
            case 'location':
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
            case 'fk_id_type':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.TYPE'),
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
