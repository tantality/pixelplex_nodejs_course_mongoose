import { SORT_DIRECTION, SORT_DIRECTION_AS_NUMBER } from '../../../types';
import { ILanguage, LANGUAGE_SORT_BY } from '../types';

type SortingCondition = { [key in keyof ILanguage]?: SORT_DIRECTION_AS_NUMBER };

export const getSortingCondition = (sortBy: string, sortDirection: string): SortingCondition => {
  let sortingCondition: SortingCondition = {};
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

const getSortDirectionAsNumber = (sortDirection: SORT_DIRECTION): SORT_DIRECTION_AS_NUMBER => {
  return sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION_AS_NUMBER.ASC : SORT_DIRECTION_AS_NUMBER.DESC;
};
