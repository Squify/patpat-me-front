import { UserGender } from './user-gender';

export interface User {
    id: number;
    email: string;
    pseudo: string;
    profile_pic_path: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    display_email: boolean;
    display_phone: boolean;
    display_real_name: boolean;
    gender: UserGender;
    friends: User[];
}
