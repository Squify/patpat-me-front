import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user/user';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Animal } from '../../interfaces/animal/animal';
import { UpdateService } from '../../services/update/update.service';
import { DateService } from '../../services/date/date.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

    user: User;
    animals: Animal[] = [];
    subscriptionUser: Subscription;
    selectedSegment = 'informationSegment';

    // Errors
    unknownError: boolean;
    serverError: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        public dateService: DateService,
        private errorService: ErrorService,
        private updateService: UpdateService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {

        this.getUserDetail();
        this.getUserAnimals();
        this.updateService.getObservable().subscribe((data) => {
            switch (data) {
                case 'createAnimal':
                    this.getUserAnimals();
                    break;
                case 'updateAnimal':
                    this.getUserAnimals();
                    break;
                case 'updateProfile':
                    this.getUserDetail();
                    break;
                default:
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.subscriptionUser.unsubscribe();
    }

    getUserDetail(): void {
        this.subscriptionUser = this.userService.getRemoteUser().subscribe(
            user => this.user = user,
            error => this.processError(error)
        );
    }

    getUserAnimals(): void {

        this.animals = [];
        this.userService.getUserAnimals().subscribe(
            animals => this.animals = animals,
            error => this.processError(error)
        );
        this.animals.sort((a, b) => a.name.localeCompare(b.name));
    }

    segmentChanged(ev: any) {
        this.selectedSegment = ev.detail.value;
    }

    logout() {
        this.authService.logout().subscribe(
            _ => this.processLogoutSuccess(),
            error => this.processError(error)
        );
    }

    processLogoutSuccess(): void {
        // remove authenticated person in service
        this.userService.setPerson(null);

        // Reset this tab's routing and redirect to the home page
        this.router.navigate(['../']);
        this.router.navigateByUrl('/login');
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
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
