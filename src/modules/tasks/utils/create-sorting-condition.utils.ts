import { SortingConditionWithDirectionAsNumber, SORT_DIRECTION } from '../../../types';
import { getSortDirectionAsNumber } from '../../../utils';
import { ITask, TASK_SORT_BY } from '../types';

export const createSortingCondition = (sortBy: string, sortDirection: string): SortingConditionWithDirectionAsNumber<ITask> => {
  let sortingCondition: SortingConditionWithDirectionAsNumber<ITask> = {};
  const sortDirectionAsNumber = getSortDirectionAsNumber(sortDirection as SORT_DIRECTION);

  switch (sortBy) {
  case TASK_SORT_BY.DATE: {
    sortingCondition = { createdAt: sortDirectionAsNumber };
    break;
  }
  }

  return sortingCondition;
};
