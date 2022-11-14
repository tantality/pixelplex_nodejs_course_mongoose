/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
import { NextFunction, Request, Response } from 'express';
import { logRequest } from '../../utils/log-request.utils';

export class LanguagesController {
  static getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static getOneLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static createLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static updateLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static deleteLanguage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };
}
