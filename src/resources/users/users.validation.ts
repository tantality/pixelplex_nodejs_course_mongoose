import { Schema } from 'express-validator';
import { validateId } from '../../validations';

export class UsersValidation {
  static updateUserSchema: Schema = {
    nativeLanguageId: {
      in: ['body'],
      ...validateId,
    },
  };
}
