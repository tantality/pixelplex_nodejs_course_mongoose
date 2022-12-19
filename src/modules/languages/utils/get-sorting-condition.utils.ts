import { SORT_DIRECTION } from '../../../types';
import { LANGUAGE_SORT_BY } from '../types';

export const getSortingCondition = (sortBy: string, sortDir: string): { [key: string]: SORT_DIRECTION } => {
  let sortingCondition: { [key: string]: SORT_DIRECTION } = {};
  const sortDirection: SORT_DIRECTION = sortDir as SORT_DIRECTION;

  switch (sortBy) {
  case LANGUAGE_SORT_BY.NAME: {
    sortingCondition = { name: sortDirection };
    break;
  }
  case LANGUAGE_SORT_BY.DATE: {
    sortingCondition = { createdAt: sortDirection };
    break;
  }
  }

  return sortingCondition;
};
