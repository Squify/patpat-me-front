import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(
        public toastController: ToastController,
        public translate: TranslateService,
    ) {
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            // Login cases
            case 'credentials':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.LOGIN.CREDENTIALS'),
                    duration: 2000
                });
                break;
            // User cases
            case 'user_pseudo':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.PSEUDO'),
                    duration: 2000
                });
                break;
            case 'user_password':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.PASSWORD'),
                    duration: 2000
                });
                break;
            case 'user_email':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.EMAIL'),
                    duration: 2000
                });
                break;
            case 'user_lastname':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.LASTNAME'),
                    duration: 2000
                });
                break;
            case 'user_firstname':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.FIRSTNAME'),
                    duration: 2000
                });
                break;
            case 'user_phone':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.PHONE'),
                    duration: 2000
                });
                break;
            case 'user_back_email_used':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.EMAIL_ALREADY_USED'),
                    duration: 2000
                });
                break;
            case 'user_back_pseudo_used':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.USER.PSEUDO_ALREADY_USED'),
                    duration: 2000
                });
                break;
            // Animal cases
            case 'animal_name':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.NAME'),
                    duration: 2000
                });
                break;
            case 'animal_birthday':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.BIRTHDAY'),
                    duration: 2000
                });
                break;
            case 'animal_type':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.TYPE'),
                    duration: 2000
                });
                break;
            case 'animal_breed':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.BREED'),
                    duration: 2000
                });
                break;
            case 'animal_gender':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.GENDER'),
                    duration: 2000
                });
                break;
            case 'animal_temper':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.TEMPER'),
                    duration: 2000
                });
                break;
            case 'animal_back_user':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.ANIMAL.OWNER'),
                    duration: 2000
                });
                break;
            // Event cases
            case 'event_name':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.NAME'),
                    duration: 2000
                });
                break;
            case 'event_name_exist':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.NAME_ALREADY_USED'),
                    duration: 2000
                });
                break;
            case 'event_description':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.DESCRIPTION'),
                    duration: 2000
                });
                break;
            case 'event_location':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.LOCATION'),
                    duration: 2000
                });
                break;
            case 'event_date':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.DATE'),
                    duration: 2000
                });
                break;
            case 'event_type':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.TYPE'),
                    duration: 2000
                });
                break;
            case 'event_owner':
                toast = await this.toastController.create({
                    message: this.translate.instant('EVENT.OWNER_MESSAGE'),
                    duration: 2000
                });
                break;
            case 'event_back_userIsOwner':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EVENT.USER_IS_OWNER'),
                    duration: 2000
                });
                break;
            // Default cases
            case 'back_input':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.DEFAULT.BACK_INPUT'),
                    duration: 2000
                });
                break;
            case 'back_server':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.DEFAULT.BACK_SERVER'),
                    duration: 2000
                });
                break;
            case 'back_unknown':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.DEFAULT.BACK_UNKNOWN'),
                    duration: 2000
                });
                break;
            default:
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.DEFAULT.DEFAULT'),
                    duration: 3000
                });
                break;
        }
        toast.present();
    }
}
