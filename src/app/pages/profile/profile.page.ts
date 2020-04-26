import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user/user.service';
import {User} from 'src/app/interfaces/user';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-profil',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

    user: User;
    subscriptionUser: Subscription;
    selectedSegment = 'informationSegment';

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private router: Router,
    ) {
    }


    logout() {
        this.authService.logout().subscribe(_ => this.processLogoutSuccess(), error => this.processError(error));
    }

    processLogoutSuccess(): void {
        // remove authenticated person in service
        this.userService.setPerson(null);

        // Reset this tab's routing and redirect to the home page
        this.router.navigate(['../']);
        this.router.navigateByUrl('/login');
    }

    processError(error: HttpErrorResponse): void {
        // error processing here
    }



    segmentChanged(ev: any) {

        this.selectedSegment = ev.detail.value;
    }

    ngOnInit() {

        this.subscriptionUser = this.userService.getUser().subscribe(user => this.user = user);
        // this.getConnectedUser();
    }

    ngOnDestroy() {
        this.subscriptionUser.unsubscribe();
    }

    // getConnectedUser(): void {
    //
    //     this.userService.getUser().subscribe(
    //         user => {
    //             this.user = {
    //                 lastname: user.lastname,
    //                 firstname: user.firstname,
    //                 pseudo: user.pseudo,
    //                 email: user.email,
    //                 birthday: user.birthday,
    //                 phone: user.phone,
    //                 push_notification: user.push_notification,
    //                 display_real_name: user.display_real_name,
    //                 active_localisation: user.active_localisation,
    //                 fk_id_gender: user.fk_id_gender,
    //             };
    //             console.log(this.user);
    //         }
    //     );
    // }

}
