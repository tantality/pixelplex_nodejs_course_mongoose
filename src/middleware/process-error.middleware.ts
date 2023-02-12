import { NextFunction, Request, Response } from 'express';
import { SERVER_ERROR_MESSAGE } from '../errors';
import { isAppError } from '../errors/app.error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const processError = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (isAppError(error)) {
    const { message, statusCode } = error;
    res.status(statusCode).json({ message, statusCode });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).json({ message: SERVER_ERROR_MESSAGE, statusCode: 500 });
};
