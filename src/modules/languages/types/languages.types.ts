import { ObjectId } from 'mongoose';

export interface ILanguage {
  _id: ObjectId;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LANGUAGE_SORT_BY {
  NAME = 'name',
  DATE = 'date',
}
