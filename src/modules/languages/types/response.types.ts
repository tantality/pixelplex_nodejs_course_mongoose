import { Response } from 'express';
import { LanguageDTO } from '../language.dto';
import { ILanguage } from './languages.types';

export type GetLanguagesResponse = Response<{ count: number; languages: ILanguage[] }>;
export type GetOneLanguageResponse = Response<LanguageDTO>;
export type CreateLanguageResponse = Response<LanguageDTO>;
export type UpdateLanguageResponse = Response<LanguageDTO>;
