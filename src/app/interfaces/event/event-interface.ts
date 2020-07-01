import { EventType } from './event-type';
import { User } from '../user/user';

export interface EventInterface {
    id: number;
    name: string;
    description: string;
    location: string;
    date: string;
    type: EventType;
    owner: User;
    members: User[];
}
