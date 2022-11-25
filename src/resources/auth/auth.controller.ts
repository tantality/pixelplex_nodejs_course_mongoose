/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpResponse, LogInResponse, LogOutResponse, RefreshTokensResponse, SignUpRequest, LogInRequest } from './types';

export class AuthController {
  static signUp = async (req: SignUpRequest, res: SignUpResponse, next: NextFunction): Promise<void> => {
    const auth = await AuthService.signUp(req);
    res.status(201).json(auth);
  };

  static logIn = async (req: LogInRequest, res: LogInResponse, next: NextFunction): Promise<void> => {
    const auth = await AuthService.logIn(req);
    res.status(200).json(auth);
  };

  static logOut = async (req: Request, res: LogOutResponse, next: NextFunction): Promise<void> => {
    const userId = await AuthService.logOut(req);
    res.status(200).json({ id: userId });
  };

  static refreshTokens = async (req: Request, res: RefreshTokensResponse, next: NextFunction): Promise<void> => {
    const auth = await AuthService.refresh(req);
    res.status(200).json(auth);
  };
}
