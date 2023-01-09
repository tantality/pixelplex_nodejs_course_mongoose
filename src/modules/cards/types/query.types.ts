import { ObjectId } from 'mongoose';

export type GetCardsQuery = {
  search?: string;
  offset: number;
  limit: number;
  sortDirection: string;
  sortBy: string;
  languageId?: ObjectId;
};
