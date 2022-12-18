import { Response } from 'express';
import { LanguageDTO } from '../language.dto';
import { Lang } from '../language.entity';

export type GetLanguagesResponse = Response<{ count: number; languages: Lang[] }>;
export type GetOneLanguageResponse = Response<LanguageDTO>;
export type CreateLanguageResponse = Response<LanguageDTO>;
export type UpdateLanguageResponse = Response<LanguageDTO>;
