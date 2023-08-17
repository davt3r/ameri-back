import { User } from '../entities/user.entity/user';

export type ApiResponse = {
  count: number;

  items: { [key: string]: unknown }[];
};

export type LoginResponse = {
  token: string;
  user: User;
};
