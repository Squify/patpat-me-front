import { Breed } from "./breed";
import { AnimalGender } from "./animal-gender";
import { AnimalType } from "./animal-type";
import { Temper } from "./temper";
import { User } from "../user/user";

export interface Animal {
    id: number;
    owner: User;
    name: string;
    birthday: string;
    type: AnimalType;
    gender: AnimalGender;
    breed: Breed;
    tempers: Temper[];
}
