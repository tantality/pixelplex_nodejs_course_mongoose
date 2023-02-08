import { SORT_DIRECTION } from '../../../types';
import { CARD_SORT_BY, ICard } from '../types';

type SortingCondition = { [key in keyof Omit<ICard, 'nativeWords' | 'foreignWOrds'>]?: SORT_DIRECTION };

export const getSortingCondition = (sortBy: string, sortDir: string): SortingCondition => {
  let sortingCondition: SortingCondition = {};
  const sortDirection: SORT_DIRECTION = sortDir as SORT_DIRECTION;

  switch (sortBy) {
  case CARD_SORT_BY.DATE: {
    sortingCondition = { createdAt: sortDirection };
    break;
  }
  }

  return sortingCondition;
};