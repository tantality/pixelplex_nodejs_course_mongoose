import { Response } from 'express';
import { IAuth } from './auth.types';

export type SignUpResponse = Response<IAuth>;
export type LogInResponse = Response<IAuth>;
export type RefreshTokensResponse = Response<IAuth>;
