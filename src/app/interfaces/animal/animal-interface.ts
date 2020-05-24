import {Temper} from "./temper";
import {Breed} from "./breed";
import {AnimalGender} from "./animal-gender";
import {AnimalType} from "./animal-type";

export interface AnimalInterface {
    
    id: number;
    name: string;
    birthday: string;
    type: AnimalType;
    gender: AnimalGender;
    breed: Breed;
    tempers: Temper[];
}
