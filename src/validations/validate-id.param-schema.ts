import { ParamSchema } from 'express-validator';

export const validateId: ParamSchema = {
  trim: true,
  isMongoId: {
    bail: true,
  },
};
