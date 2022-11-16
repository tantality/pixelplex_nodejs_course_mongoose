import { Schema } from 'express-validator';
import { checkArrayForDuplicates, validateAndSanitizeString, validateBaseQuery, validateId } from '../../validations';

export class TasksValidation {
  private static isInvalidDate = (date: Date): boolean => new Date().getTime() >= date.getTime();

  static getTasksSchema: Schema = {
    ...validateBaseQuery,
    languageId: {
      in: ['query'],
      optional: true,
      ...validateId,
    },
    taskStatus: {
      in: ['query'],
      isString: {
        bail: true,
      },
      trim: true,
      toLowerCase: true,
      isIn: {
        options: ['unanswered', 'correct', 'incorrect'],
      },
    },
    sortBy: {
      isIn: {
        options: ['date'],
      },
    },
  };

  static getStatisticsSchema: Schema = {
    fromDate: {
      in: ['query'],
      optional: true,
      ...validateAndSanitizeString,
      isLength: {
        options: {
          min: 0,
        },
      },
      isISO8601: {
        bail: true,
      },
      toDate: true,
      custom: {
        options: (fromDate) => {
          if (!TasksValidation.isInvalidDate(fromDate)) {
            throw new Error();
          }
          return fromDate;
        },
      },
    },
    toDate: {
      in: ['query'],
      optional: true,
      ...validateAndSanitizeString,
      isLength: {
        options: {
          min: 0,
        },
      },
      isISO8601: {
        bail: true,
      },
      toDate: true,
      custom: {
        options: (toDate: Date, { req }) => {
          const fromDate = req.query?.fromDate;
          const tryParseFromDate = Date.parse(fromDate);
          if ((tryParseFromDate && fromDate >= toDate) || !TasksValidation.isInvalidDate(toDate)) {
            throw new Error();
          }
          return toDate;
        },
      },
    },
    languageIds: {
      in: ['query'],
      optional: true,
      isArray: true,
      custom: {
        options: checkArrayForDuplicates,
      },
    },
    'languageIds.*': {
      in: ['query'],
      ...validateId,
    },
  };

  static createTaskSchema: Schema = {
    foreignLanguageId: {
      in: ['body'],
      ...validateId,
    },
    type: {
      in: ['body'],
      isString: {
        bail: true,
      },
      trim: true,
      toLowerCase: true,
      isIn: {
        options: ['to_native', 'to_foreign'],
      },
    },
  };

  static addAnswerToTaskSchema: Schema = {
    taskId: {
      in: ['params'],
      ...validateId,
    },
  };
}
