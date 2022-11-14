/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
import { NextFunction, Request, Response } from 'express';
import { logRequest } from '../../utils/log-request.utils';

export class TasksController {
  static getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };

  static addAnswerToTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logRequest(req);
    res.status(200).json({
      message: 'The operation was successful',
    });
  };
}
