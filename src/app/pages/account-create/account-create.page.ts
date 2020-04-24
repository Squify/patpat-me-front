import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateAccount} from '../../interfaces/create-account';
import {UserService} from '../../services/user/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserGender} from '../../interfaces/user-gender';
import {GenderService} from '../../services/gender/gender.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.page.html',
    styleUrls: ['./account-create.page.scss'],
})
export class AccountCreatePage implements OnInit {

    createAccountInterface: CreateAccount;
    createPersonForm: FormGroup;
    genders: UserGender[] = [];

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    mailInputError: boolean;
    mailAlreadyUsed: boolean;
    passwordInputError: boolean;
    passwordSecurityError: boolean;
    pseudoInputError: boolean;
    lastnameInputError: boolean;
    firstnameInputError: boolean;
    phoneInputError: boolean;

    constructor(
        private userService: UserService,
        private genderService: GenderService,
        public toastController: ToastController
    ) {

        this.buildForm();
    }

    ngOnInit(): void {
    }

    buildForm(): void {

        this.getGenders();

        // Create account form
        this.createPersonForm = new FormGroup({

            mail: new FormControl('', {
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

            push_notification: new FormControl(false),

            active_localisation: new FormControl(false),

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
        this.mailInputError = false;
        this.mailAlreadyUsed = false;
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
        this.createAccountInterface = {
            mail: this.createPersonForm.value.mail,
            password: this.createPersonForm.value.password,
            pseudo: this.createPersonForm.value.pseudo,
            firstname: this.createPersonForm.value.firstname,
            lastname: this.createPersonForm.value.lastname,
            phone: this.createPersonForm.value.phone,
            birthday: this.createPersonForm.value.birthday,
            push_notification: this.createPersonForm.value.push_notification,
            active_localisation: this.createPersonForm.value.active_localisation,
            display_real_name: this.createPersonForm.value.display_real_name,
            fk_id_gender: this.createPersonForm.value.fk_id_gender,
        };

        this.userService.createUser(this.createAccountInterface).subscribe(
            _ => this.connectUser(),
            error => this.processError(error))
        ;
    }

    connectUser(): void {
        //
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();
        this.checkPasswordSecurity();

        return !this.createPersonForm.invalid;
    }

    checkInputsError(): void {
        if (this.createPersonForm.controls.mail.errors) {
            this.mailInputError = true;
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
                    this.mailAlreadyUsed = true;
                    this.presentToast('back_mail_used');
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
            case 'pseudo':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un pseudo valide.',
                    duration: 2000
                });
                break;
            case 'password':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un mot de passe valide et sécurisé.',
                    duration: 2000
                });
                break;
            case 'mail':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner une adresse email valide.',
                    duration: 2000
                });
                break;
            case 'lastname':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un nom valide.',
                    duration: 2000
                });
                break;
            case 'firstname':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un prénom valide.',
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
            case 'back_pseudo_used':
                toast = await this.toastController.create({
                    message: 'Le pseudo saisi est déjà utilisé.',
                    duration: 2000
                });
                break;
            case 'back_mail_used':
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
