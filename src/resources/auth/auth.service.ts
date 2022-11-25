/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils/log-request.utils';
import { User } from '../users/user.entity';
import { AuthDTO } from './auth.dto';
import { SignUpRequest, LogInRequest } from './types';

export class AuthService {
  private static user = new User(
    1,
    'Angelina',
    'email@gmail.com',
    'email@gmail.com',
    'qwerty123',
    'user',
    'awdwkmkwad243',
    new Date(),
    new Date(),
  );

  private static authDTO = new AuthDTO(AuthService.user, 'amdwiwnf');

  static signUp = async (req: SignUpRequest): Promise<AuthDTO> => {
    logRequest(req);
    return AuthService.authDTO;
  };

  static logIn = async (req: LogInRequest): Promise<AuthDTO> => {
    logRequest(req);
    return AuthService.authDTO;
  };

  static logOut = async (req: Request): Promise<number> => {
    logRequest(req);
    return 1;
  };

  static refresh = async (req: Request): Promise<AuthDTO> => {
    logRequest(req);
    return AuthService.authDTO;
  };
}
