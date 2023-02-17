export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_DIRECTION_AS_NUMBER {
  ASC = 1,
  DESC = -1,
}

export type SortingCondition<T> = { [key in keyof T]?: SORT_DIRECTION };
export type SortingConditionWithDirectionAsNumber<T> = { [key in keyof T]?: SORT_DIRECTION_AS_NUMBER };
