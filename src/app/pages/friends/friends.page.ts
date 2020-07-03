import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user/user';
import { MeetService } from '../../services/meet/meet.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { UpdateService } from '../../services/update/update.service';
import { Friend } from '../../interfaces/user/friend';
import { ErrorService } from '../../services/error/error.service';
import { FriendInList } from '../../interfaces/user/friend-in-list';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.page.html',
    styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

    friends: FriendInList[] = [];
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
                this.getFriends()
            },
            error => this.processError(error)
        )
    }

    getFriends(): void {
        this.userService.getUserFriends().subscribe(
            friends => {
                friends.forEach(friend => {
                    let friendToAdd: FriendInList = {
                        id: friend.id,
                        email: friend.email,
                        pseudo: friend.pseudo,
                        profile_pic_path: friend.profile_pic_path,
                        firstname: friend.firstname,
                        lastname: friend.lastname,
                        display_real_name: friend.display_real_name,
                        friends: friend.friends,
                        animals: null,
                        friendOf: false
                    };
                    if (friend.friends && friend.friends.length > 0) {
                        friendToAdd.friendOf = !!friend.friends.find(friendId => friendId === this.connectedUser.id);
                    }
                    this.friends.push(friendToAdd);
                })
                this.friends.sort((a, b) => a.pseudo.localeCompare(b.pseudo));
            },
            error => this.processError(error)
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
