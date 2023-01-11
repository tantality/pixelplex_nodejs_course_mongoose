import { ObjectId } from 'mongoose';

export type GetTasksQuery = {
  search?: string;
  offset: number;
  limit: number;
  sortDirection: string;
  sortBy: string;
  languageId?: ObjectId;
  taskStatus?: string;
};

export type GetStatisticsQuery = { fromDate?: Date; toDate?: Date; languageIds?: ObjectId[] };
