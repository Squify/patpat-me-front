import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user/user';
import { MeetService } from '../../services/meet/meet.service';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { UpdateService } from '../../services/update/update.service';
import { Friend } from '../../interfaces/user/friend';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.page.html',
    styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

    friends: Friend[] = [];
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
        public updateService: UpdateService,
        public alertController: AlertController,
    ) {
    }

    ngOnInit() {
        this.getConnectedUser();

        this.updateService.getObservable().subscribe((data) => {
            switch (data) {
                case 'updateFriends':
                    this.getConnectedUser();
                    break;
                default:
                    break;
            }
        });
    }

    getConnectedUser(): void {
        this.userService.getRemoteUser().subscribe(
            user => {
                this.connectedUser = user;
                this.friends = [];
                this.connectedUser.friends.forEach(user => {
                    let friendToAdd: Friend = {user: user, animals: null, friendOf: false};
                    if (user.friends.length > 0) {
                        friendToAdd.friendOf = !!user.friends.find(element => element.id === this.connectedUser.id);
                    }
                    this.friends.push(friendToAdd);
                })
                this.friends.sort((a, b) => a.user.pseudo.localeCompare(b.user.pseudo));
            },
            e => this.processError(e)
        )
    }

    async confirmChange(userId: number) {
        const alert = await this.alertController.create({
            header: this.translate.instant('ALERT.CONFIRMATION'),
            message: this.translate.instant('ALERT.REMOVE_FRIENDS'),
            buttons: [
                {
                    text: this.translate.instant('ALERT.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant('ALERT.CONFIRM'),
                    handler: () => {
                        this.changeRelation(userId);
                    }
                }
            ]
        });

        await alert.present();
        await alert.onDidDismiss();
    }

    changeRelation(userId: number): void {
        this.meetService.changeRelation(userId).subscribe(
            _ => {
                this.getConnectedUser();
                this.updateService.publishSomeData('updateFriends');
            },
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
