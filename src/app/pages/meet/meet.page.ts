import { Component, OnInit } from '@angular/core';
import { MeetService } from '../../services/meet/meet.service';
import { MetUser } from '../../interfaces/user/met-user';

@Component({
    selector: 'app-meet',
    templateUrl: './meet.page.html',
    styleUrls: ['./meet.page.scss'],
})
export class MeetPage implements OnInit {

    users: MetUser[] = [];

    constructor(
        private meetService: MeetService
    ) {
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.meetService.getMetUsers().subscribe(
            result => {
                console.log(result)
                result.forEach(user => {
                    this.users.push(user);
                })
            }
        );
    }

}
