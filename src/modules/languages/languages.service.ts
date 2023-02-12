import { FilterQuery, ObjectId } from 'mongoose';
import { BadRequestError, LANGUAGE_ALREADY_EXISTS_MESSAGE, LANGUAGE_NOT_FOUND_MESSAGE, NotFoundError } from '../../errors';
import { GetLanguagesQuery, ILanguage, LanguageDTO, CreateLanguageDTO, UpdateLanguageDTO } from './types';
import { LanguagesRepository } from './languages.repository';

export class LanguagesService {
  static findAndCountAll = async (selectionAndOutputParameters: GetLanguagesQuery): Promise<{ count: number; languages: ILanguage[] }> => {
    const languagesAndTheirCount = await LanguagesRepository.findAndCountAll(selectionAndOutputParameters);
    return languagesAndTheirCount;
  };

  static create = async (createLanguageDTO: CreateLanguageDTO): Promise<LanguageDTO> => {
    const language = await LanguagesService.findOne({ code: createLanguageDTO.code });
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const createdLanguage = await LanguagesRepository.create(createLanguageDTO);

    return new LanguageDTO(createdLanguage);
  };

  static update = async (languageId: ObjectId, updateLanguageDTO: UpdateLanguageDTO): Promise<LanguageDTO> => {
    const languageToUpdate = await LanguagesService.findOne({ _id: languageId });
    if (!languageToUpdate) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const { code } = updateLanguageDTO;
    const language = code && (await LanguagesService.findOne({ code }));
    if (language) {
      throw new BadRequestError(LANGUAGE_ALREADY_EXISTS_MESSAGE);
    }

    const updatedLanguage = await LanguagesRepository.update(languageId, updateLanguageDTO);

    return new LanguageDTO(updatedLanguage);
  };

  static delete = async (languageId: ObjectId): Promise<void> => {
    const languageToDelete = await LanguagesService.findOne({ _id: languageId });
    if (!languageToDelete) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    await LanguagesRepository.delete(languageId);
  };

  static findOne = async (condition: FilterQuery<ILanguage>): Promise<ILanguage | null> => {
    const language = await LanguagesRepository.findOne(condition);
    return language;
  };
}
