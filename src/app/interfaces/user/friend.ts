import { User } from './user';
import { Animal } from '../animal/animal';

export interface Friend {
    user: User;
    animals: Animal[];
    friendOf: boolean;
}
