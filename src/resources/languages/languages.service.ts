/* eslint-disable require-await */
import { logRequest } from '../../utils/log-request.utils';
import { CreateLanguageRequest, DeleteLanguageRequest, GetLanguagesRequest, GetOneLanguageRequest, UpdateLanguageRequest } from './types/request.types';
import { LanguageDTO } from './language.dto';
import { Language } from './language.entity';

export class LanguagesService {
  private static language = new Language('russian', 'ru', new Date(), new Date());
  private static languageDTO = new LanguageDTO(LanguagesService.language);

  static findAll = async (req: GetLanguagesRequest): Promise<{ count: number; languages: LanguageDTO[] } | null> => {
    logRequest<GetLanguagesRequest>(req);
    return {
      count: 30,
      languages: [LanguagesService.languageDTO],
    };
  };

  static findById = async (req: GetOneLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest<GetOneLanguageRequest>(req);
    return LanguagesService.languageDTO;
  };

  static create = async (req: CreateLanguageRequest): Promise<LanguageDTO> => {
    logRequest<CreateLanguageRequest>(req);
    return LanguagesService.languageDTO;
  };

  static update = async (req: UpdateLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest<UpdateLanguageRequest>(req);
    return LanguagesService.languageDTO;
  };

  static delete = async (req: DeleteLanguageRequest): Promise<number | null> => {
    logRequest<DeleteLanguageRequest>(req);
    return 1;
  };
}
