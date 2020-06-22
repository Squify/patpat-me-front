export interface AccountCreate {
    email: string;
    password: string;
    pseudo: string;
    profile_pic_path: string;
    firstname: string;
    lastname: string;
    phone: string;
    birthday: string;
    push_notification: boolean;
    active_localisation: boolean;
    display_real_name: boolean;
    gender: string;
}
