/* eslint-disable require-await */
import { logRequest } from '../../utils/log-request.utils';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
} from './types/request.types';
import { LanguageDTO } from './language.dto';
import { GetLanguagesCommon } from './types';
import { LANGUAGE_DTO } from './languages.constants';

export class LanguagesService {
  static findAll = async (req: GetLanguagesRequest): Promise<GetLanguagesCommon | null> => {
    logRequest<GetLanguagesRequest>(req);
    return {
      count: 30,
      languages: [LANGUAGE_DTO],
    };
  };

  static findById = async (req: GetOneLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest<GetOneLanguageRequest>(req);
    return LANGUAGE_DTO;
  };

  static create = async (req: CreateLanguageRequest): Promise<LanguageDTO> => {
    logRequest<CreateLanguageRequest>(req);
    return LANGUAGE_DTO;
  };

  static update = async (req: UpdateLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest<UpdateLanguageRequest>(req);
    return LANGUAGE_DTO;
  };

  static delete = async (req: DeleteLanguageRequest): Promise<number | null> => {
    logRequest<DeleteLanguageRequest>(req);
    return 1;
  };
}
