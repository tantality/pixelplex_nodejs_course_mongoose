import { ObjectId } from 'mongoose';

export interface ICard {
  _id: ObjectId;
  userId: ObjectId;
  nativeLanguageId: ObjectId;
  nativeWords: string[];
  foreignLanguageId: ObjectId;
  foreignWords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CARD_SORT_BY {
  WORD = 'word',
  DATE = 'date',
}
