/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { SignUpRequest, LogInRequest, IAuth } from './types';

const authData = { id: 1, accessToken: 'accessToken', refreshToken: 'refreshToken' } as IAuth;

export class AuthService {
  static signUp = async (req: SignUpRequest): Promise<IAuth> => {
    logRequest(req);
    return authData;
  };

  static logIn = async (req: LogInRequest): Promise<IAuth> => {
    logRequest(req);
    return authData;
  };

  static logOut = async (req: Request): Promise<void> => {
    logRequest(req);
  };

  static refresh = async (req: Request): Promise<IAuth> => {
    logRequest(req);
    return authData;
  };
}
