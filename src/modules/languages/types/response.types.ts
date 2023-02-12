import { Response } from 'express';
import { ILanguage } from './languages.types';
import { LanguageDTO } from '.';

export type GetLanguagesResponse = Response<{ count: number; languages: ILanguage[] }>;
export type GetOneLanguageResponse = Response<LanguageDTO>;
export type CreateLanguageResponse = Response<LanguageDTO>;
export type UpdateLanguageResponse = Response<LanguageDTO>;
