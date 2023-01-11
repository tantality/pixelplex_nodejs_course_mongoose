import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { Card } from '../../models/card.model';
import { CreateCardBody, GetCardsQuery, ICard, UpdateCardBody } from './types';
import { getSortingCondition, transformCards } from './utils';

export class CardsRepository {
  static findAndCountAll = async (
    userId: ObjectId,
    { search, sortBy, sortDirection, limit, offset, languageId }: GetCardsQuery,
  ): Promise<{ count: number; cards: ICard[] }> => {
    const filter = CardsRepository.getFilterToFindCards(userId, languageId, search);
    const projectionFields: ProjectionType<ICard> = { userId: 0, updatedAt: 0 };
    const options: QueryOptions<ICard> = {
      skip: offset,
      limit,
      sort: getSortingCondition(sortBy, sortDirection),
    };

    const cardsQuery = Card.find(filter, projectionFields, options).transform((cards) => {
      return transformCards(cards, sortDirection);
    });
    const cardsNumberPromise = CardsRepository.countAll(filter);

    const [count, cards] = await Promise.all([cardsNumberPromise, cardsQuery]);

    return { count, cards };
  };

  private static getFilterToFindCards = (userId: ObjectId, languageId?: ObjectId, search?: string): FilterQuery<ICard> => {
    const searchInWordsCondition = CardsRepository.getSearchInWordsCondition(search);
    const languagesCondition = CardsRepository.getLanguagesCondition(languageId);

    const filter: FilterQuery<ICard> = {
      userId,
      $and: [searchInWordsCondition, languagesCondition],
    };

    return filter;
  };

  private static getSearchInWordsCondition = (search?: string): FilterQuery<ICard> => {
    const searchCondition = search ? { $regex: new RegExp(search, 'i') } : null;
    const searchInWordsCondition = searchCondition ? { $or: [{ nativeWords: searchCondition }, { foreignWords: searchCondition }] } : {};

    return searchInWordsCondition;
  };

  private static getLanguagesCondition = (languageId?: ObjectId): FilterQuery<ICard> => {
    const languageIdCondition = languageId ? languageId : null;
    const languagesCondition = languageIdCondition
      ? { $or: [{ nativeLanguageId: languageIdCondition }, { foreignLanguageId: languageIdCondition }] }
      : {};

    return languagesCondition;
  };

  static countAll = async (condition: FilterQuery<ICard>): Promise<number> => {
    const count = await Card.where(condition).countDocuments();
    return count;
  };

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

  static delete = async (_id: ObjectId): Promise<void> => {
    await Card.deleteOne({ _id });
  };
}
