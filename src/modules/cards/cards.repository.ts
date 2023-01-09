import { ObjectId } from 'mongoose';
import { Card } from '../../models/card.model';
import { CreateCardBody, ICard } from './types';

export class CardsRepository {
  static create = async (userId: ObjectId, nativeLanguageId: ObjectId, body: CreateCardBody): Promise<ICard> => {
    const createdLanguage = await Card.create({ userId, nativeLanguageId, ...body });
    return createdLanguage;
  };
}
