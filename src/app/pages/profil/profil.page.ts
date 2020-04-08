import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user/user.service';
import {User} from 'src/app/interfaces/user';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.page.html',
    styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

    userInterface: User;
    selectedSegment = 'informationSegment';

    constructor(
        private userService: UserService,
    ) {
    }

    segmentChanged(ev: any) {

        this.selectedSegment = ev.detail.value;
    }

    ngOnInit() {

        this.getConnectedUser();
    }

    getConnectedUser(): void {

        this.userService.getUser().subscribe(
            user => {
                this.userInterface = {
                    lastname: user.lastname,
                    firstname: user.firstname,
                    pseudo: user.pseudo,
                    email: user.email,
                    birthday: user.birthday,
                    phone: user.phone,
                    push_notification: user.push_notification,
                    display_real_name: user.display_real_name,
                    active_localisation: user.active_localisation,
                    fk_id_gender: user.fk_id_gender,
                };
            }
        );
    }

}
