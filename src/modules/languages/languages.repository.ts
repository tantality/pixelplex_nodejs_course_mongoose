import { FilterQuery, ObjectId, ProjectionType, QueryOptions } from 'mongoose';
import { Language } from '../../models/language.model';
import { SORT_DIRECTION } from '../../types';
import { CreateLanguageBody, ILanguage, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static findAndCountAll = async (
    filter: FilterQuery<ILanguage>,
    options: QueryOptions<ILanguage>,
    sortingCondition: { [key: string]: SORT_DIRECTION },
  ): Promise<{ count: number; languages: ILanguage[] }> => {
    const selectionFields: ProjectionType<ILanguage> = { _id: 1, code: 1, name: 1, createdAt: 1 };
    const languages = await Language.find(filter, selectionFields, options).sort(sortingCondition);
    const count = await LanguagesRepository.countAll(filter);

    return { count, languages };
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
