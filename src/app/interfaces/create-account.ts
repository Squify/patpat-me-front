import {UserGender} from './user-gender';

export interface CreateAccount {
    mail: string;
    password: string;
    pseudo: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    push_notification: boolean;
    active_localisation: boolean;
    display_real_name: boolean;
    fk_id_gender: string;
}
