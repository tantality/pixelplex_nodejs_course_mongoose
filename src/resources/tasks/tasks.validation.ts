import { Schema } from 'express-validator';
import { SORT_BY } from '../../constants/common.constants';
import {
  checkArrayForDuplicates,
  checkStringIn,
  validateAndSanitizeString,
  validateBaseQuery,
  validateId,
} from '../../validations';
import { TASK_STATUS, TASK_TYPE } from './tasks.constants';

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
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(TASK_STATUS)),
      },
    },
    sortBy: {
      in: ['query'],
      default: {
        options: SORT_BY.DATE,
      },
      trim: true,
      toLowerCase: true,
      custom: {
        options: (value: string) => checkStringIn(value, [SORT_BY.DATE]),
      },
    },
  };

  static getStatisticsSchema: Schema = {
    fromDate: {
      in: ['query'],
      optional: true,
      ...validateAndSanitizeString,
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
      ...validateAndSanitizeString,
      custom: {
        options: (value: string) => checkStringIn(value, Object.values(TASK_TYPE)),
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
