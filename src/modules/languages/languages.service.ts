import { FilterQuery, ObjectId } from 'mongoose';
import { BadRequestError, LANGUAGE_ALREADY_EXISTS_MESSAGE, LANGUAGE_CANNOT_BE_DELETED_MESSAGE, LANGUAGE_NOT_FOUND_MESSAGE, NotFoundError } from '../../errors';
import { UsersService } from '../users/users.service';
import { UpdateLanguageBody, CreateLanguageBody, GetLanguagesQuery, ILanguage } from './types';
import { LanguageDTO } from './language.dto';
import { LanguagesRepository } from './languages.repository';

export class LanguagesService {
  static findAndCountAll = async (query: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    const languagesAndTheirCount = await LanguagesRepository.findAndCountAll(query);
    return languagesAndTheirCount;
  };

  static create = async (body: CreateLanguageBody): Promise<LanguageDTO> => {
    const language = await LanguagesService.findOne({ code: body.code });
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const createdLanguage = await LanguagesRepository.create(body);

    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: ObjectId, body: UpdateLanguageBody): Promise<LanguageDTO> => {
    const languageToUpdate = await LanguagesService.findOne({ _id: languageId });
    if (!languageToUpdate) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const { code } = body;
    const language = code && (await LanguagesService.findOne({ code }));
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const updatedLanguage = await LanguagesRepository.update(languageId, body);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: ObjectId): Promise<void> => {
    const languageToDelete = await LanguagesService.findOne({ _id: languageId });
    if (!languageToDelete) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const languageIsUsedInUsers = await UsersService.findOne({ nativeLanguageId: languageId });
    if (languageIsUsedInUsers) {
      throw new BadRequestError(LANGUAGE_CANNOT_BE_DELETED_MESSAGE);
    }

    await LanguagesRepository.delete(languageId);
  };

  static findOne = async (condition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await LanguagesRepository.findOne(condition);
    return language;
  };
}
