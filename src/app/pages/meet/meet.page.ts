import { Component, OnInit } from '@angular/core';
import { MeetService } from '../../services/meet/meet.service';
import { MetUser } from '../../interfaces/user/met-user';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interfaces/user/user';
import { UpdateService } from '../../services/eventsObs/update.service';

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
        const alert = await this.alertController.create({
            header: 'Confirmation',
            message: 'Etes-vous sûr de vouloir retirer cet ami ?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.changeRelation(userId);
                    }
                }
            ]
        });

        await alert.present();
        await alert.onDidDismiss();
    }

    async confirmAdd(userId: number) {
        const alert = await this.alertController.create({
            header: 'Confirmation',
            message: 'Etes-vous sûr de vouloir ajouter cette personne en ami ? \nElle aura accès aux informations que vous avez décidé de laisser afficher',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Confirmer',
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
