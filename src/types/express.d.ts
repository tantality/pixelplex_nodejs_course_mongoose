import { ObjectId } from 'mongoose';
import 'express';

declare module 'express' {
  export interface Request {
    userId?: ObjectId;
    role?: string;
  }
}
