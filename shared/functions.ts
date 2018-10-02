import { Status, User } from './types';

export interface ProfileInfoArgs {
  username: string;
}

export interface ProfileInfoReturn {
  user: User;
  statuses: Status[];
}
