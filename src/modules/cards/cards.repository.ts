import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { SortingCondition, SORT_DIRECTION } from '../../types';
import { Card } from './card.model';
import { CARD_SORT_BY, CreateCardDTO, GetCardsQuery, ICard, UpdateCardDTO } from './types';
import { transformCards } from './utils';

export class CardsRepository {
  static findAndCountAll = async (
    cardSelectionParameters: GetCardsQuery & { userId: ObjectId },
  ): Promise<{ count: number; cards: ICard[] }> => {
    const { search, sortBy, sortDirection, limit, offset, languageId, userId } = cardSelectionParameters;

    const findingCondition = CardsRepository.createFindingConditionForCards({ userId, languageId, search });
    const fieldSelectionConfig: ProjectionType<ICard> = { userId: 0, updatedAt: 0 };
    const sortingCondition = CardsRepository.createSortingConditionForCards(sortBy, sortDirection);
    const options: QueryOptions<ICard> = {
      skip: offset,
      limit,
      sort: sortingCondition,
    };

    const cardsQuery = Card.find(findingCondition, fieldSelectionConfig, options).transform((cards) => {
      return transformCards(cards, sortDirection, sortBy);
    });
    const cardsNumberPromise = CardsRepository.countAll(findingCondition);

    const [count, cards] = await Promise.all([cardsNumberPromise, cardsQuery]);

    return { count, cards };
  };

  private static createFindingConditionForCards = (
    conditionParameters: Pick<GetCardsQuery, 'languageId' | 'search'> & { userId: ObjectId },
  ): FilterQuery<ICard> => {
    const { search, languageId, userId } = conditionParameters;

    const searchInWordsCondition = CardsRepository.createSearchInWordsCondition(search);
    const languagesCondition = CardsRepository.createLanguagesCondition(languageId);

    const condition: FilterQuery<ICard> = {
      userId,
      $and: [searchInWordsCondition, languagesCondition],
    };

    return condition;
  };

  private static createSearchInWordsCondition = (search?: string): FilterQuery<ICard> => {
    const searchCondition = search ? { $regex: new RegExp(search, 'i') } : null;
    const searchInWordsCondition = searchCondition ? { $or: [{ nativeWords: searchCondition }, { foreignWords: searchCondition }] } : {};

    return searchInWordsCondition;
  };

  private static createLanguagesCondition = (languageId?: ObjectId): FilterQuery<ICard> => {
    const languagesCondition = languageId ? { $or: [{ nativeLanguageId: languageId }, { foreignLanguageId: languageId }] } : {};
    return languagesCondition;
  };

  private static createSortingConditionForCards = (
    sortBy: string,
    sortDir: string,
  ): SortingCondition<Omit<ICard, 'nativeWords' | 'foreignWOrds'>> => {
    let sortingCondition: SortingCondition<Omit<ICard, 'nativeWords' | 'foreignWOrds'>> = {};
    const sortDirection: SORT_DIRECTION = sortDir as SORT_DIRECTION;

    switch (sortBy) {
    case CARD_SORT_BY.DATE: {
      sortingCondition = { createdAt: sortDirection };
      break;
    }
    }

    return sortingCondition;
  };

  static countAll = async (condition: FilterQuery<ICard>): Promise<number> => {
    const count = await Card.where(condition).countDocuments();
    return count;
  };

  static create = async (cardData: CreateCardDTO): Promise<ICard> => {
    const createdLanguage = await Card.create(cardData);
    return createdLanguage;
  };

  static update = async (id: ObjectId, cardData: UpdateCardDTO): Promise<ICard> => {
    await Card.updateOne({ _id: id }, cardData);

    const updatedLanguage = (await CardsRepository.findOne({ _id: id })) as ICard;

    return updatedLanguage;
  };

  static findOne = async (condition: FilterQuery<ICard>): Promise<ICard | null> => {
    const card = await Card.findOne(condition);
    return card;
  };

  static delete = async (id: ObjectId): Promise<void> => {
    await Card.deleteOne({ _id: id });
  };
}
