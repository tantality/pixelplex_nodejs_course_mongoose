import { Aggregate, FilterQuery, ObjectId, ProjectionType } from 'mongoose';
import { SortingConditionWithDirectionAsNumber, SORT_DIRECTION } from '../../types';
import { getSortDirectionAsNumber } from '../../utils';
import { Language } from './language.model';
import { CreateLanguageBody, GetLanguagesQuery, ILanguage, LANGUAGE_SORT_BY, UpdateLanguageBody } from './types';

export class LanguagesRepository {
  static DTO_FIELD_SELECTION_CONFIG: ProjectionType<ILanguage> = { _id: 0, id: '$_id', code: 1, name: 1, createdAt: 1 };

  static findAndCountAll = async (selectionAndOutputParameters: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    const { search, sortBy, sortDirection, limit, offset } = selectionAndOutputParameters;

    const findingCondition = LanguagesRepository.createFindingConditionForLanguages(search);
    const sortingCondition = LanguagesRepository.createSortingConditionForLanguages(sortBy, sortDirection);

    const languagesCountPromise = LanguagesRepository.countAll(findingCondition);
    const languagesAggregate: Aggregate<ILanguage[]> = Language.aggregate([
      { $match: findingCondition },
      { $addFields: { nameInLowercase: { $toLower: '$name' } } },
      { $project: { ...(LanguagesRepository.DTO_FIELD_SELECTION_CONFIG as Record<string, unknown>), nameInLowercase: 1 } },
      { $sort: sortingCondition },
      { $unset: ['nameInLowercase'] },
      { $skip: offset },
      { $limit: limit },
    ]);

    const [count, languages] = await Promise.all([languagesCountPromise, languagesAggregate]);

    return { count, languages };
  };

  private static createFindingConditionForLanguages = (search?: string): FilterQuery<ILanguage> => {
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

  private static createSortingConditionForLanguages = (
    sortBy: string,
    sortDirection: string,
  ): SortingConditionWithDirectionAsNumber<ILanguage> => {
    let sortingCondition: SortingConditionWithDirectionAsNumber<ILanguage> = {};
    const sortDirectionAsNumber = getSortDirectionAsNumber(sortDirection as SORT_DIRECTION);

    switch (sortBy) {
    case LANGUAGE_SORT_BY.NAME: {
      sortingCondition = { nameInLowercase: sortDirectionAsNumber };
      break;
    }
    case LANGUAGE_SORT_BY.DATE: {
      sortingCondition = { createdAt: sortDirectionAsNumber };
      break;
    }
    }

    return sortingCondition;
  };

  static countAll = async (condition: FilterQuery<ILanguage>): Promise<number> => {
    const count = await Language.where(condition).countDocuments();
    return count;
  };

  static create = async (createLanguageDTO: CreateLanguageBody): Promise<ILanguage> => {
    const createdLanguage = await Language.create(createLanguageDTO);
    return createdLanguage;
  };

  static update = async (id: ObjectId, updateLanguageDTO: UpdateLanguageBody): Promise<ILanguage> => {
    await Language.updateOne({ _id: id }, { ...updateLanguageDTO });

    const updatedLanguage = (await LanguagesRepository.findOne({ _id: id })) as ILanguage;

    return updatedLanguage;
  };

  static findOne = async (condition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await Language.findOne(condition);
    return language;
  };

  static delete = async (id: ObjectId): Promise<void> => {
    await Language.deleteOne({ _id: id });
  };
}
