interface IWithBaseQuery {
  search?: string;
  offset: number;
  limit: number;
  sortDirection: string;
  sortBy: string;
}

export type GetLanguagesQuery = IWithBaseQuery;
