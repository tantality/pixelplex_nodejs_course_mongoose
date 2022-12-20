import { FilterQuery, ObjectId, QueryOptions } from 'mongoose';
import { BadRequestError, LANGUAGE_ALREADY_EXISTS_MESSAGE, LANGUAGE_NOT_FOUND_MESSAGE, NotFoundError } from '../../errors';
import { UpdateLanguageBody, CreateLanguageBody, GetLanguagesQuery, ILanguage } from './types';
import { LanguageDTO } from './language.dto';
import { LanguagesRepository } from './languages.repository';
import { getSortingCondition } from './utils';

export class LanguagesService {
  static findAndCountAll = async ({
    search,
    sortBy,
    sortDirection,
    limit,
    offset,
  }: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    let filter: FilterQuery<ILanguage> = {};
    if (search) {
      filter = {
        name: { $regex: new RegExp(search, 'i') },
      };
    }

    const options: QueryOptions<ILanguage> = {
      skip: offset,
      limit,
    };

    const sortingCondition = getSortingCondition(sortBy, sortDirection);

    const languagesAndTheirNumber = await LanguagesRepository.findAndCountAll(filter, options, sortingCondition);

    return languagesAndTheirNumber;
  };

  static findOneByCondition = async (whereCondition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await LanguagesRepository.findOneByCondition(whereCondition);
    return language;
  };

  static create = async (body: CreateLanguageBody): Promise<LanguageDTO> => {
    const language = await LanguagesService.findOneByCondition({ code: body.code });
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const createdLanguage = await LanguagesRepository.create(body);

    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: ObjectId, body: UpdateLanguageBody): Promise<LanguageDTO> => {
    const languageToUpdate = await LanguagesService.findOneByCondition({ _id: languageId });
    if (!languageToUpdate) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const { code } = body;
    const language = code && (await LanguagesService.findOneByCondition({ code }));
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const updatedLanguage = await LanguagesRepository.update(languageId, body);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: ObjectId): Promise<void> => {
    const languageToDelete = await LanguagesService.findOneByCondition({ _id: languageId });
    if (!languageToDelete) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    await LanguagesRepository.delete(languageId);
  };
}
