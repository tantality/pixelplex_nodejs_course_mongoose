import { ParamSchema } from 'express-validator';
import { validateStringLength } from '../validations/validate-string-length.param-schema';

export const DEFAULT_STRING_LENGTH_VALIDATION: ParamSchema = validateStringLength();
