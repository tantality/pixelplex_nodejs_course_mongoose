import { SORT_DIRECTION, SORT_DIRECTION_AS_NUMBER } from '../types';

export const getSortDirectionAsNumber = (sortDirection: SORT_DIRECTION): SORT_DIRECTION_AS_NUMBER => {
  return sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION_AS_NUMBER.ASC : SORT_DIRECTION_AS_NUMBER.DESC;
};
