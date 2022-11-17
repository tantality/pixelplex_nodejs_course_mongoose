import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { CardsController } from './cards.controller';
import { CardsValidation } from './cards.validation';

const router = Router();

router.get('/', checkSchema(CardsValidation.getCards), validatePayload, CardsController.getCards);
router.post('/', checkSchema(CardsValidation.createCard), validatePayload, CardsController.createCard);
router.patch('/:cardId', checkSchema(CardsValidation.updateCard), validatePayload, CardsController.updateCard);
router.delete('/:cardId', checkSchema(CardsValidation.deleteCard), validatePayload, CardsController.deleteCard);

export function mountCardsRouter(app: Application): void {
  app.use('/cards', router);
}
