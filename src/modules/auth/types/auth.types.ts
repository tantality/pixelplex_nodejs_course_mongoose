import { ObjectId } from 'mongoose';

export interface IAuth {
  id: ObjectId;
  refreshToken: string;
  accessToken: string;
}
