import { ParamSchema, Schema } from 'express-validator';
import { validateAndSanitizeString, validateBaseQuery, validateId } from '../../validations';

export class LanguagesValidation {
  private static codeLength: ParamSchema = {
    isLength: {
      errorMessage: 'Value must be in the range from 2 to 4 characters',
      options: {
        min: 2,
        max: 4,
      },
    },
  };

  private static nameLength: ParamSchema = {
    isLength: {
      errorMessage: 'Value must be in the range from 2 to 50 characters',
      options: {
        min: 2,
        max: 50,
      },
    },
  };

  static getLanguagesSchema: Schema = validateBaseQuery;

  static getOneLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
  };

  static createLanguageSchema: Schema = {
    code: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.codeLength,
    },
    name: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.nameLength,
    },
  };

  static updateLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
    code: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.codeLength,
    },
    name: {
      in: ['body'],
      ...validateAndSanitizeString,
      ...LanguagesValidation.nameLength,
    },
  };

  static deleteLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...validateId,
    },
  };
}
