import { Breed } from "./breed";
import { AnimalGender } from "./animal-gender";
import { AnimalType } from "./animal-type";
import { Temper } from "./temper";

export interface Animal {
    id: number;
    name: string;
    birthday: string;
    type: AnimalType;
    gender: AnimalGender;
    breed: Breed;
    tempers: Temper[];
}
