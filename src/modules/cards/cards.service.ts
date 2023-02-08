import { FilterQuery, ObjectId } from 'mongoose';
import { NotFoundError, CARD_NOT_FOUND_MESSAGE } from '../../errors';
import { checkLanguagesValidity } from '../../utils';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { CardsRepository } from './cards.repository';
import { ICard, CreateCardBody, UpdateCardBody, GetCardsQuery } from './types';

export class CardsService {
  static findAndCountAll = async (userId: ObjectId, query: GetCardsQuery): Promise<{ count: number; cards: ICard[] }> => {
    const cardsAndTheirNumber = await CardsRepository.findAndCountAll(userId, query);
    return cardsAndTheirNumber;
  };

  static findOneByCondition = async (condition: FilterQuery<ICard>): Promise<ICard | null> => {
    const card = await CardsRepository.findOneByCondition(condition);
    return card;
  };

  static create = async (userId: ObjectId, body: CreateCardBody): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOne({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, body.foreignLanguageId);

    const createdCard = await CardsRepository.create(userId, nativeLanguageId as ObjectId, body);

    return new CardDTO(createdCard);
  };

  static update = async (userId: ObjectId, cardId: ObjectId, body: UpdateCardBody): Promise<CardDTO> => {
    const cardToUpdate = await CardsService.findOneByCondition({ userId, _id: cardId });
    if (!cardToUpdate) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    const { nativeLanguageId } = (await UsersService.findOne({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, body.foreignLanguageId);

    const updatedCard = await CardsRepository.update(cardId, body);

    return new CardDTO(updatedCard);
  };

  static delete = async (userId: ObjectId, cardId: ObjectId): Promise<void> => {
    const cardToDelete = await CardsService.findOneByCondition({ userId, _id: cardId });
    if (!cardToDelete) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    await CardsRepository.delete(cardId);
  };
}
