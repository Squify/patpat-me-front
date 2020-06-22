import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountCreate } from '../../interfaces/user/account-create';
import { UserService } from '../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserGender } from '../../interfaces/user/user-gender';
import { GenderService } from '../../services/gender/gender.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { User } from '../../interfaces/user/user';
import { Router } from '@angular/router';
import { Credentials } from '../../interfaces/user/credentials';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.page.html',
    styleUrls: ['./account-create.page.scss'],
})
export class AccountCreatePage implements OnInit {

    accountCreateInterface: AccountCreate;
    createPersonForm: FormGroup;
    genders: UserGender[] = [];
    credentials: Credentials;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    emailInputError: boolean;
    emailAlreadyUsed: boolean;
    passwordInputError: boolean;
    passwordSecurityError: boolean;
    pseudoInputError: boolean;
    lastnameInputError: boolean;
    firstnameInputError: boolean;
    phoneInputError: boolean;

    constructor(
        private userService: UserService,
        private genderService: GenderService,
        private authService: AuthenticationService,
        private router: Router,
        public toastController: ToastController,
        public translate: TranslateService
    ) {

        this.getGenders();
        this.buildForm();
    }

    ngOnInit(): void {
    }

    buildForm(): void {

        this.createPersonForm = new FormGroup({

            email: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.pattern(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/)
                ]
            }),

            password: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(32),
                ]
            }),

            pseudo: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            lastname: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            firstname: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            phone: new FormControl('', {
                validators: [
                    Validators.pattern(/(^|\s+)(0[0-9]|\+33[\s.\-]?[0-9])([\s.\-]?[0-9]{2}){4}/)
                ]
            }),

            birthday: new FormControl(''),

            // push_notification: new FormControl(false),

            // active_localisation: new FormControl(false),

            display_real_name: new FormControl(false),

            fk_id_gender: new FormControl(''),
        });
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

    setAllErrorsToFalse(): void {
        this.serverError = false;
        this.unknownError = false;
        this.inputsError = false;
        this.emailInputError = false;
        this.emailAlreadyUsed = false;
        this.passwordInputError = false;
        this.passwordSecurityError = false;
        this.pseudoInputError = false;
        this.lastnameInputError = false;
        this.firstnameInputError = false;
        this.phoneInputError = false;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.createAccount();
            this.connectUser();
        } else {
            this.presentToast('general');
        }
    }

    createAccount(): void {
        this.accountCreateInterface = {
            email: this.createPersonForm.value.email,
            password: this.createPersonForm.value.password,
            pseudo: this.createPersonForm.value.pseudo,
            profile_pic_path: null,
            firstname: this.createPersonForm.value.firstname,
            lastname: this.createPersonForm.value.lastname,
            phone: this.createPersonForm.value.phone,
            birthday: this.createPersonForm.value.birthday,
            push_notification: false,
            active_localisation: false,
            display_real_name: this.createPersonForm.value.display_real_name,
            gender: this.createPersonForm.value.fk_id_gender,
        };

        this.userService.createUser(this.accountCreateInterface).subscribe(
            _ => this.connectUser(),
            error => this.processError(error))
        ;
    }

    connectUser(): void {

        this.credentials = {
            email: this.createPersonForm.value.email,
            password: this.createPersonForm.value.password
        };
        this.authService.login(this.credentials).subscribe(
            data => this.processLoginSuccess(data),
            error => this.processError(error)
        );
    }

    processLoginSuccess(user: User): void {

        // set authenticated person in service
        this.userService.setPerson(user);
        this.router.navigateByUrl('');
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();
        this.checkPasswordSecurity();

        return !this.createPersonForm.invalid;
    }

    checkInputsError(): void {
        if (this.createPersonForm.controls.email.errors) {
            this.emailInputError = true;
        }
        if (this.createPersonForm.controls.password.errors) {
            this.passwordInputError = true;
        }
        if (this.createPersonForm.controls.pseudo.errors) {
            this.pseudoInputError = true;
        }
        if (this.createPersonForm.controls.lastname.errors) {
            this.lastnameInputError = true;
        }
        if (this.createPersonForm.controls.firstname.errors) {
            this.firstnameInputError = true;
        }
        if (this.createPersonForm.controls.phone.errors) {
            this.phoneInputError = true;
        }
    }

    checkPasswordSecurity(): boolean {
        if (this.createPersonForm.controls.password.errors
            && this.createPersonForm.controls.password.errors.unsecurePassword) {
            return this.passwordSecurityError = true;
        }
        if (this.createPersonForm.controls.password.errors
            && this.createPersonForm.controls.password.errors.minlength) {
            return this.passwordSecurityError = true;
        }
        if (this.createPersonForm.controls.password.errors
            && this.createPersonForm.controls.password.errors.maxLength) {
            return this.passwordSecurityError = true;
        }

        return false;
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
                    break;
                case 409:
                    this.inputsError = true;
                    this.presentToast('back_pseudo_used');
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

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'password':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.PASSWORD'),
                    duration: 2000
                });
                break;
            case 'email':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EMAIL'),
                    duration: 2000
                });
                break;
            case 'phone':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.PHONE'),
                    duration: 2000
                });
                break;
            case 'back_input':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.BACK_INPUT'),
                    duration: 2000
                });
                break;
            case 'back_email_used':
                toast = await this.toastController.create({
                    message: this.translate.instant('ERRORS.EMAIL_ALREADY_USED'),
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
