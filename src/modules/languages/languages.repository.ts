import { FilterQuery, ObjectId, QueryOptions } from 'mongoose';
import { Language } from '../../models/language.model';
import { SORT_DIRECTION } from '../../types';
import { CreateLanguageBody, ILanguage, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static findAndCountAll = async (
    filter: FilterQuery<ILanguage>,
    options: QueryOptions<ILanguage>,
    sortingCondition: { [key: string]: SORT_DIRECTION },
  ): Promise<{ count: number; languages: ILanguage[] }> => {
    const languages = await Language.find(filter, null, options).sort(sortingCondition);
    const count = await LanguagesRepository.countAll(filter);

    return { count, languages };
  };

  static countAll = async (condition: FilterQuery<ILanguage>): Promise<number> => {
    const count = await Language.where(condition).countDocuments();
    return count;
  };

  static findOneByCondition = async (whereCondition: Partial<ILanguage>): Promise<ILanguage | null> => {
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
