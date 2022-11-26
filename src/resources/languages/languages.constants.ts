import { LanguageDTO } from './language.dto';
import { Language } from './language.entity';

const LANGUAGE = new Language('russian', 'ru', new Date(), new Date());
export const LANGUAGE_DTO = new LanguageDTO(LANGUAGE);
