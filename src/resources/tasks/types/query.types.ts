import { IWithBaseQuery } from '../../../types';

interface IWithQuery extends IWithBaseQuery {
  languageId?: number | string;
  taskStatus?: string;
}

export type GetTasksQuery = IWithQuery;
export type GetStatisticsQuery = { fromDate?: Date; toDate?: Date; languagesIds?: number[] };
