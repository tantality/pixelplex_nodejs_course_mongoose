import { ObjectId } from 'mongoose';
import { ILanguage } from './types';

export class LanguageDTO implements Omit<ILanguage, 'updatedAt' | '_id'> {
  public readonly id: ObjectId;
  public readonly name: string;
  public readonly code: string;
  public readonly createdAt: Date;
  constructor(language: ILanguage) {
    this.id = language._id;
    this.name = language.name;
    this.code = language.code;
    this.createdAt = language.createdAt;
  }
}
