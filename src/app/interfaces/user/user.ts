import { UserGender } from './user-gender';
import { Language } from './language';

export interface User {
    id: number;
    email: string;
    pseudo: string;
    profile_pic_path: string;
    first_name: string;
    last_name: string;
    phone: string;
    birthday: string;
    display_email: boolean;
    display_phone: boolean;
    display_real_name: boolean;
    gender: UserGender;
    language: Language;
    friends: User[];
}
