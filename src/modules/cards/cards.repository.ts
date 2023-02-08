import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { changeTypeOfObjectFieldsFromObjectIdToTypesObjectId, changeTypeFromObjectIdToTypesObjectId } from '../../utils';
import { FindAnswersTaskData, TASK_TYPE } from '../tasks/types';
import { Card } from './card.model';
import { CARD_WORD_ARRAY, CreateCardBody, GetCardsQuery, ICard, UpdateCardBody } from './types';
import { getRandomInt, getRandomWord, getSortingCondition, transformCards, getCorrectAnswers } from './utils';

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
      return transformCards(cards, sortDirection, sortBy);
    });
    const cardsCountPromise = CardsRepository.countAll(filter);

    const [count, cards] = await Promise.all([cardsCountPromise, cardsQuery]);

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
    const languagesCondition = languageId ? { $or: [{ nativeLanguageId: languageId }, { foreignLanguageId: languageId }] } : {};
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

  static findRandomWord = async (
    userId: ObjectId,
    cardNativeLanguageId: ObjectId,
    cardForeignLanguageId: ObjectId,
    wordLanguageId: ObjectId,
  ): Promise<string | null> => {
    const condition: FilterQuery<ICard> = {
      userId,
      nativeLanguageId: cardNativeLanguageId,
      foreignLanguageId: cardForeignLanguageId,
    };

    const findCondition: FilterQuery<ICard> = changeTypeOfObjectFieldsFromObjectIdToTypesObjectId(condition);

    const cardCount = await CardsRepository.countAll(findCondition);
    if (!cardCount) {
      return null;
    }

    const skipCardsCount = getRandomInt(cardCount);
    const targetWordArrayName = wordLanguageId === cardNativeLanguageId ? '$nativeWords' : '$foreignWords';

    const wordsAndTheirCount = await CardsRepository.findWordsAndTheirCount(findCondition, targetWordArrayName, skipCardsCount);

    return getRandomWord(wordsAndTheirCount);
  };

  static findWordsAndTheirCount = async (
    condition: FilterQuery<ICard>,
    targetWordArrayName: '$nativeWords' | '$foreignWords',
    skipCardsCount: number,
  ): Promise<{ count: number; words: string[] }> => {
    const wordsAndTheirCountQueryResult: { count: number; words: string[] }[] = await Card.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          count: { $size: targetWordArrayName },
          words: targetWordArrayName,
        },
      },
      { $skip: skipCardsCount },
      { $limit: 1 },
    ]);

    const wordsAndTheirCount = wordsAndTheirCountQueryResult[0];

    return wordsAndTheirCount;
  };

  static findCorrectAnswersToTask = async (taskData: FindAnswersTaskData): Promise<string[]> => {
    const findCondition = CardsRepository.getConditionToFindCorrectAnswers(taskData);
    const arrayNameToFindCorrectAnswersIn = CardsRepository.getArrayNameToFindCorrectAnswersIn(taskData.type as TASK_TYPE);

    const correctAnswersQueryResult: { correctAnswers: string[] }[] = await Card.aggregate([
      { $match: findCondition },
      { $unwind: `$${arrayNameToFindCorrectAnswersIn}` },
      {
        $group: {
          _id: null,
          correctAnswers: {
            $addToSet: `$${arrayNameToFindCorrectAnswersIn}`,
          },
        },
      },
      {
        $project: {
          _id: 0,
          correctAnswers: 1,
        },
      },
    ]);

    return getCorrectAnswers(correctAnswersQueryResult);
  };

  private static getConditionToFindCorrectAnswers = (taskData: FindAnswersTaskData): FilterQuery<ICard> => {
    const { userId, type, nativeLanguageId, foreignLanguageId, hiddenWord } = taskData;

    const arrayNameToFindHiddenWordIn = CardsRepository.getArrayNameToFindHiddenWordIn(type as TASK_TYPE);

    const condition: FilterQuery<ICard> = {
      userId: changeTypeFromObjectIdToTypesObjectId(userId),
      nativeLanguageId,
      foreignLanguageId,
      [arrayNameToFindHiddenWordIn]: hiddenWord,
    };

    return condition;
  };

  private static getArrayNameToFindHiddenWordIn = (type: TASK_TYPE): string => {
    return type === TASK_TYPE.TO_NATIVE ? CARD_WORD_ARRAY.FOREIGN_WORDS : CARD_WORD_ARRAY.NATIVE_WORDS;
  };

  private static getArrayNameToFindCorrectAnswersIn = (type: TASK_TYPE): string => {
    return type === TASK_TYPE.TO_NATIVE ? CARD_WORD_ARRAY.NATIVE_WORDS : CARD_WORD_ARRAY.FOREIGN_WORDS;
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
