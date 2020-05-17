import {Temper} from "./temper";
import {Breed} from "./breed";
import {AnimalGender} from "./animal-gender";
import {AnimalType} from "./animal-type";

export interface AnimalInterface {
    
    id: number;
    name: string;
    birthday: string;
    fk_id_type: AnimalType;
    fk_id_gender: AnimalGender;
    fk_id_breed: Breed;
    tempers: Temper[];
}