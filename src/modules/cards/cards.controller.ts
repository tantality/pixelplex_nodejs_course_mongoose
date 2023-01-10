import { NextFunction, Response } from 'express';
import { ObjectId } from 'mongoose';
import { CardsService } from './cards.service';
import {
  GetCardsRequest,
  GetCardsResponse,
  CreateCardRequest,
  CreateCardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
  DeleteCardRequest,
} from './types';

export class CardsController {
  static getCards = async (req: GetCardsRequest, res: GetCardsResponse, next: NextFunction): Promise<void> => {
    try {
      const cards = await CardsService.findAll(req);
      res.status(200).json(cards);
    } catch (err) {
      next(err);
    }
  };

  static createCard = async (req: CreateCardRequest, res: CreateCardResponse, next: NextFunction): Promise<void> => {
    try {
      const createdCard = await CardsService.create(req.userId as ObjectId, req.body);
      res.status(201).json(createdCard);
    } catch (err) {
      next(err);
    }
  };

  static updateCard = async (req: UpdateCardRequest, res: UpdateCardResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedCard = await CardsService.update(req.userId as ObjectId, req.params.cardId, req.body);
      res.status(200).json(updatedCard);
    } catch (err) {
      next(err);
    }
  };

  static deleteCard = async (req: DeleteCardRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await CardsService.delete(req.userId as ObjectId, req.params.cardId);
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  };
}
