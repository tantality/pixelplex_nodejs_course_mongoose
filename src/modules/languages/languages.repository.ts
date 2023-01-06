import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
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
    const filter = LanguagesRepository.getFilter(search);

    const options: QueryOptions<ILanguage> = {
      skip: offset,
      limit,
    };

    const sortingCondition = getSortingCondition(sortBy, sortDirection);
    const fieldsToSelect: ProjectionType<ILanguage> = { _id: 1, code: 1, name: 1, createdAt: 1 };

    const languagesQuery = Language.find(filter, fieldsToSelect, options).sort(sortingCondition);
    const languagesNumberPromise = LanguagesRepository.countAll(filter);

    const [count, languages] = await Promise.all([languagesNumberPromise, languagesQuery]);

    return { count, languages };
  };

  private static getFilter(search?: string): FilterQuery<ILanguage> {
    let filter: FilterQuery<ILanguage> = {};

    if (search) {
      filter = {
        name: { $regex: new RegExp(search, 'i') },
      };
    }

    return filter;
  }

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
