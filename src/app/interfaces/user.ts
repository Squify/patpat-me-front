import { UserGender } from './user-gender';

export interface User {
    id: number,
    mail: string;
    pseudo: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    push_notification: boolean;
    active_localisation: boolean;
    display_real_name: boolean;
    fk_id_gender: string;
}