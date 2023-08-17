import { Perfume } from '../perfume.entity/perfume';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  perfumes: Perfume[];
};

export type UserLogin = {
  user: string;
  password: string;
};
