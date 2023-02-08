import { SortingCondition, SORT_DIRECTION } from '../../../types';
import { CARD_SORT_BY, ICard } from '../types';

export const getSortingCondition = (sortBy: string, sortDir: string): SortingCondition<Omit<ICard, 'nativeWords' | 'foreignWOrds'>> => {
  let sortingCondition: SortingCondition<Omit<ICard, 'nativeWords' | 'foreignWOrds'>> = {};
  const sortDirection: SORT_DIRECTION = sortDir as SORT_DIRECTION;

  switch (sortBy) {
  case CARD_SORT_BY.DATE: {
    sortingCondition = { createdAt: sortDirection };
    break;
  }
  }

  return sortingCondition;
};
