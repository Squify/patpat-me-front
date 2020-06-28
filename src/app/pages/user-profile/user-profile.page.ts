import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { Friend } from '../../interfaces/user/friend';
import { User } from '../../interfaces/user/user';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    connectedUser: User;

    user: Friend;
    userId: number = null;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;

    selectedSegment = 'informationSegment';

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public toastController: ToastController,
        public translate: TranslateService,
    ) {
    }

    ngOnInit() {

        this.getConnectedUser();

        this.userId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.userId) {
            this.router.navigateByUrl('/tabs/events');
        }

        this.getUserById(this.userId);
    }

    getConnectedUser(): void {
        this.userService.getRemoteUser().subscribe(
            user => this.connectedUser = user,
            e => this.processError(e)
        )
    }

    getUserById(userId): void {
        this.userService.getUserInformationsById(userId).subscribe(result => {
            this.user = {user: result.user, animals: result.animals, friendOf: false}
            this.user.animals.sort((a, b) => a.name.localeCompare(b.name));
            if (this.connectedUser.friends.length > 0) {
                this.user.friendOf = !!this.user.user.friends.find(element => element.id === this.connectedUser.id);
            }
        });
    }

    segmentChanged(ev: any) {
        this.selectedSegment = ev.detail.value;
    }

    calculateAge(birthday) { // birthday is a date

        if (birthday) {
            const date = birthday.split('-', 2);
            const dateMonth: number = date[1];
            const dateYear: number = date[0];

            const today = new Date().toLocaleString().split('/', 3);
            const todayMonth: number = +today[1];
            const todayYear: number = +today[2].split(' ', 1)[0];

            var age = 0;

            if (todayYear > dateYear) {
                if (todayMonth <= dateMonth) {
                    age = todayYear - dateYear;
                    if (age == 1) {
                        return age + ' an';
                    } else if (age > 1) {
                        return age + ' ans';
                    }
                } else {
                    age = todayYear - dateYear + 1;
                    return age + ' ans';
                }
            } else if (todayYear <= dateYear) {
                if (todayMonth <= dateMonth) {
                    age = todayMonth - dateMonth;
                    if (age >= 1) {
                        return age + ' mois';
                    } else if (age == 0) {
                        return 'Quelques semaines';
                    }
                } else {
                    age = todayMonth - dateMonth;
                    return age + ' mois';
                }
            }
        }
        return 'Non renseigné';
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_unknown');
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
