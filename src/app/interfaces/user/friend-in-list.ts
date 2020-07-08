import { Animal } from '../animal/animal';

export interface FriendInList {
    id: number;
    email: string;
    pseudo: string;
    profile_pic_path: string;
    firstname: string;
    lastname: string;
    display_real_name: boolean;
    animals: Animal[];
    friends: number[];
    friendOf: boolean;
}
