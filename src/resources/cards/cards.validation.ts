import { ParamSchema, Schema } from 'express-validator';
import { SORT_BY } from '../../constants/common.constants';
import {
  validateAndSanitizeString,
  validateId,
  validateBaseQuery,
  checkStringIn,
  validateStringLength,
  validateIdInBody,
  validateArray,
} from '../../validations';

export class CardsValidation {
  private static isArrayOfStrings = (arr: Array<any>): boolean => arr.every((elem) => typeof elem === 'string');

  private static validateArray: ParamSchema = {
    in: ['body'],
    isArray: {
      errorMessage: 'Value must be an array with the number of elements from 1 to 3',
      options: {
        min: 1,
        max: 3,
      },
      bail: true,
    },
    custom: {
      options: (value: Array<any>) => validateArray(value, CardsValidation.isArrayOfStrings),
    },
  };

  static getCards: Schema = {
    ...validateBaseQuery,
    languageId: {
      in: ['query'],
      optional: {
        options: {
          checkFalsy: true,
        },
      },
      ...validateId,
    },
    sortBy: {
      in: ['query'],
      default: {
        options: SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, [SORT_BY.DATE, SORT_BY.WORD]),
      },
    },
  };

  static createCard: Schema = {
    'nativeWords.*': {
      in: ['body'],
      ...validateAndSanitizeString,
      ...validateStringLength,
    },
    'foreignWords.*': {
      in: ['body'],
      ...validateAndSanitizeString,
      ...validateStringLength,
    },
    nativeWords: {
      ...CardsValidation.validateArray,
    },
    foreignWords: {
      ...CardsValidation.validateArray,
    },
    foreignLanguageId: {
      in: ['body'],
      ...validateIdInBody,
    },
  };

  static updateCard: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
    foreignLanguageId: {
      in: ['body'],
      optional: true,
      ...validateIdInBody,
    },
    'nativeWords.*': {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...validateStringLength,
    },
    'foreignWords.*': {
      in: ['body'],
      optional: true,
      ...validateAndSanitizeString,
      ...validateStringLength,
    },
    nativeWords: {
      optional: true,
      ...CardsValidation.validateArray,
    },
    foreignWords: {
      optional: true,
      ...CardsValidation.validateArray,
    },
  };

  static deleteCard: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
  };
}
