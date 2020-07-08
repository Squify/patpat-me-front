import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';
import { GenderService } from '../../services/gender/gender.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserGender } from '../../interfaces/user/user-gender';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountEdit } from '../../interfaces/user/account-edit';
import { UpdateService } from '../../services/update/update.service';
import { Language } from '../../interfaces/user/language';
import { LanguageService } from '../../services/language/language.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.page.html',
    styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

    subscriptionUser: Subscription;
    user: User;

    genders: UserGender[] = [];
    languages: Language[] = [];

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

    passwordIcon = 'eye-outline';
    passwordInputType = 'password';

    constructor(
        public platform: Platform,
        private router: Router,
        public errorService: ErrorService,
        private genderService: GenderService,
        private languageService: LanguageService,
        private updateService: UpdateService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.subscriptionUser = this.userService.getUser().subscribe(user => this.user = user);
        this.getAttributes();
        this.buildForm();
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

    getPicPath(path): void {
        this.selectedPic = path;
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

        this.selectedPic = this.user.profile_pic_path;
        this.picPaths = this.userService.loadProfilePics();
    }

    changeLanguage(language) {
        this.languageService.changeLanguage(language);
    }

    buildForm(): void {

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
            birthday: new FormControl({value: this.user.birthday, disabled: !!this.user.birthday}),
            display_email: new FormControl({value: this.user.display_email, disabled: false}),
            display_phone: new FormControl({value: this.user.display_phone, disabled: false}),
            display_real_name: new FormControl({value: this.user.display_real_name, disabled: false}),
            gender: new FormControl({value: this.user.gender ? this.user.gender.name : null, disabled: false}),
            language: new FormControl({
                value: this.user.language ? this.user.language.name : 'FR',
                disabled: false
            }, {
                validators: [
                    Validators.required,
                ]
            }),
        });
    }

    submit(): void {
        if (this.formIsValid()) {
            this.updateAccount();
        } else {
            this.errorService.presentToast('default');
        }
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();
        this.checkPasswordSecurity();

        return !this.editPersonForm.invalid;
    }

    updateAccount(): void {

        let birthday = this.user.birthday;
        if (this.editPersonForm.value.birthday) {
            birthday = this.editPersonForm.value.birthday;
        }
        if ((this.user.birthday == null) && (this.editPersonForm.value.birthday == null))
            birthday = '';
        let dateInLocalTimezone = new Date(birthday).toISOString();

        let gender = '';
        if (this.user.gender)
            gender = this.user.gender.name;
        else if (!this.user.gender) {
            gender = this.editPersonForm.value.gender;
        }
        if ((this.user.gender == null) && (this.editPersonForm.value.gender == null))
            gender = '';

        this.accountEditInterface = {
            email: this.editPersonForm.value.email,
            password: this.editPersonForm.value.password,
            profile_pic_path: this.selectedPic,
            phone: this.editPersonForm.value.phone,
            birthday: dateInLocalTimezone,
            display_email: this.editPersonForm.value.display_email,
            display_phone: this.editPersonForm.value.display_phone,
            display_real_name: this.editPersonForm.value.display_real_name,
            gender: gender,
            language: this.editPersonForm.value.language,
        };

        this.userService.updateUser(this.accountEditInterface).subscribe(
            _ => {
                this.updateService.publishSomeData('updateProfile')
                this.router.navigateByUrl('/tabs/profile')
            },
            error => this.processError(error)
        );
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.errorService.presentToast('back_input');
                    break;
                case 417:
                    this.emailAlreadyUsed = true;
                    this.errorService.presentToast('user_back_email_used');
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
}
