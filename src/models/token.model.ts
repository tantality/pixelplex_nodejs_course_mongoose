import { model, Schema, Types } from 'mongoose';
import { IToken } from '../modules/auth/types';

const tokenSchema = new Schema<IToken>(
  {
    userId: { ref: 'user', type: Types.ObjectId },
    refreshToken: { type: String, index: true, default: null },
  },
  { timestamps: true },
);

export const Token = model('token', tokenSchema);
