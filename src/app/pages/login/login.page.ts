import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Credentials} from '../../interfaces/password/credentials';
import {User} from '../../interfaces/user';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../services/user/user.service';

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
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    mailInputError: boolean;
    passwordInputError: boolean;

    constructor(
        public loginFormBuilder: FormBuilder,
        private authService: AuthenticationService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public toastController: ToastController
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
    }

    ionViewDidLeave(): void {

        this.loginForm.controls.mail.reset();
        this.loginForm.controls.password.reset();
    }

    buildForm(): void {

        this.loginForm = this.loginFormBuilder.group({
            mail: new FormControl('', {
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

        if (this.loginForm.dirty && this.loginForm.valid) {
            this.credentials = {
                mail: this.loginForm.value.mail,
                password: this.loginForm.value.password
            };
            this.authService.login(this.credentials).subscribe(
                data => this.processLoginSuccess(data),
                error => this.processError(error)
            );
        } else {
            if (this.loginForm.controls.mail.errors && this.loginForm.controls.password.errors) {
                this.inputsError = true;
                this.presentToast('general');
            } else if (this.loginForm.controls.mail.errors) {
                this.mailInputError = true;
            } else if (this.loginForm.controls.password.errors) {
                this.passwordInputError = true;
            }
        }
    }

    processLoginSuccess(user: User): void {

        // set authenticated person in service
        this.userService.setPerson(user);

        this.router.navigateByUrl('');
    }

    processError(error: HttpErrorResponse): void {
        if (error) {
            switch (error.status) {
                case 401:
                    this.unknownError = true;
                    this.presentToast('back_unknown');
                    break;
                default:
                    this.unknownError = true;
                    this.presentToast('back_unknown');
            }
        } else {
            this.unknownError = true;
            this.presentToast('back_unknown');
        }
    }

    loginbutton(): void {

        if (this.loginForm.dirty && this.loginForm.valid) {
            this.credentials = {
                mail: this.loginForm.value.mail,
                password: this.loginForm.value.password
            };
            this.authService.login(this.credentials).subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        } else {
            console.log('pb form');
        }
    }

    logout(): void {
        this.authService.logout().subscribe(
            data => console.log('on est decooooo'),
            error => console.log(error)
        );
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'mail':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner une adresse email valide.',
                    duration: 2000
                });
                break;
            case 'password':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un mot de passe valide et sécurisé.',
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
