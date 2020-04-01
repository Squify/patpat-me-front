import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateAccount} from '../../interfaces/create-account';
import {UserService} from '../../services/user.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.page.html',
    styleUrls: ['./account-create.page.scss'],
})
export class AccountCreatePage implements OnInit {

    createAccountInterface: CreateAccount;
    createPersonForm: FormGroup;

    // Errors
    mailInputError: boolean;
    passwordInputError: boolean;
    passwordSecurityError: boolean;
    pseudoInputError: boolean;
    lastnameInputError: boolean;
    firstnameInputError: boolean;
    phoneInputError: boolean;

    constructor(
        private userService: UserService,
    ) {

        this.buildForm();
    }

    ngOnInit(): void {
    }

    buildForm(): void {

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

            fk_id_gender: new FormControl(false),
        });

    }

    setAllErrorsToFalse(): void {
        this.mailInputError = false;
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
            console.log('ça marche po');
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
            this.mailInputError = true;
        }
        if (this.createPersonForm.controls.lastname.errors) {
            this.passwordInputError = true;
        }
        if (this.createPersonForm.controls.firstname.errors) {
            this.mailInputError = true;
        }
        if (this.createPersonForm.controls.phone.errors) {
            this.passwordInputError = true;
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
                    // this.inputsError = true;
                    break;
                case 500:
                    // this.serverError = true;
                    break;
                default:
                // this.unknownError = true;
            }
        } else {
            // this.unknownError = true;
        }
    }

}
