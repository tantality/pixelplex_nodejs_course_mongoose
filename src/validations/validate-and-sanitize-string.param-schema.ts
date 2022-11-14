import { ParamSchema } from 'express-validator';

const replaceExtraSpaces = (value: string): string => value.replace(/\s+/g, ' ');
export const validateAndSanitizeString: ParamSchema = {
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
    options: replaceExtraSpaces,
  },
};
