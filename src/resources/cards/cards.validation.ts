import { ParamSchema, Schema } from 'express-validator';
import { SORT_BY } from '../../constants/common.constants';
import {
  validateAndSanitizeString,
  validateId,
  validateBaseQuery,
  checkArrayForDuplicates,
  checkStringIn,
  validateStringLength,
} from '../../validations';

export class CardsValidation {
  private static isArrayOfStrings = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'string');
  private static validateWords = (arr: any): any => {
    if (Array.isArray(arr) && CardsValidation.isArrayOfStrings(arr)) {
      checkArrayForDuplicates(arr);
    }
    return arr;
  };

  private static validateArrayParamSchema: ParamSchema = {
    in: ['body'],
    isArray: {
      errorMessage: 'Value must be an array with the number of elements from 1 to 3',
      options: {
        min: 1,
        max: 3,
      },
    },
  };

  static getCardsSchema: Schema = {
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

  static createCardSchema: Schema = {
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
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (value: any) => CardsValidation.validateWords(value),
      },
    },
    foreignWords: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (value: any) => CardsValidation.validateWords(value),
      },
    },
    foreignLanguageId: {
      in: ['body'],
      ...validateId,
    },
  };

  static updateCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
    foreignLanguageId: {
      in: ['body'],
      optional: true,
      ...validateId,
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
      ...CardsValidation.validateArrayParamSchema,
      optional: true,
      custom: {
        options: (value: any) => CardsValidation.validateWords(value),
      },
    },
    foreignWords: {
      ...CardsValidation.validateArrayParamSchema,
      optional: true,
      custom: {
        options: (value: any) => CardsValidation.validateWords(value),
      },
    },
  };

  static deleteCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...validateId,
    },
  };
}
