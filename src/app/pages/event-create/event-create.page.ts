import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {HttpErrorResponse} from '@angular/common/http';
import {CreateEvent} from '../../interfaces/event/create-event';
import {EventService} from '../../services/event/event.service';
import {EventType} from '../../interfaces/event/event-type';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.page.html',
    styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {

    createEventInterface: CreateEvent;
    createEventForm: FormGroup;
    types: EventType[] = [];

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
        public toastController: ToastController,
        private eventService: EventService,
        public translate: TranslateService,
        public router: Router,
    ) {
        this.buildForm();
    }

    ngOnInit() {
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

            localisation: new FormControl('', {
                validators: [
                    Validators.required
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
        this.localisationError = false;
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
            localisation: this.createEventForm.value.localisation,
            date: this.createEventForm.value.date,
            type: this.createEventForm.value.fk_id_type,
        };

        this.eventService.createEvent(this.createEventInterface).subscribe(
            _ => this.router.navigateByUrl(''),
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
        if (this.createEventForm.controls.localisation.errors) {
            this.localisationError = true;
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
