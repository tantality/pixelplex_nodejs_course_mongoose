/* eslint-disable require-await */
import { ObjectId } from 'mongoose';
import { checkLanguagesValidity, logRequest } from '../../utils';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { CardDTO } from './card.dto';
import { CardsRepository } from './cards.repository';
import { GetCardsRequest, UpdateCardRequest, DeleteCardRequest, ICard, CreateCardBody } from './types';

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

  static create = async (userId: ObjectId, body: CreateCardBody): Promise<CardDTO> => {
    const { nativeLanguageId } = (await UsersService.findOneByCondition({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, body.foreignLanguageId);

    const createdCard = await CardsRepository.create(userId, nativeLanguageId as ObjectId, body);

    return new CardDTO(createdCard);
  };

  static update = async (req: UpdateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return cardDTO;
  };

  static delete = async (req: DeleteCardRequest): Promise<void> => {
    logRequest(req);
  };
}
