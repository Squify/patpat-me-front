import { Component, OnInit } from '@angular/core';
import { MeetService } from '../../services/meet/meet.service';
import { MetUser } from '../../interfaces/user/met-user';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interfaces/user/user';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-meet',
    templateUrl: './meet.page.html',
    styleUrls: ['./meet.page.scss'],
})
export class MeetPage implements OnInit {

    metUsers: MetUser[] = [];
    connectedUser: User;

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;

    constructor(
        private alertController: AlertController,
        private translate: TranslateService,
        private errorService: ErrorService,
        private meetService: MeetService,
        private updateService: UpdateService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.getConnectedUser();

        this.updateService.getObservable().subscribe((data) => {
            switch (data) {
                case 'updateEvent':
                    this.getConnectedUser();
                    break;
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
                this.getMetUsers();
            },
            e => this.processError(e)
        )
    }

    getMetUsers(): void {

        this.meetService.getMetUsers().subscribe(
            result => {
                this.metUsers = [];
                result.forEach(user => {
                    let userToAdd = user;
                    if (this.connectedUser.friends.length > 0) {
                        userToAdd.isFriend = !!this.connectedUser.friends.find(element => element.id === userToAdd.id);
                    }
                    this.metUsers.push(userToAdd);
                })
                this.metUsers.sort((a, b) => a.pseudo.localeCompare(b.pseudo));
            },
            e => this.processError(e)
        );
    }

    async confirmDelete(userId: number) {
        const removeAlert = await this.alertController.create({
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

        await removeAlert.present();
        await removeAlert.onDidDismiss();
    }

    async confirmAdd(userId: number) {
        const addAlert = await this.alertController.create({
            header: this.translate.instant('ALERT.CONFIRMATION'),
            message: this.translate.instant('ALERT.ADD_FRIENDS'),
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

        await addAlert.present();
        await addAlert.onDidDismiss();
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
                    this.errorService.presentToast('back_unknown');
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
