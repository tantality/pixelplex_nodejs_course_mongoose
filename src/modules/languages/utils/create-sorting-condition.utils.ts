import { SortingConditionWithDirectionAsNumber, SORT_DIRECTION } from '../../../types';
import { getSortDirectionAsNumber } from '../../../utils';
import { ILanguage, LANGUAGE_SORT_BY } from '../types';

export const createSortingCondition = (sortBy: string, sortDirection: string): SortingConditionWithDirectionAsNumber<ILanguage> => {
  let sortingCondition: SortingConditionWithDirectionAsNumber<ILanguage> = {};
  const sortDirectionAsNumber = getSortDirectionAsNumber(sortDirection as SORT_DIRECTION);

  switch (sortBy) {
  case LANGUAGE_SORT_BY.NAME: {
    sortingCondition = { nameInLowercase: sortDirectionAsNumber };
    break;
  }
  case LANGUAGE_SORT_BY.DATE: {
    sortingCondition = { createdAt: sortDirectionAsNumber };
    break;
  }
  }

  return sortingCondition;
};
