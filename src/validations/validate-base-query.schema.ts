import { Schema } from 'express-validator';
import { validateAndSanitizeString } from '.';

export const validateBaseQuery: Schema = {
  search: {
    in: ['query'],
    ...validateAndSanitizeString,
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
