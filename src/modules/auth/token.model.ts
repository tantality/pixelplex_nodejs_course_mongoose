import { model, Schema, Types } from 'mongoose';
import { REFRESH_TOKEN_LIFETIME_IN_SEC } from './auth.constants';
import { IToken } from './types';

const tokenSchema = new Schema<IToken>(
  {
    userId: { ref: 'user', type: Types.ObjectId },
    refreshToken: { type: String, index: true, default: null },
  },
  { timestamps: true },
);

tokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: REFRESH_TOKEN_LIFETIME_IN_SEC });

export const Token = model('token', tokenSchema);
