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

  
  constructor( ) { 

    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(): void {


    this.createAnimalForm = new FormGroup ({

      name: new FormControl('', {
        validators: [
            Validators.required
        ]
      }),

      birthday: new FormControl(''),

      fk_id_gender:  new FormControl(''),

      fk_id_type: new FormControl(''),

      fk_id_race:  new FormControl(''),

    })
  }

  submit(): void {
    //
  }

  createAccount(): void { 
    this.createAnimalInterface = {
      name: this.createAnimalForm.value.name,
      birthday: this.createAnimalForm.value.birthday,
      fk_id_gender: this.createAnimalForm.value.fk_id_gender,
      fk_id_type: this.createAnimalForm.value.fk_id_type,
      fk_id_race: this.createAnimalForm.value. fk_id_race,
    };

  }
}
