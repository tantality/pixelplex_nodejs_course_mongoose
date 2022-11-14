import { ParamSchema, Schema } from 'express-validator';

export class LanguagesValidation {
  private static replaceExtraSpaces = (value: string): string => value.replace(/\s+/g, ' ');
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
      options: LanguagesValidation.replaceExtraSpaces,
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

  static getLanguagesSchema: Schema = {
    search: {
      in: ['query'],
      ...LanguagesValidation.validateAndSanitizeStringParamSchema,
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

  static getOneLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...LanguagesValidation.validateIdParamSchema,
    },
  };

  static createLanguageSchema: Schema = {
    code: {
      in: ['body'],
      ...LanguagesValidation.validateAndSanitizeStringParamSchema,
      isLength: {
        errorMessage: 'Value must be in the range from 2 to 4 characters',
        options: {
          min: 2,
          max: 4,
        },
      },
    },
    name: {
      in: ['body'],
      ...LanguagesValidation.validateAndSanitizeStringParamSchema,
      isLength: {
        errorMessage: 'Value must be in the range from 2 to 50 characters',
        options: {
          min: 2,
          max: 50,
        },
      },
    },
  };

  static updateLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...LanguagesValidation.validateIdParamSchema,
    },
    code: {
      in: ['body'],
      ...LanguagesValidation.validateAndSanitizeStringParamSchema,
      isLength: {
        errorMessage: 'Value must be in the range from 2 to 4 characters',
        options: {
          min: 2,
          max: 4,
        },
      },
    },
    name: {
      in: ['body'],
      ...LanguagesValidation.validateAndSanitizeStringParamSchema,
      isLength: {
        errorMessage: 'Value must be in the range from 2 to 50 characters',
        options: {
          min: 2,
          max: 50,
        },
      },
    },
  };

  static deleteLanguageSchema: Schema = {
    languageId: {
      in: ['params'],
      ...LanguagesValidation.validateIdParamSchema,
    },
  };
}
