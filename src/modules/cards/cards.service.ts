import { FilterQuery, ObjectId } from 'mongoose';
import { NotFoundError, CARD_NOT_FOUND_MESSAGE } from '../../errors';
import { checkLanguagesValidity } from '../../utils';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { CardsRepository } from './cards.repository';
import { ICard, GetCardsQuery, CardDTO, CreateCardDTO, UpdateCardDTO } from './types';

export class CardsService {
  static findAndCountAll = async (
    cardSelectionParameters: GetCardsQuery & { userId: ObjectId },
  ): Promise<{ count: number; cards: ICard[] }> => {
    const cardsAndTheirCount = await CardsRepository.findAndCountAll(cardSelectionParameters);
    return cardsAndTheirCount;
  };

  static create = async (cardData: Omit<CreateCardDTO, 'nativeLanguageId'>): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOne({ _id: cardData.userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, cardData.foreignLanguageId);

    const createdCard = await CardsRepository.create({ ...cardData, nativeLanguageId: nativeLanguageId as ObjectId });

    return new CardDTO(createdCard);
  };

  static update = async (userId: ObjectId, cardId: ObjectId, cardData: UpdateCardDTO): Promise<CardDTO> => {
    const cardToUpdate = await CardsService.findOne({ userId, _id: cardId });
    if (!cardToUpdate) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    const { nativeLanguageId } = (await UsersService.findOne({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, cardData.foreignLanguageId);

    const updatedCard = await CardsRepository.update(cardId, cardData);

    return new CardDTO(updatedCard);
  };

  static delete = async (userId: ObjectId, cardId: ObjectId): Promise<void> => {
    const cardToDelete = await CardsService.findOne({ userId, _id: cardId });
    if (!cardToDelete) {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    }

    await CardsRepository.delete(cardId);
  };

  static findOne = async (condition: FilterQuery<ICard>): Promise<ICard | null> => {
    const card = await CardsRepository.findOne(condition);
    return card;
  };
}
