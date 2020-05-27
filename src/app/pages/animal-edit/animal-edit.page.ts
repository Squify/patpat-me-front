import { Component, OnInit } from '@angular/core';
import { UpdateAnimal } from 'src/app/interfaces/animal/update-animal';
import { FormControl, FormGroup } from '@angular/forms';
import { AnimalGender } from 'src/app/interfaces/animal/animal-gender';
import { AnimalType } from 'src/app/interfaces/animal/animal-type';
import { GenderService } from 'src/app/services/gender/gender.service';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { Temper } from 'src/app/interfaces/animal/temper';
import { Breed } from 'src/app/interfaces/animal/breed';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Animal } from "../../interfaces/animal/animal";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../services/user/user.service";

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
        public router: Router,
        private activatedRoute: ActivatedRoute,
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

    getAnimal(): void {

        this.animalService.getAnimalById(this.animalId).subscribe(
            value => {
                this.animal = value;
                if (!this.isOwner())
                    this.router.navigateByUrl('/tabs/events');

                this.buildForm();
            },
            e => this.processError(e)
        );
    }

    isOwner(): boolean {

        let connectedUserId;
        this.userService.getUser().subscribe(connectedUser => connectedUserId = connectedUser.id)
        return this.animal.owner.id == connectedUserId;
    }

    buildForm(): void {

        this.isTypeSelected = false;

        this.updateAnimalForm = new FormGroup({

            birthday: new FormControl({value: this.animal.birthday, disabled: false}),
            fk_id_temper: new FormControl({value: this.animal.tempers.map(temper => temper.name), disabled: false}),
            fk_id_gender: new FormControl({value: this.animal.gender.name, disabled: false}),
            fk_id_type: new FormControl({value: this.animal.type.name, disabled: false}),
            fk_id_breed: new FormControl({value: this.animal.breed.name, disabled: false}),
        });
    }

    typeChange(): void {
        this.isTypeSelected = true;

        this.types.forEach((type) => {
            if (type.name === this.updateAnimalForm.value.fk_id_type) {
                this.breedsToDisplay = this.breeds.filter(breed => breed.type.id === type.id);
            }
        });
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
            this.presentToast('general');
        }
    }

    updateAnimal(): void {
        this.updateAnimalInterface = {
            id: this.animal.id,
            owner: this.animal.owner.id,
            birthday: this.updateAnimalForm.value.birthday,
            tempers: this.updateAnimalForm.value.fk_id_temper,
            gender: this.updateAnimalForm.value.fk_id_gender,
            type: this.updateAnimalForm.value.fk_id_type,
            breed: this.updateAnimalForm.value.fk_id_breed,
        };

        this.animalService.updateAnimal(this.updateAnimalInterface).subscribe(
            _ => this.router.navigateByUrl('/tabs/profile/animal/' + this.animalId, {state: {comingFromEdition: true}}),
            e => this.processError(e)
        );
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
        if (this.updateAnimalForm.controls.fk_id_type.errors) {
            this.typeError = true;
        }
        if (this.updateAnimalForm.controls.fk_id_gender.errors) {
            this.genderError = true;
        }
        if (this.updateAnimalForm.controls.fk_id_temper.errors) {
            this.temperError = true;
        }
        if (this.updateAnimalForm.controls.fk_id_breed.errors) {
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
                case 417:
                    this.inputsError = true;
                    this.presentToast('back_user');
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
            case 'back_user':
                toast = await this.toastController.create({
                    message: 'Vous ne pouvez pas modifier un animal qui n\'est pas à vous.',
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

