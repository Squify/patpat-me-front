import { UserGender } from './user-gender';
import { Language } from './language';

export interface MetUser {
    id: number;
    email: string;
    pseudo: string;
    profile_pic_path: string;
    firstname: string;
    lastname: string;
    phone: string;
    display_email: boolean;
    display_phone: boolean;
    display_real_name: boolean;
    gender: UserGender;
    language: Language;
    events: string[];
    isFriend: boolean;
}
