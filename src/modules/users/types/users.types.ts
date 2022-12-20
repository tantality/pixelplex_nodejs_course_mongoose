import { UpdateUserBody } from './body.types';

export interface IUser {
  id: number;
  nativeLanguageId: number;
  name: string;
  email: string;
  normalizedEmail: string;
  password: string;
  role: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export type CreateUserData = Pick<IUser, 'name' | 'email' | 'normalizedEmail' | 'password' | 'nativeLanguageId'>;
export type UpdateUserData = UpdateUserBody | { refreshToken: string };
