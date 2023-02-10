import { Response } from 'express';
import { CardDTO, ICard } from '.';

export type GetCardsResponse = Response<{ count: number; cards: ICard[] }>;
export type CreateCardResponse = Response<CardDTO>;
export type UpdateCardResponse = Response<CardDTO>;
