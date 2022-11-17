import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { LanguagesController } from './languages.controller';
import { LanguagesValidation } from './languages.validation';

const router = Router();

router.get('/', checkSchema(LanguagesValidation.getLanguages), validatePayload, LanguagesController.getLanguages);
router.get(
  '/:languageId',
  checkSchema(LanguagesValidation.getOneLanguage),
  validatePayload,
  LanguagesController.getOneLanguage,
);
router.post('/', checkSchema(LanguagesValidation.createLanguage), validatePayload, LanguagesController.createLanguage);
router.patch(
  '/:languageId',
  checkSchema(LanguagesValidation.updateLanguage),
  validatePayload,
  LanguagesController.updateLanguage,
);
router.delete(
  '/:languageId',
  checkSchema(LanguagesValidation.deleteLanguage),
  validatePayload,
  LanguagesController.deleteLanguage,
);

export function mountLanguagesRouter(app: Application): void {
  app.use('/api/v1/languages', router);
}
