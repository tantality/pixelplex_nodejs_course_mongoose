import { ObjectId } from 'mongoose';
import { ICard } from './types';

export class CardDTO implements Omit<ICard, '_id' | 'userId' | 'updatedAt'> {
  public readonly id: ObjectId;
  public readonly nativeLanguageId: ObjectId;
  public readonly nativeWords: string[];
  public readonly foreignLanguageId: ObjectId;
  public readonly foreignWords: string[];
  public readonly createdAt: Date;
  constructor(card: ICard) {
    this.id = card._id;
    this.nativeLanguageId = card.nativeLanguageId;
    this.nativeWords = card.nativeWords;
    this.foreignLanguageId = card.foreignLanguageId;
    this.foreignWords = card.foreignWords;
    this.createdAt = card.createdAt;
  }
}
