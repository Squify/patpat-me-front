import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountCreate } from '../../interfaces/user/account-create';
import { UserService } from '../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserGender } from '../../interfaces/user/user-gender';
import { GenderService } from '../../services/gender/gender.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { User } from '../../interfaces/user/user';
import { Router } from '@angular/router';
import { Credentials } from '../../interfaces/user/credentials';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language/language.service';
import { Language } from '../../interfaces/user/language';
import { ErrorService } from '../../services/error/error.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-account-create',
    templateUrl: './account-create.page.html',
    styleUrls: ['./account-create.page.scss'],
})
export class AccountCreatePage implements OnInit {

    accountCreateInterface: AccountCreate;
    createPersonForm: FormGroup;
    genders: UserGender[] = [];
    languages: Language[] = [];
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
    lastNameInputError: boolean;
    firstNameInputError: boolean;
    phoneInputError: boolean;

    passwordIcon = 'eye-outline';
    passwordInputType = 'password';

    constructor(
        private router: Router,
        public translate: TranslateService,
        private authService: AuthenticationService,
        public errorService: ErrorService,
        private genderService: GenderService,
        private languageService: LanguageService,
        private userService: UserService,
    ) {

        this.getAttributes();
        this.changeLanguage('FR');
        this.buildForm();
    }

    ngOnInit(): void {
    }

    changePasswordView(): void {
        if (this.passwordInputType === 'password') {
            this.passwordInputType = 'input';
            this.passwordIcon = 'eye-off-outline';
        } else if (this.passwordInputType === 'input') {
            this.passwordInputType = 'password';
            this.passwordIcon = 'eye-outline';
        }
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
            display_email: new FormControl(false),
            display_phone: new FormControl(false),
            display_real_name: new FormControl(false),
            gender: new FormControl(''),
            language: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
        });
    }

    getAttributes(): void {

        this.genderService.getUserGender().subscribe(
            val => this.genders = val,
            error => this.processError(error)
        );

        this.languageService.getLanguage().subscribe(
            val => this.languages = val,
            error => this.processError(error)
        );
    }

    changeLanguage(language) {
        this.languageService.changeLanguage(language);
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
        this.lastNameInputError = false;
        this.firstNameInputError = false;
        this.phoneInputError = false;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.createAccount();
        } else {
            this.errorService.presentToast('default');
        }
    }

    createAccount(): void {
        this.accountCreateInterface = {
            email: this.createPersonForm.value.email,
            password: this.createPersonForm.value.password,
            pseudo: this.createPersonForm.value.pseudo,
            profile_pic_path: environment.default_profile_pic,
            firstname: this.createPersonForm.value.firstname,
            lastname: this.createPersonForm.value.lastname,
            phone: this.createPersonForm.value.phone,
            birthday: this.createPersonForm.value.birthday,
            display_email: this.createPersonForm.value.display_email,
            display_phone: this.createPersonForm.value.display_phone,
            display_real_name: this.createPersonForm.value.display_real_name,
            gender: this.createPersonForm.value.gender,
            language: this.createPersonForm.value.language,
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
            this.lastNameInputError = true;
        }
        if (this.createPersonForm.controls.firstname.errors) {
            this.firstNameInputError = true;
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
                    this.errorService.presentToast('back_input');
                    break;
                case 409:
                    this.inputsError = true;
                    this.errorService.presentToast('back_pseudo_used');
                    break;
                case 417:
                    this.emailAlreadyUsed = true;
                    this.errorService.presentToast('back_email_used');
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
