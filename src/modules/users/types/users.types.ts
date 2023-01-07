import { ObjectId } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  nativeLanguageId: ObjectId | null;
  name: string;
  email: string;
  normalizedEmail: string;
  password: string;
  role: string;
  refreshTokens: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export type CreateUserData = Pick<IUser, 'name' | 'email' | 'normalizedEmail' | 'password'> & { nativeLanguageId: ObjectId };
