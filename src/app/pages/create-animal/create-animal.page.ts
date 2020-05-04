import {Component, OnInit} from '@angular/core';
import {CreateAnimal} from 'src/app/interfaces/animal/create-animal';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AnimalGender} from 'src/app/interfaces/animal/animal-gender';
import {AnimalType} from 'src/app/interfaces/animal/animal-type';
import {GenderService} from 'src/app/services/gender/gender.service';
import {TypeService} from 'src/app/services/type/type.service';
import {AnimalService} from 'src/app/services/animal/animal.service';
import {Temper} from 'src/app/interfaces/animal/temper';
import {Breed} from 'src/app/interfaces/animal/breed';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-create-animal',
    templateUrl: './create-animal.page.html',
    styleUrls: ['./create-animal.page.scss'],
})
export class CreateAnimalPage implements OnInit {

    createAnimalInterface: CreateAnimal;
    createAnimalForm: FormGroup;
    genders: AnimalGender[] = [];
    types: AnimalType[] = [];
    isTypeSelected: boolean;
    breeds: Breed[] = [];
    breedsToDisplay: Breed[] = [];
    tempers: Temper[] = [];

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

    constructor(
        private genderService: GenderService,
        private typeService: TypeService,
        private animalService: AnimalService,
        public toastController: ToastController,
    ) {

        this.buildForm();
    }

    ngOnInit() {
    }

    buildForm(): void {

        this.getGenders();
        this.getTypes();
        this.getTemper();
        this.getBreed();
        this.isTypeSelected = false;

        // Create account form
        this.createAnimalForm = new FormGroup({

            name: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            birthday: new FormControl(''),

            fk_id_temper: new FormControl(''),

            fk_id_gender: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            fk_id_type: new FormControl('', {
                validators: [
                    Validators.required
                ]
            }),

            fk_id_breed: new FormControl(''),

        });
    }

    typeChange(): void {
        this.isTypeSelected = true;

        this.types.forEach((type) => {
            if (type.name === this.createAnimalForm.value.fk_id_type) {
                this.breedsToDisplay = this.breeds.filter(breed => breed.type.id === type.id);
            }
        });
    }

    getGenders(): void {
        this.genderService.getAnimalGender().subscribe(
            val => {
                val.forEach((gender) => {
                        const genderToAdd: AnimalGender = {name: gender.name};
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
            this.presentToast('general');
            console.log('ça marche po');
        }
    }

    createAnimal(): void {
        this.createAnimalInterface = {
            name: this.createAnimalForm.value.name,
            birthday: this.createAnimalForm.value.birthday,
            tempers: this.createAnimalForm.value.fk_id_temper,
            fk_id_gender: this.createAnimalForm.value.fk_id_gender,
            fk_id_type: this.createAnimalForm.value.fk_id_type,
            fk_id_breed: this.createAnimalForm.value.fk_id_breed,
        };

        this.animalService.createAnimal(this.createAnimalInterface).subscribe(
            _ => console.log('animal créé'),
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
        if (this.createAnimalForm.controls.fk_id_type.errors) {
            this.typeError = true;
        }
        if (this.createAnimalForm.controls.fk_id_gender.errors) {
            this.genderError = true;
        }
        if (this.createAnimalForm.controls.fk_id_temper.errors) {
            this.temperError = true;
        }
        if (this.createAnimalForm.controls.fk_id_breed.errors) {
            this.breedError = true;
        }
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.inputsError = true;
                    this.presentToast('back_input');
                    break;
                case 500:
                    this.serverError = true;
                    this.presentToast('back_server');
                    break;
                default:
                    this.unknownError = true;
                    this.presentToast('back_unknown');
                    break;
            }
        } else {
            this.unknownError = true;
            this.presentToast('back_unknown');
        }
    }

    async presentToast(error: string) {
        let toast: HTMLIonToastElement;
        switch (error) {
            case 'name':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner un nom valide.',
                    duration: 2000
                });
                break;
            case 'birthday':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner une date d\'anniversaire.',
                    duration: 2000
                });
                break;
            case 'fk_id_type':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner le type de l\'animal.',
                    duration: 2000
                });
                break;
            case 'fk_id_genre':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner le genre de l\'animal.',
                    duration: 2000
                });
                break;
            case 'fk_id_breed':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner la race de l\'animal.',
                    duration: 2000
                });
                break;
            case 'fk_id_temper':
                toast = await this.toastController.create({
                    message: 'Veuillez renseigner le temperament de l\'animal.',
                    duration: 2000
                });
                break;
            case 'back_input':
                toast = await this.toastController.create({
                    message: 'La requête est invalide, vérifiez les informations saisies.',
                    duration: 2000
                });
                break;
            case 'back_server':
                toast = await this.toastController.create({
                    message: 'Une erreur serveur est survenue.',
                    duration: 2000
                });
                break;
            case 'back_unknown':
                toast = await this.toastController.create({
                    message: 'Une erreur inconnue est survenue.',
                    duration: 2000
                });
                break;
            default:
                toast = await this.toastController.create({
                    message: 'Le formulaire est erroné ! Cliquez sur les ronds pour plus d\'infos.',
                    duration: 3000
                });
                break;
        }
        toast.present();
    }

}