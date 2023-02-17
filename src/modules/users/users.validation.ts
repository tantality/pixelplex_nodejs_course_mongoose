import { Schema } from 'express-validator';
import { validateId } from '../../validations';

export class UsersValidation {
  static updateUser: Schema = {
    nativeLanguageId: {
      in: ['body'],
      ...validateId,
    },
  };
}
