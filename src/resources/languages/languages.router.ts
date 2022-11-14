import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { LanguagesController } from './languages.controller';
import { LanguagesValidation } from './languages.validation';

const router = Router();

router.get('/', checkSchema(LanguagesValidation.getLanguagesSchema), validatePayload, LanguagesController.getLanguages);
router.get(
  '/',
  checkSchema(LanguagesValidation.getOneLanguageSchema),
  validatePayload,
  LanguagesController.getOneLanguage,
);
router.post(
  '/',
  checkSchema(LanguagesValidation.createLanguageSchema),
  validatePayload,
  LanguagesController.createLanguage,
);
router.patch(
  '/:languageId',
  checkSchema(LanguagesValidation.updateLanguageSchema),
  validatePayload,
  LanguagesController.updateLanguage,
);
router.delete(
  '/:languageId',
  checkSchema(LanguagesValidation.deleteLanguageSchema),
  validatePayload,
  LanguagesController.deleteLanguage,
);

export function mountLanguagesRouter(app: Application): void {
  app.use('/languages', router);
}
