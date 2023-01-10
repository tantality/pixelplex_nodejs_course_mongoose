import { FilterQuery, ObjectId } from 'mongoose';
import { Card } from '../../models/card.model';
import { CreateCardBody, ICard, UpdateCardBody } from './types';

export class CardsRepository {
  static findOneByCondition = async (condition: FilterQuery<ICard>): Promise<ICard | null> => {
    const card = await Card.findOne(condition);
    return card;
  };

  static create = async (userId: ObjectId, nativeLanguageId: ObjectId, body: CreateCardBody): Promise<ICard> => {
    const createdLanguage = await Card.create({ userId, nativeLanguageId, ...body });
    return createdLanguage;
  };

  static update = async (_id: ObjectId, body: UpdateCardBody): Promise<ICard> => {
    await Card.updateOne({ _id }, body);

    const updatedLanguage = (await CardsRepository.findOneByCondition({ _id })) as ICard;

    return updatedLanguage;
  };
}
