/* eslint-disable require-await */
import { ObjectId } from 'mongoose';
import { logRequest } from '../../utils';
import { CardDTO } from './card.dto';
import { GetCardsRequest, CreateCardRequest, UpdateCardRequest, DeleteCardRequest, ICard } from './types';

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

  static create = async (req: CreateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return cardDTO;
  };

  static update = async (req: UpdateCardRequest): Promise<CardDTO> => {
    logRequest(req);
    return cardDTO;
  };

  static delete = async (req: DeleteCardRequest): Promise<void> => {
    logRequest(req);
  };
}
