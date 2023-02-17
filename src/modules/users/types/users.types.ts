import { ObjectId } from 'mongoose';
import { IToken } from '../../auth/types';

export interface IUser {
  _id: ObjectId;
  nativeLanguageId: ObjectId | null;
  name: string;
  email: string;
  normalizedEmail: string;
  password: string;
  role: string;
  refreshTokens: IToken[];
  createdAt: Date;
  updatedAt: Date;
}

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}
