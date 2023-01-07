import { Aggregate, FilterQuery, ObjectId, ProjectionType } from 'mongoose';
import { Language } from '../../models/language.model';
import { CreateLanguageBody, GetLanguagesQuery, ILanguage, UpdateLanguageBody } from './types';
import { getSortingCondition } from './utils';

export class LanguagesRepository {
  static findAndCountAll = async ({
    search,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    const filter = LanguagesRepository.getFilterToFindLanguages(search);
    const projectionFields: ProjectionType<ILanguage> = { _id: 0, id: '$_id', code: 1, name: 1, createdAt: 1, nameInLowercase: 1 };

    const languagesNumberPromise = LanguagesRepository.countAll(filter);
    const languagesAggregate: Aggregate<ILanguage[]> = Language.aggregate([
      { $match: filter },
      { $addFields: { nameInLowercase: { $toLower: '$name' } } },
      { $project: projectionFields },
      { $sort: getSortingCondition(sortBy, sortDirection) },
      { $unset: ['nameInLowercase'] },
      { $skip: offset },
      { $limit: limit },
    ]);

    const [count, languages] = await Promise.all([languagesNumberPromise, languagesAggregate]);

    return { count, languages };
  };

  private static getFilterToFindLanguages = (search?: string): FilterQuery<ILanguage> => {
    let filter: FilterQuery<ILanguage> = {};

    if (search) {
      filter = {
        name: { $regex: new RegExp(search, 'i') },
      };
    }

    return filter;
  };

  static countAll = async (condition: FilterQuery<ILanguage>): Promise<number> => {
    const count = await Language.where(condition).countDocuments();
    return count;
  };

  static findOneByCondition = async (whereCondition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await Language.findOne(whereCondition);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<ILanguage> => {
    const createdLanguage = await Language.create(body);
    return createdLanguage;
  };

  static update = async (_id: ObjectId, body: UpdateLanguageBody): Promise<ILanguage> => {
    await Language.updateOne({ _id }, { ...body });

    const updatedLanguage = (await LanguagesRepository.findOneByCondition({ _id })) as ILanguage;

    return updatedLanguage;
  };

  static delete = async (_id: ObjectId): Promise<void> => {
    await Language.deleteOne({ _id });
  };
}
