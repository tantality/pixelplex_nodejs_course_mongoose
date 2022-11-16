import { ParamSchema } from 'express-validator';

export const validateStringLength: ParamSchema = {
  isLength: {
    errorMessage: 'Value must be in the range from 1 to 254 characters',
    options: {
      min: 1,
      max: 254,
    },
    bail: true,
  },
};
