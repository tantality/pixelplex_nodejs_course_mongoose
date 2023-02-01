import { Aggregate, FilterQuery, ObjectId, ProjectionType } from 'mongoose';
import { Language } from './language.model';
import { CreateLanguageBody, GetLanguagesQuery, ILanguage, UpdateLanguageBody } from './types';
import { createSortingCondition } from './utils';

export class LanguagesRepository {
  static DTO_FIELD_SELECTION_CONFIG: ProjectionType<ILanguage> = { _id: 0, id: '$_id', code: 1, name: 1, createdAt: 1 };

  static findAndCountAll = async (query: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    const { search, sortBy, sortDirection, limit, offset } = query;

    const findCondition = LanguagesRepository.createConditionToFindLanguages(search);

    const languagesCountPromise = LanguagesRepository.countAll(findCondition);
    const languagesAggregate: Aggregate<ILanguage[]> = Language.aggregate([
      { $match: findCondition },
      { $addFields: { nameInLowercase: { $toLower: '$name' } } },
      { $project: { ...(LanguagesRepository.DTO_FIELD_SELECTION_CONFIG as Record<string, unknown>), nameInLowercase: 1 } },
      { $sort: createSortingCondition(sortBy, sortDirection) },
      { $unset: ['nameInLowercase'] },
      { $skip: offset },
      { $limit: limit },
    ]);

    const [count, languages] = await Promise.all([languagesCountPromise, languagesAggregate]);

    return { count, languages };
  };

  private static createConditionToFindLanguages = (search?: string): FilterQuery<ILanguage> => {
    const searchByNameCondition = LanguagesRepository.createSearchByNameCondition(search);

    const condition: FilterQuery<ILanguage> = {
      ...searchByNameCondition,
    };

    return condition;
  };

  private static createSearchByNameCondition = (search?: string): FilterQuery<ILanguage> => {
    const searchCondition = search ? { $regex: new RegExp(search, 'i') } : null;
    const searchByNameCondition = searchCondition ? { name: searchCondition } : {};

    return searchByNameCondition;
  };

  static countAll = async (condition: FilterQuery<ILanguage>): Promise<number> => {
    const count = await Language.where(condition).countDocuments();
    return count;
  };

  static findOne = async (condition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await Language.findOne(condition);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<ILanguage> => {
    const createdLanguage = await Language.create(body);
    return createdLanguage;
  };

  static update = async (_id: ObjectId, body: UpdateLanguageBody): Promise<ILanguage> => {
    await Language.updateOne({ _id }, { ...body });

    const updatedLanguage = (await LanguagesRepository.findOne({ _id })) as ILanguage;

    return updatedLanguage;
  };

  static delete = async (_id: ObjectId): Promise<void> => {
    await Language.deleteOne({ _id });
  };
}
