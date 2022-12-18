import { ObjectId } from 'mongoose';
import { ILanguage } from './types';

export class LanguageDTO implements Omit<ILanguage, 'updatedAt'> {
  public readonly _id: ObjectId;
  public readonly name: string;
  public readonly code: string;
  public readonly createdAt: Date;
  constructor(language: ILanguage) {
    this._id = language._id;
    this.name = language.name;
    this.code = language.code;
    this.createdAt = language.createdAt;
  }
}
