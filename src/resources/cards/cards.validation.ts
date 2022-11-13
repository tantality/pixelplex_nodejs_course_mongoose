import { ParamSchema, Schema } from 'express-validator';

interface IMeaning {
  id: number | string;
  value: string;
}

export class CardsValidation {
  private static replaceExtraSpaces = (value: string): string => value.replace(/\s+/g, ' ');

  private static checkArrayForDuplicates = <T>(arr: Array<T>): Array<T> => {
    const set = new Set<T>(arr);
    const isArrayContainDuplicates = set.size !== arr.length;
    if (isArrayContainDuplicates) {
      throw new Error('Array must contain unique elements');
    }
    return arr;
  };

  private static isArrayOfStrings = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'string');
  private static isArrayOfNumbers = (arr: Array<any>): boolean => arr.every((elem: any) => typeof elem === 'number');

  private static getIdsFromArrayOfMeanings = (arr: Array<IMeaning>): Array<number | null> => {
    return arr.map((elem: IMeaning) => {
      const id = elem.id;
      const numericId = Number(id);
      if (typeof id === 'string' && numericId) {
        return numericId;
      }
      if (typeof id === 'number') {
        return id;
      }

      return null;
    });
  };

  private static getValuesFromArrayOfMeanings = (arr: Array<IMeaning>): Array<string | null> => {
    return arr.map((elem: IMeaning) => {
      const value = elem.value;
      if (typeof value === 'string') {
        return value;
      } else {
        return null;
      }
    });
  };

  private static validateMeanings = (arr: Array<IMeaning>): Array<IMeaning> => {
    const ids = CardsValidation.getIdsFromArrayOfMeanings(arr);
    const values = CardsValidation.getValuesFromArrayOfMeanings(arr);

    if (CardsValidation.isArrayOfNumbers(ids)) {
      CardsValidation.checkArrayForDuplicates(ids);
    }

    if (CardsValidation.isArrayOfStrings(values)) {
      CardsValidation.checkArrayForDuplicates(values);
    }

    return arr;
  };

  private static validateArrayParamSchema: ParamSchema = {
    in: ['body'],
    isArray: {
      errorMessage: 'Array must contain the number of elements in the range from 1 to 3',
      options: {
        min: 1,
        max: 3,
      },
    },
    toArray: true,
  };

  private static validateAndSanitizeStringParamSchema: ParamSchema = {
    isString: {
      bail: true,
    },
    trim: true,
    isLength: {
      errorMessage: 'Value must be in the range from 1 to 254 characters',
      options: {
        min: 1,
        max: 254,
      },
      bail: true,
    },
    toLowerCase: true,
    customSanitizer: {
      options: CardsValidation.replaceExtraSpaces,
    },
  };

  private static validateIdParamSchema: ParamSchema = {
    trim: true,
    isInt: {
      errorMessage: 'Value must be a number greater than 0',
      options: {
        min: 1,
      },
      bail: true,
    },
    toInt: true,
  };

  static getCardsSchema: Schema = {
    search: {
      in: ['query'],
      ...CardsValidation.validateAndSanitizeStringParamSchema,
    },
    offset: {
      in: ['query'],
      trim: true,
      isInt: {
        errorMessage: 'Value must be a number greater than 0',
        options: {
          min: 1,
        },
        bail: true,
      },
      toInt: true,
    },
    limit: {
      in: ['query'],
      default: {
        options: 20,
      },
      trim: true,
      isInt: {
        errorMessage: 'Value must be a number in the range from 1 to 100',
        options: {
          min: 1,
          max: 100,
        },
        bail: true,
      },
      toInt: true,
    },
    languageId: {
      in: ['query'],
      optional: true,
      ...CardsValidation.validateIdParamSchema,
    },
    sortBy: {
      in: ['query'],
      default: {
        options: 'date',
      },
      trim: true,
      toLowerCase: true,
      isIn: {
        options: ['date', 'word'],
      },
    },
    sortDirection: {
      in: ['query'],
      default: {
        options: 'asc',
      },
      trim: true,
      toLowerCase: true,
      isIn: {
        options: ['asc', 'desc'],
      },
    },
  };

  static createCardSchema: Schema = {
    'nativeMeanings.*': {
      in: ['body'],
      ...CardsValidation.validateAndSanitizeStringParamSchema,
    },
    'foreignMeanings.*': {
      in: ['body'],
      ...CardsValidation.validateAndSanitizeStringParamSchema,
    },
    nativeMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (arr: Array<IMeaning>) => {
          if (CardsValidation.isArrayOfStrings(arr)) {
            CardsValidation.checkArrayForDuplicates(arr);
          }
          return arr;
        },
      },
    },
    foreignMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: (arr: Array<IMeaning>) => {
          if (CardsValidation.isArrayOfStrings(arr)) {
            return CardsValidation.checkArrayForDuplicates(arr);
          }
          return arr;
        },
      },
    },
    foreignLanguageId: {
      in: ['body'],
      ...CardsValidation.validateIdParamSchema,
    },
  };

  static updateCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...CardsValidation.validateIdParamSchema,
    },
    foreignLanguageId: {
      in: ['body'],
      ...CardsValidation.validateIdParamSchema,
    },
    'nativeMeanings.*.id': {
      in: ['body'],
      ...CardsValidation.validateIdParamSchema,
    },
    'nativeMeanings.*.value': {
      in: ['body'],
      ...CardsValidation.validateAndSanitizeStringParamSchema,
    },
    nativeMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: CardsValidation.validateMeanings,
      },
    },
    'foreignMeanings.*.id': {
      in: ['body'],
      ...CardsValidation.validateIdParamSchema,
    },
    'foreignMeanings.*.value': {
      in: ['body'],
      ...CardsValidation.validateAndSanitizeStringParamSchema,
    },
    foreignMeanings: {
      ...CardsValidation.validateArrayParamSchema,
      custom: {
        options: CardsValidation.validateMeanings,
      },
    },
  };

  static deleteCardSchema: Schema = {
    cardId: {
      in: ['params'],
      ...CardsValidation.validateIdParamSchema,
    },
  };
}
