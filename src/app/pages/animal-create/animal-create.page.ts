import { Component, OnInit } from '@angular/core';
import { CreateAnimal } from 'src/app/interfaces/animal/create-animal';
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
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UpdateService } from '../../services/update/update.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-create-animal',
    templateUrl: './animal-create.page.html',
    styleUrls: ['./animal-create.page.scss'],
})
export class AnimalCreatePage implements OnInit {

    createAnimalInterface: CreateAnimal;
    createAnimalForm: FormGroup;
    isTypeSelected: boolean;

    breeds: Breed[] = [];
    breedsToDisplay: Breed[] = [];
    genders: AnimalGender[] = [];
    tempers: Temper[] = [];
    types: AnimalType[] = [];

    // Errors
    unknownError: boolean;
    serverError: boolean;
    inputsError: boolean;
    nameInputError: boolean;
    birthdayError: boolean;
    typeError: boolean;
    breedError: boolean;
    temperError: boolean;
    genderError: boolean;

    catPicPaths: string[] = [];
    dogPicPaths: string[] = [];
    selectedPic: string;

    constructor(
        public platform: Platform,
        private router: Router,
        private animalService: AnimalService,
        public errorService: ErrorService,
        private genderService: GenderService,
        private translate: TranslateService,
        private typeService: TypeService,
        private updateService: UpdateService,
    ) {
    }

    ngOnInit() {

        this.buildForm();
        this.getAttributes();
    }

    getPicPath(path): void {
        this.selectedPic = path;
    }

    buildForm(): void {

        this.dogPicPaths = this.animalService.loadDogPics();
        this.catPicPaths = this.animalService.loadCatPics();

        this.isTypeSelected = false;

        // Create account form
        this.createAnimalForm = new FormGroup({
            name: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
            birthday: new FormControl(''),
            temper: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
            gender: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
            type: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),
            breed: new FormControl(''),

        });
    }

    typeChange(): void {
        this.isTypeSelected = true;

        if (this.createAnimalForm.value.fk_id_type == 'Chien') {
            this.selectedPic = null;
            this.dogPicPaths = this.animalService.loadDogPics();
        }
        if (this.createAnimalForm.value.fk_id_type == 'Chat') {
            this.selectedPic = null;
            this.catPicPaths = this.animalService.loadCatPics();
        }

        this.types.forEach((type) => {
            if (type.name === this.createAnimalForm.value.type) {
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
        this.nameInputError = false;
        this.birthdayError = false;
        this.breedError = false;
        this.temperError = false;
        this.genderError = false;
        this.typeError = false;
    }

    submit(): void {
        if (this.formIsValid()) {
            this.createAnimal();
        } else {
            this.errorService.presentToast('default');
        }
    }

    createAnimal(): void {
        this.createAnimalInterface = {
            name: this.createAnimalForm.value.name,
            birthday: this.createAnimalForm.value.birthday,
            tempers: this.createAnimalForm.value.temper,
            gender: this.createAnimalForm.value.gender,
            type: this.createAnimalForm.value.type,
            breed: this.createAnimalForm.value.breed,
            image_path: this.selectedPic
        };

        this.animalService.createAnimal(this.createAnimalInterface).subscribe(
            _ => {
                this.updateService.publishSomeData('createAnimal')
                this.router.navigate(['tabs/profile'])
            },
            error => this.processError(error));
    }

    formIsValid(): boolean {
        this.setAllErrorsToFalse();
        this.checkInputsError();

        return !this.createAnimalForm.invalid;
    }

    checkInputsError(): void {
        if (this.createAnimalForm.controls.name.errors) {
            this.nameInputError = true;
        }
        if (this.createAnimalForm.controls.birthday.errors) {
            this.birthdayError = true;
        }
        if (this.createAnimalForm.controls.type.errors) {
            this.typeError = true;
        }
        if (this.createAnimalForm.controls.gender.errors) {
            this.genderError = true;
        }
        if (this.createAnimalForm.controls.temper.errors) {
            this.temperError = true;
        }
        if (this.createAnimalForm.controls.breed.errors) {
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
