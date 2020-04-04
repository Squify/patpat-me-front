import { UserGender } from './user-gender';

export interface Person {
    id: number,
    email: string;
    pseudo: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    push_notification: boolean;
    active_localisation: boolean;
    display_real_name: boolean;
    fk_id_gender: UserGender;
}