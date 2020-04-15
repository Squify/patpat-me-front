import { Component, OnInit } from '@angular/core';
import { CreateAnimal } from 'src/app/interfaces/create-animal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-animal',
  templateUrl: './create-animal.page.html',
  styleUrls: ['./create-animal.page.scss'],
})
export class CreateAnimalPage implements OnInit {

  createAnimalInterface: CreateAnimal;
  createAnimalForm: FormGroup;

  //Errors
  unknownError: boolean;
  serverError: boolean;
  inputsError: boolean;
  nameInputError: boolean;
  
  constructor(
    public toastController: ToastController
    /*
    private animalService: AnimalService,
    private userService: UserService,
    private genderService: GenderService, 
    private typeService: TypeService,
    private raceService: RaceService,
    
    */
  ) { 

    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(): void {

    /*
      this.getUser();
      this.getGenders()
      this.getType();
      this.getRace();
    */

    this.createAnimalForm = new FormGroup ({

      pseudo: new FormControl('', {
        validators: [
            Validators.required
        ]
      }),

      birthday: new FormControl(''),

      fk_id_owner:  new FormControl(''),

      fk_id_gender:  new FormControl(''),

      fk_id_type: new FormControl(''),

      fk_id_race:  new FormControl(''),

    })
  }

  setAllErrorsToFalse(): void {
    this.serverError = false;
    this.unknownError = false;
    this.inputsError = false;
    this.nameInputError = false;
  }

  submit(): void {
    if (this.formIsValid()) {
      this.createAccount();
  } else {
      this.presentToast('general');
      console.log('ça marche po');
  }
  
  }

  
  createAccount(): void { 
    this.createAnimalInterface = {
      name: this.createAnimalForm.value.name,
      birthday: this.createAnimalForm.value.birthday,
      fk_id_owner: this.createAnimalForm.value.fk_id_owner,
      fk_id_gender: this.createAnimalForm.value.fk_id_gender,
      fk_id_type: this.createAnimalForm.value.fk_id_type,
      fk_id_race: this.createAnimalForm.value. fk_id_race,
    };

    /*
    this.animalService.createAnimal(this.createAnimalInterface).subscribe(
        _ => console.log("cest bon"),
        error => this.processError(error))
    ;*/
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
