import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { CardsController } from './cards.controller';
import { CardsValidation } from './cards.validation';

const router = Router();

router.get('/', checkSchema(CardsValidation.getCardsSchema), validatePayload, CardsController.getCards);
router.post('/', checkSchema(CardsValidation.createCardSchema), validatePayload, CardsController.createCard);
router.patch('/:cardId', checkSchema(CardsValidation.updateCardSchema), validatePayload, CardsController.updateCard);
router.delete('/:cardId', checkSchema(CardsValidation.deleteCardSchema), validatePayload, CardsController.deleteCard);

export function mountCardsRouter(app: Application): void {
  app.use('/cards', router);
}
