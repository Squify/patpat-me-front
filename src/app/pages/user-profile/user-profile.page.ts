import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { Friend } from '../../interfaces/user/friend';
import { User } from '../../interfaces/user/user';
import { TranslateService } from '@ngx-translate/core';
import { DateService } from '../../services/date/date.service';
import { ErrorService } from '../../services/error/error.service';

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
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private errorService: ErrorService,
        public dateService: DateService,
        private translate: TranslateService,
        private userService: UserService,
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
            error => this.processError(error)
        )
    }

    getUserById(userId): void {
        this.userService.getUserInformationsById(userId).subscribe(result => {
            this.user = {user: result.user, animals: result.animals, friendOf: false}
            this.user.animals.sort((a, b) => a.name.localeCompare(b.name));
            if (this.user.user.friends.length > 0) {
                this.user.friendOf = !!this.user.user.friends.find(element => element.id === this.connectedUser.id);
            }
        });
    }

    segmentChanged(segmentName: any) {
        this.selectedSegment = segmentName.detail.value;
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
