/* eslint-disable require-await */
import { FilterQuery, ObjectId } from 'mongoose';
import { NotFoundError, CARD_NOT_FOUND_MESSAGE } from '../../errors';
import { checkLanguagesValidity, logRequest } from '../../utils';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { CardsRepository } from './cards.repository';
import { GetCardsRequest, DeleteCardRequest, ICard, CreateCardBody, UpdateCardBody } from './types';

const card: ICard = {
  _id: '639f76' as unknown as ObjectId,
  userId: '639f76' as unknown as ObjectId,
  nativeLanguageId: '639f76' as unknown as ObjectId,
  nativeWords: ['привет'],
  foreignLanguageId: '639f76' as unknown as ObjectId,
  foreignWords: ['hello'],
  createdAt: new Date(),
  updatedAt: new Date(),
};
const cardDTO = new CardDTO(card);

export class CardsService {
  static findAll = async (req: GetCardsRequest): Promise<{ count: number; cards: CardDTO[] }> => {
    logRequest(req);
    return {
      count: 30,
      cards: [cardDTO],
    };
  };

  static findOneByCondition = async (condition: FilterQuery<ICard>): Promise<ICard | null> => {
    const card = await CardsRepository.findOneByCondition(condition);
    return card;
  };

  static create = async (userId: ObjectId, body: CreateCardBody): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, body.foreignLanguageId);

    const createdCard = await CardsRepository.create(userId, nativeLanguageId as ObjectId, body);

    return new CardDTO(createdCard);
  };

  static update = async (userId: ObjectId, cardId: ObjectId, body: UpdateCardBody): Promise<CardDTO> => {
    const cardToUpdate = await CardsService.findOneByCondition({ userId, _id: cardId });
    if (!cardToUpdate) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    const { nativeLanguageId } = (await UsersService.findOneByCondition({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, body.foreignLanguageId);

    const updatedCard = await CardsRepository.update(cardId, body);

    return new CardDTO(updatedCard);
  };

  static delete = async (req: DeleteCardRequest): Promise<void> => {
    logRequest(req);
  };
}
