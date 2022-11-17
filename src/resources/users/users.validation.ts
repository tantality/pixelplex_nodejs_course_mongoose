import { Schema } from 'express-validator';
import { validateIdInBody } from '../../validations';

export class UsersValidation {
  static updateUserSchema: Schema = {
    nativeLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };
}
