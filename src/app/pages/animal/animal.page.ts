import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Animal } from 'src/app/interfaces/animal/animal';
import { AnimalGender } from 'src/app/interfaces/animal/animal-gender';
import { AnimalType } from 'src/app/interfaces/animal/animal-type';
import { Breed } from 'src/app/interfaces/animal/breed';
import { Temper } from 'src/app/interfaces/animal/temper';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { GenderService } from 'src/app/services/gender/gender.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-animal',
    templateUrl: './animal.page.html',
    styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

    animalId: number;
    animal: Animal;
    genders: AnimalGender[] = [];
    types: AnimalType[] = [];
    breeds: Breed[] = [];
    breedsToDisplay: Breed[] = [];
    tempers: Temper[] = [];
   
    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private genderService: GenderService,
        private typeService: TypeService,
        private animalService: AnimalService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.animalId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.animalId)
            this.router.navigateByUrl('/tabs/profile');
            
        this.getAnimal();
        this.getGenders();
        this.getTypes();
        this.getTemper();
        this.getBreed();
    }

    ionViewDidEnter() {
        if (history.state.comingFromEdition) {
            //this.ngZone.run(() => this.getAnimal())
        }
    }
    
    getAnimal(): void {

        this.animalService.getAnimalById(this.animalId).subscribe(
            value => {
                this.animal = value;
                if (!this.isOwner())
                this.router.navigateByUrl('/tabs/events');
            },
        );
    }

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.animal.owner.id == connectedUserId;
    }

    getGenders(): void {
        this.genderService.getAnimalGender().subscribe(
            val => {
                val.forEach((gender) => {
                        const genderToAdd: AnimalGender = {
                            name: gender.name
                        };
                        this.genders.push(genderToAdd);
                    }
                );
            }
        );
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

        this.breedsToDisplay = this.breeds;
    }

    getTemper(): void {
        this.animalService.getAnimalTemper().subscribe(
            val => {
                val.forEach((temper) => {
                        const tempersToAdd: Temper = {
                            id: temper.id,
                            name: temper.name
                        };
                        this.tempers.push(tempersToAdd);
                    }
                );
            }
        );
    }

    
}
