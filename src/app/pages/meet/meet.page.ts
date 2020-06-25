import { Component, NgZone, OnInit } from '@angular/core';
import { MeetService } from '../../services/meet/meet.service';
import { MetUser } from '../../interfaces/user/met-user';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interfaces/user/user';

@Component({
    selector: 'app-meet',
    templateUrl: './meet.page.html',
    styleUrls: ['./meet.page.scss'],
})
export class MeetPage implements OnInit {

    users: MetUser[] = [];
    connectedUser: User;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;

    constructor(
        private meetService: MeetService,
        public toastController: ToastController,
        public translate: TranslateService,
        private userService: UserService,
        private ngZone: NgZone,
    ) {
    }

    ngOnInit() {
        this.getConnectedUser();
    }

    getConnectedUser(): void {
        this.userService.getRemoteUser().subscribe(
            user => {
                this.connectedUser = user;
                this.getMetUsers();
            },
            e => this.processError(e)
        )
    }

    getMetUsers(): void {

        this.users = [];
        this.meetService.getMetUsers().subscribe(
            result => {
                result.forEach(user => {
                    let userToAdd = user;
                    userToAdd.isFriend = !!this.connectedUser.friends.find(element => element.id == userToAdd.user.id);
                    this.users.push(user);
                })
            },
            e => this.processError(e)
        );
    }

    changeRelation(userId: number): void {
        this.meetService.changeRelation(userId).subscribe(
            _ => this.getConnectedUser(),
            e => this.processError(e)
        );
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
