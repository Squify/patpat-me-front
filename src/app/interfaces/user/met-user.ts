import { UserGender } from './user-gender';

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
    events: string[];
    isFriend: boolean;
}
