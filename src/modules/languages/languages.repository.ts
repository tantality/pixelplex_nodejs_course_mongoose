import { ObjectId } from 'mongoose';
import { FindOptionsWhere } from 'typeorm';
import { Language } from '../../models/language.model';
import { Lang } from './language.entity';
import { CreateLanguageBody, ILanguage, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static findAndCountAll = async (
    skip: number,
    take: number,
    whereCondition: FindOptionsWhere<Lang>,
  ): Promise<{ count: number; languages: Lang[] }> => {
    const [languages, count] = await Lang.findAndCount({
      select: {
        id: true,
        code: true,
        name: true,
        createdAt: true,
      },
      where: whereCondition,
      skip,
      take,
    });

    return { count, languages };
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
