import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user/user';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Animal } from "../../interfaces/animal/animal";
import { EventsService } from "../../services/eventsObs/events.service";

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

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private router: Router,
        public events: EventsService,
    ) {
    }

    ngOnInit() {

        this.getUserDetail();
        this.getUserAnimals();
        this.events.getObservable().subscribe((data) => {
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
        this.subscriptionUser = this.userService.getUser().subscribe(user => this.user = user);
    }

    getUserAnimals(): void {

        this.animals = [];
        this.userService.getUserAnimals().subscribe(animals => {
            animals.forEach(animal => {
                this.animals.push(animal);
            })
        });
        this.animals.sort((a, b) => a.name.localeCompare(b.name));
    }

    segmentChanged(ev: any) {
        this.selectedSegment = ev.detail.value;
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

    calculateAge(birthday) { // birthday is a date

        if (birthday) {
            const date = birthday.split("-", 2);
            const dateMonth: number = date[1];
            const dateYear: number = date[0];

            const today = new Date().toLocaleString().split("/", 3);
            const todayMonth: number = +today[1];
            const todayYear: number = +today[2].split(" ", 1)[0];

            var age = 0;

            if (todayYear > dateYear) {
                if (todayMonth <= dateMonth) {
                    age = todayYear - dateYear;
                    if (age == 1) {
                        return age + " an";
                    } else if (age > 1) {
                        return age + " ans";
                    }
                } else {
                    age = todayYear - dateYear + 1;
                    return age + " ans";
                }
            } else if (todayYear <= dateYear) {
                if (todayMonth <= dateMonth) {
                    age = todayMonth - dateMonth;
                    if (age >= 1) {
                        return age + " mois";
                    } else if (age == 0) {
                        return "Quelques semaines";
                    }
                } else {
                    age = todayMonth - dateMonth;
                    return age + " mois";
                }
            }
        }
        return "Non renseigné";
    }
}
