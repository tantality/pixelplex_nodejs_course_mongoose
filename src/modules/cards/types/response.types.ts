import { Response } from 'express';
import { CardDTO } from '../card.dto';
import { ICard } from './cards.types';

export type GetCardsResponse = Response<{ count: number; cards: ICard[] }>;
export type CreateCardResponse = Response<CardDTO>;
export type UpdateCardResponse = Response<CardDTO>;
