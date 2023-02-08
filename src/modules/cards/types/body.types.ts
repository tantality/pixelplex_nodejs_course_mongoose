import { ICard } from './cards.types';

export type CreateCardBody = Pick<ICard, 'nativeWords' | 'foreignLanguageId' | 'foreignWords'>;
export type UpdateCardBody = Partial<CreateCardBody>;
