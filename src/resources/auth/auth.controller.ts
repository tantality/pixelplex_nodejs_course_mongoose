/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
import { NextFunction, Request, Response } from 'express';
import { logRequest } from '../../utils/log-request.utils';

export class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static refreshTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };
}
