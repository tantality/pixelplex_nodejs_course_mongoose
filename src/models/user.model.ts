import { model, Schema, Types } from 'mongoose';
import { IUser, USER_ROLE } from '../modules/users/types';

const userSchema = new Schema<IUser>(
  {
    nativeLanguageId: { ref: 'language', type: Types.ObjectId, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    normalizedEmail: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: [USER_ROLE.USER, USER_ROLE.ADMIN], default: USER_ROLE.USER },
    refreshTokens: { type: [String], index: true, default: null },
  },
  { timestamps: true },
);

export const User = model('user', userSchema);
