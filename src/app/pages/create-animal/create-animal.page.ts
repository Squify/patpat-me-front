import { Component, OnInit } from '@angular/core';
import { CreateAnimal } from 'src/app/interfaces/create-animal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AnimalGender } from 'src/app/interfaces/animal-gender';
import { AnimalType } from 'src/app/interfaces/animal-type';
import { GenderService } from 'src/app/services/gender/gender.service';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { AnimalTemper } from 'src/app/interfaces/animal-temper';
import { AnimalRace } from 'src/app/interfaces/animal-race';

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
  races: AnimalRace[] = [];
  tempers: AnimalTemper[] = [];

  constructor(
    private genderService: GenderService,
    private typeService: TypeService,
    private animalService: AnimalService,

  ) {

    this.buildForm();
  }

  ngOnInit() {
  }

  buildForm(): void {

    this.getGenders();
    this.getTypes();
    this.getTemper();
    this.getRace();

    // Create account form
    this.createAnimalForm = new FormGroup({

      name: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),

      birthday: new FormControl(''),

      fk_id_temper: new FormControl(''),

      fk_id_gender: new FormControl(''),

      fk_id_type: new FormControl(''),

      fk_id_race: new FormControl(''),

    })
  }

  //GetAnimalGender
  getGenders(): void {
    this.genderService.getAnimalGender().subscribe(
      val => {
        val.forEach((gender) => {
          const genderToAdd: AnimalGender = { name: gender.name };
          this.genders.push(genderToAdd);
        }
        );
      }
    );
  }

  //GetAnimalType
  getTypes(): void {
    this.typeService.getAnimalType().subscribe(
      val => {
        val.forEach((type) => {
          const typeToAdd: AnimalType = { name: type.name };
          this.types.push(typeToAdd);
        }
        );
      }
    );
  }

  //GetAnimalRace
  getRace(): void {
    this.animalService.getAnimalRace().subscribe(
      val => {
        val.forEach((race) => {
          const raceToAdd: AnimalRace = { name: race.name };
          this.races.push(raceToAdd);
        }
        );
      }
    );
  }

  //GetAnimalTemper
  getTemper(): void {
    this.animalService.getAnimalTemper().subscribe(
      val => {
        val.forEach((temper) => {
          const tempersToAdd: AnimalRace = { name: temper.name };
          this.tempers.push(tempersToAdd);
        }
        );
      }
    );
  }

  submit(): void {
    //
  }

  createAccount(): void {
    this.createAnimalInterface = {
      name: this.createAnimalForm.value.name,
      birthday: this.createAnimalForm.value.birthday,
      fk_id_temper: this.createAnimalForm.value.temper,
      fk_id_gender: this.createAnimalForm.value.fk_id_gender,
      fk_id_type: this.createAnimalForm.value.fk_id_type,
      fk_id_race: this.createAnimalForm.value.fk_id_race,
    };

  }
}
