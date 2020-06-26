import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from 'src/app/services/eventsObs/events.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';
import { Animal } from 'src/app/interfaces/animal/animal';
import { User } from 'src/app/interfaces/user/user';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalType } from 'src/app/interfaces/animal/animal-type';
import { Breed } from 'src/app/interfaces/animal/breed';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    user: User;
    animals: Animal[] = [];
    types: AnimalType[] = [];
    breeds: Breed[] = [];
    subscriptionUser: Subscription;
    selectedSegment = 'informationSegment';

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private router: Router,
        public events: EventsService,
        private animalService: AnimalService,
        private typeService: TypeService,
    ) {
    }

    ngOnInit() {

        this.getUserDetail();
        this.getUserAnimals();
        this.getTypes();
        this.getBreed();
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

    getUserById(): void {
       this.userService.getUserById(this.user.id);
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

    getTypes(): void {
        this.typeService.getAnimalType().subscribe(
            val => {
                val.forEach((type) => {
                        const typeToAdd: AnimalType = {
                            id: type.id,
                            name: type.name
                        };
                        this.types.push(typeToAdd);
                    }
                );
            }
        );
    }

    getBreed(): void {
        this.animalService.getAnimalBreed().subscribe(
            val => {
                val.forEach((breed) => {
                        const breedToAdd: Breed = {
                            name: breed.name,
                            type: breed.type
                        };
                        this.breeds.push(breedToAdd);
                    }
                );
            }
        );
    }
}
