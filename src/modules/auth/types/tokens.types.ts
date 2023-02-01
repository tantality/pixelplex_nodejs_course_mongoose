import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export interface IToken {
  _id: ObjectId;
  userId: ObjectId;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenWithUserId = Pick<IToken, 'userId' | 'refreshToken'>;

export type JWTPayload = { userId: ObjectId; role: string };
export type VerifiedJWTPayload = jwt.JwtPayload & JWTPayload;