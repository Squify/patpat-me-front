import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';
import { GenderService } from '../../services/gender/gender.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserGender } from '../../interfaces/user/user-gender';
import { Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountEdit } from '../../interfaces/user/account-edit';
import { EventsService } from '../../services/eventsObs/events.service';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.page.html',
    styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

    subscriptionUser: Subscription;
    user: User;

    genders: UserGender[] = [];

    picPaths: string[] = [];
    selectedPic: string;

    accountEditInterface: AccountEdit;
    editPersonForm: FormGroup;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    emailInputError: boolean;
    emailAlreadyUsed: boolean;
    passwordInputError: boolean;
    passwordSecurityError: boolean;
    phoneInputError: boolean;

    constructor(
        private userService: UserService,
        private genderService: GenderService,
        public toastController: ToastController,
        private router: Router,
        public events: EventsService,
        public platform: Platform
    ) {
    }

    ngOnInit() {
        this.subscriptionUser = this.userService.getUser().subscribe(user => this.user = user);
        this.getGenders();
        this.buildForm();
    }

    loadProfilePics(): void {
        this.picPaths.push('/assets/images/profile_pic/profile_default.png')
        for (let i = 1; i <= 24; i++) {
            this.picPaths.push('/assets/images/profile_pic/profile_' + i + '.png')
        }
    }

    getPicPath(path): void {
        this.selectedPic = path;
    }

    getGenders(): void {
        this.genderService.getUserGender().subscribe(
            val => {
                val.forEach((gender) => {
                        const genderToAdd: UserGender = {name: gender.name};
                        this.genders.push(genderToAdd);
                    }
                );
            }
        );
    }

    buildForm(): void {

        this.selectedPic = this.user.profile_pic_path;
        this.loadProfilePics();
        this.editPersonForm = new FormGroup({

            email: new FormControl({value: this.user.email, disabled: false}, {
                validators: [
                    Validators.pattern(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/)
                ]
            }),

            password: new FormControl('', {
                validators: [
                    Validators.minLength(8),
                    Validators.maxLength(32),
                ]
            }),

            phone: new FormControl({value: this.user.phone, disabled: false}, {
                validators: [
                    Validators.pattern(/(^|\s+)(0[0-9]|\+33[\s.\-]?[0-9])([\s.\-]?[0-9]{2}){4}/)
                ]
            }),

            // push_notification: new FormControl({value: this.user.push_notification, disabled: false}),

            // active_localisation: new FormControl({value: this.user.active_localisation, disabled: false}),

            display_real_name: new FormControl({value: this.user.display_real_name, disabled: false}),

            fk_id_gender: new FormControl({value: this.user.gender.name, disabled: false}),
        });
    }

    submit(): void {
        if (this.formIsValid()) {
            this.updateAccount();
        } else {
            this.presentToast('general');
        }
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();
        this.checkPasswordSecurity();

        return !this.editPersonForm.invalid;
    }

    updateAccount(): void {
        this.accountEditInterface = {
            email: this.editPersonForm.value.email,
            password: this.editPersonForm.value.password,
            profile_pic_path: this.selectedPic,
            phone: this.editPersonForm.value.phone,
            push_notification: false,
            active_localisation: false,
            display_real_name: this.editPersonForm.value.display_real_name,
            gender: this.editPersonForm.value.fk_id_gender,
        };

        this.userService.updateUser(this.accountEditInterface).subscribe(
            _ => {
                this.events.publishSomeData('updateProfile')
                this.router.navigateByUrl('/tabs/profile')
            },
            error => this.processError(error))
        ;
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
                    break;
                case 417:
                    this.emailAlreadyUsed = true;
                    this.presentToast('back_email_used');
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

    setAllErrorsToFalse(): void {
        this.serverError = false;
        this.unknownError = false;
        this.inputsError = false;
        this.emailInputError = false;
        this.emailAlreadyUsed = false;
        this.passwordInputError = false;
        this.passwordSecurityError = false;
        this.phoneInputError = false;
    }

    checkInputsError(): void {
        if (this.editPersonForm.controls.password.errors) {
            this.passwordInputError = true;
        }
        if (this.editPersonForm.controls.phone.errors) {
            this.phoneInputError = true;
        }
    }

    checkPasswordSecurity(): boolean {
        if (this.editPersonForm.controls.password.errors
            && this.editPersonForm.controls.password.errors.unsecurePassword) {
            return this.passwordSecurityError = true;
        }
        if (this.editPersonForm.controls.password.errors
            && this.editPersonForm.controls.password.errors.minlength) {
            return this.passwordSecurityError = true;
        }
        if (this.editPersonForm.controls.password.errors
            && this.editPersonForm.controls.password.errors.maxLength) {
            return this.passwordSecurityError = true;
        }

        return false;
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'password':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un mot de passe valide et sécurisé.',
                    duration: 2000
                });
                break;
            case 'email':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner une adresse email valide.',
                    duration: 2000
                });
                break;
            case 'phone':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un numéro de téléphone valide.',
                    duration: 2000
                });
                break;
            case 'back_input':
                toast = await this.toastController.create({
                    message: 'La requête est invalide, vérifiez les informations saisies.',
                    duration: 2000
                });
                break;
            case 'back_email_used':
                toast = await this.toastController.create({
                    message: 'L\'adresse email saisie est déjà utilisée.',
                    duration: 2000
                });
                break;
            case 'back_server':
                toast = await this.toastController.create({
                    message: 'Une erreur serveur est survenue.',
                    duration: 2000
                });
                break;
            case 'back_unknown':
                toast = await this.toastController.create({
                    message: 'Une erreur inconnue est survenue.',
                    duration: 2000
                });
                break;
            default:
                toast = await this.toastController.create({
                    message: 'Le formulaire est erroné ! Cliquez sur les ronds pour plus d\'infos.',
                    duration: 3000
                });
                break;

        }

        toast.present();
    }
}
