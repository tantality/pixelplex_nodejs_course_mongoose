/* eslint-disable require-await */
import { logRequest } from '../../utils';
import {
  CreateLanguageRequest,
  DeleteLanguageRequest,
  GetLanguagesRequest,
  GetOneLanguageRequest,
  UpdateLanguageRequest,
  GetLanguagesCommon,
} from './types';
import { LanguageDTO } from './language.dto';
import { LANGUAGE_DTO } from './languages.constants';

export class LanguagesService {
  static findAll = async (req: GetLanguagesRequest): Promise<GetLanguagesCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      languages: [LANGUAGE_DTO],
    };
  };

  static findById = async (req: GetOneLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest(req);
    return LANGUAGE_DTO;
  };

  static create = async (req: CreateLanguageRequest): Promise<LanguageDTO> => {
    logRequest(req);
    return LANGUAGE_DTO;
  };

  static update = async (req: UpdateLanguageRequest): Promise<LanguageDTO | null> => {
    logRequest(req);
    return LANGUAGE_DTO;
  };

  static delete = async (req: DeleteLanguageRequest): Promise<number | null> => {
    logRequest(req);
    return 1;
  };
}
