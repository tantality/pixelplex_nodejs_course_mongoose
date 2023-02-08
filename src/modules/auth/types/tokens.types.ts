import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export interface IToken {
  _id: ObjectId;
  value: string;
  expiresAt: Date;
}

export type JWTPayload = { userId: ObjectId; role: string };
export type VerifiedJWTPayload = jwt.JwtPayload & JWTPayload;
