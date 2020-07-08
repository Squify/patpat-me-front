import { Component, OnInit } from '@angular/core';
import { UpdateAnimal } from 'src/app/interfaces/animal/update-animal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimalGender } from 'src/app/interfaces/animal/animal-gender';
import { AnimalType } from 'src/app/interfaces/animal/animal-type';
import { GenderService } from 'src/app/services/gender/gender.service';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { Temper } from 'src/app/interfaces/animal/temper';
import { Breed } from 'src/app/interfaces/animal/breed';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Animal } from '../../interfaces/animal/animal';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-update-animal',
    templateUrl: './animal-edit.page.html',
    styleUrls: ['./animal-edit.page.scss'],
})
export class AnimalEditPage implements OnInit {

    animalId: number;
    animal: Animal;

    updateAnimalInterface: UpdateAnimal;
    updateAnimalForm: FormGroup;
    isTypeSelected: boolean;

    breeds: Breed[] = [];
    breedsToDisplay: Breed[] = [];
    genders: AnimalGender[] = [];
    types: AnimalType[] = [];
    tempers: Temper[] = [];

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    birthdayError: boolean;
    typeError: boolean;
    breedError: boolean;
    temperError: boolean;
    genderError: boolean;

    catPicPaths: string[] = [];
    dogPicPaths: string[] = [];
    selectedPic: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        public platform: Platform,
        private router: Router,
        private animalService: AnimalService,
        public errorService: ErrorService,
        private genderService: GenderService,
        private translate: TranslateService,
        private typeService: TypeService,
        private updateService: UpdateService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {

        this.animalId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.animalId)
            this.router.navigateByUrl('/tabs/profile');

        this.getAttributes();
        this.getAnimal();
    }

    getPicPath(path): void {
        this.selectedPic = path;
    }

    getAnimal(): void {

        this.animalService.getAnimalById(this.animalId).subscribe(
            value => {
                this.animal = value;
                if (!this.isOwner())
                    this.router.navigateByUrl('/tabs/events');

                this.buildForm();
            },
            error => this.processError(error)
        );
    }

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.animal.owner.id == connectedUserId;
    }

    buildForm(): void {

        this.selectedPic = this.animal.image_path;
        this.dogPicPaths = this.animalService.loadDogPics();
        this.catPicPaths = this.animalService.loadCatPics();
        this.isTypeSelected = !!this.animal.type;

        this.updateAnimalForm = new FormGroup({
            birthday: new FormControl({value: this.animal.birthday ? this.animal.birthday : null, disabled: false}),
            temper: new FormControl({value: this.animal.tempers.map(temper => temper.name), disabled: false}, {
                validators: [
                    Validators.required
                ]
            }),
            gender: new FormControl({value: this.animal.gender.name, disabled: false}, {
                validators: [
                    Validators.required
                ]
            }),
            type: new FormControl({value: this.animal.type.name, disabled: false}, {
                validators: [
                    Validators.required
                ]
            }),
            breed: new FormControl({value: this.animal.breed ? this.animal.breed.name : null, disabled: false}),
        });


        if (this.isTypeSelected == true) {
            this.typeChange();
        }
    }

    typeChange(): void {
        this.isTypeSelected = true;

        if (this.updateAnimalForm.value.type == 'Chien')
            this.dogPicPaths = this.animalService.loadDogPics();
        if (this.updateAnimalForm.value.type == 'Chat')
            this.catPicPaths = this.animalService.loadCatPics();

        this.types.forEach((type) => {
            if (type.name === this.updateAnimalForm.value.type) {
                this.breedsToDisplay = this.breeds.filter(breed => breed.type.id === type.id);
            }
        });
    }

    getAttributes(): void {

        this.genderService.getAnimalGender().subscribe(
            val => this.genders = val,
            error => this.processError(error)
        );

        this.typeService.getAnimalType().subscribe(
            val => this.types = val,
            error => this.processError(error)
        );

        this.animalService.getAnimalBreed().subscribe(
            val => this.breeds = val,
            error => this.processError(error)
        );

        this.breedsToDisplay = this.breeds;

        this.animalService.getAnimalTemper().subscribe(
            val => this.tempers = val,
            error => this.processError(error)
        );
    }

    setAllErrorsToFalse(): void {
        this.serverError = false;
        this.unknownError = false;
        this.inputsError = false;
        this.birthdayError = false;
        this.breedError = false;
        this.temperError = false;
        this.genderError = false;
        this.typeError = false;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.updateAnimal();
        } else {
            this.errorService.presentToast('default');
        }
    }

    updateAnimal(): void {

        this.updateAnimalForm.value.birthday = new Date(this.updateAnimalForm.value.birthday).toISOString();

        this.updateAnimalInterface = {
            id: this.animal.id,
            owner: this.animal.owner.id,
            birthday: this.updateAnimalForm.value.birthday,
            tempers: this.updateAnimalForm.value.temper,
            gender: this.updateAnimalForm.value.gender,
            type: this.updateAnimalForm.value.type,
            breed: this.updateAnimalForm.value.breed,
            image_path: this.setPicture()
        };

        this.animalService.updateAnimal(this.updateAnimalInterface).subscribe(
            _ => {
                this.updateService.publishSomeData('updateAnimal')
                this.router.navigateByUrl('/tabs/profile/animal/' + this.animalId, {state: {comingFromEdition: true}})
            },
            error => this.processError(error)
        );
    }

    setPicture(): string {
        if (!this.selectedPic) {
            if (this.updateAnimalForm.value.type == 'Chat') {
                return environment.default_cat_pic
            } else if (this.updateAnimalForm.value.type == 'Chat') {
                return environment.default_dog_pic
            }
        } else
            return this.selectedPic;
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();

        return !this.updateAnimalForm.invalid;
    }

    checkInputsError(): void {
        if (this.updateAnimalForm.controls.birthday.errors) {
            this.birthdayError = true;
        }
        if (this.updateAnimalForm.controls.type.errors) {
            this.typeError = true;
        }
        if (this.updateAnimalForm.controls.gender.errors) {
            this.genderError = true;
        }
        if (this.updateAnimalForm.controls.temper.errors) {
            this.temperError = true;
        }
        if (this.updateAnimalForm.controls.breed.errors) {
            this.breedError = true;
        }
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.errorService.presentToast('back_input');
                    break;
                case 417:
                    this.inputsError = true;
                    this.errorService.presentToast('animal_back_user');
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

