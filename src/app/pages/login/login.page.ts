import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from '../../interfaces/user/credentials';
import { User } from '../../interfaces/user/user';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { LanguageService } from '../../services/language/language.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    showPassword: boolean;
    error: Error;
    loginForm: FormGroup;
    credentials: Credentials;
    person: User;

    // Errors
    credentialsError: boolean;
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    emailInputError: boolean;
    passwordInputError: boolean;

    passwordIcon = 'eye-outline';
    passwordInputType = 'password';

    constructor(
        private activatedRoute: ActivatedRoute,
        private loginFormBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService,
        public errorService: ErrorService,
        private languageService: LanguageService,
        private userService: UserService,
    ) {

        this.buildForm();
    }

    ngOnInit() {

        this.showPassword = false;

        // Retrieve the logged in user using a resolver (defined in the routing)
        this.activatedRoute.data.subscribe(data => {
            this.userService.setPerson(data.loggedInPerson);
            // Redirect the logged user to home if he tries to access to /login
            if (data.loggedInPerson) {
                this.router.navigateByUrl('');
            }
        });

        // Retrieve the logged in user using a resolver (defined in the routing)
        this.activatedRoute.data.subscribe(data => {
            this.userService.setPerson(data.loggedInPerson);
            // Redirect the logged user to home if he tries to access to /login
            if (data.loggedInPerson) {
                this.router.navigateByUrl('');
            }
        });
    }

    ionViewDidLeave(): void {

        this.loginForm.reset();
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

        this.loginForm = this.loginFormBuilder.group({
            email: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.pattern(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/)
                ]
            }),
            password: new FormControl('', {
                validators: [
                    Validators.required,
                ]
            }),
        });
    }

    login(): void {

        if (this.formIsValid()) {
            this.credentials = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password
            };
            this.authService.login(this.credentials).subscribe(
                data => this.processLoginSuccess(data),
                error => this.processError(error)
            );
        } else {
            this.errorService.presentToast('default');
        }
    }

    formIsValid() {
        this.setAllErrorsToFalse();
        if (this.loginForm.controls.email.errors) {
            this.emailInputError = true;
        }
        if (this.loginForm.controls.password.errors) {
            this.passwordInputError = true;
        }

        return !this.loginForm.invalid
    }

    setAllErrorsToFalse(): void {
        this.serverError = false;
        this.unknownError = false;
        this.inputsError = false;
        this.emailInputError = false;
        this.passwordInputError = false;
        this.credentialsError = false;
    }

    processLoginSuccess(user: User): void {

        // set authenticated person in service
        this.userService.setPerson(user);
        this.languageService.changeLanguage(user.language.name);
        this.router.navigateByUrl('');
    }

    processError(error: HttpErrorResponse): void {
        if (error) {
            switch (error.status) {
                case 401:
                    this.credentialsError = true;
                    this.errorService.presentToast('credentials');
                    break;
                default:
                    this.unknownError = true;
                    this.errorService.presentToast('back_unknown');
            }
        } else {
            this.unknownError = true;
            this.errorService.presentToast('back_unknown');
        }
    }
}
