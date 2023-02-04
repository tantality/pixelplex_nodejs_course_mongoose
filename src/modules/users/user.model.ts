import { model, Schema, Types } from 'mongoose';
import { REFRESH_TOKEN_LIFETIME_IN_MS } from '../auth/auth.constants';
import { IToken } from '../auth/types';
import { IUser, USER_ROLE } from './types';

const tokenSchema = new Schema<IToken>({
  value: { type: String, index: true },
  expiresAt: { type: Date, default: Date.now() + REFRESH_TOKEN_LIFETIME_IN_MS },
});

const userSchema = new Schema<IUser>(
  {
    nativeLanguageId: { ref: 'language', type: Types.ObjectId, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    normalizedEmail: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: [USER_ROLE.USER, USER_ROLE.ADMIN], default: USER_ROLE.USER },
    refreshTokens: { type: [tokenSchema] },
  },
  { timestamps: true },
);

export const User = model('user', userSchema);
