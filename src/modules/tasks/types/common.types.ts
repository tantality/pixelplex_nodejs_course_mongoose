import { LanguageDTO } from '../../languages/language.dto';

export type GetStatisticsCommon = { language: LanguageDTO; answers: { correct: number; incorrect: number } }[];
