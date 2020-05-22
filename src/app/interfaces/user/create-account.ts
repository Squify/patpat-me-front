export interface CreateAccount {
    email: string;
    password: string;
    pseudo: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    push_notification: boolean;
    active_localisation: boolean;
    display_real_name: boolean;
    gender: string;
}
