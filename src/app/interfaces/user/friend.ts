import { User } from './user';

export interface Friend {
    user: User;
    friendOf: boolean;
}
