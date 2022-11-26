/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction } from 'express';
import { CardDTO } from './card.dto';
import { CardsService } from './cards.service';
import {
  GetCardsRequest,
  GetCardsResponse,
  CreateCardRequest,
  CreateCardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetCardsCommon,
} from './types';

export class CardsController {
  static getCards = async (req: GetCardsRequest, res: GetCardsResponse, next: NextFunction): Promise<void> => {
    const cards = await CardsService.findAll(req);
    res.status(200).json(cards as GetCardsCommon);
  };

  static createCard = async (req: CreateCardRequest, res: CreateCardResponse, next: NextFunction): Promise<void> => {
    const createdCard = await CardsService.create(req);
    res.status(201).json(createdCard);
  };

  static updateCard = async (req: UpdateCardRequest, res: UpdateCardResponse, next: NextFunction): Promise<void> => {
    const updatedCard = await CardsService.update(req);
    res.status(200).json(updatedCard as CardDTO);
  };

  static deleteCard = async (req: DeleteCardRequest, res: DeleteCardResponse, next: NextFunction): Promise<void> => {
    const cardId = await CardsService.delete(req);
    res.status(200).json({ id: cardId as number });
  };
}
