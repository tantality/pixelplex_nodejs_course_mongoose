import { SORT_DIRECTION } from '../../../types';
import { ICard, CARD_SORT_BY } from '../types';

export const transformCards = (cards: ICard[], sortDirection: string, sortBy: string): ICard[] => {
  if (cards.length && sortBy === CARD_SORT_BY.WORD) {
    cards.map((card) => {
      sortWords(card.nativeWords, sortDirection);
      sortWords(card.foreignWords, sortDirection);

      return card;
    });
  }

  return cards;
};

const sortWords = (words: string[], sortDirection: string): string[] => {
  words.sort();
  if (sortDirection === SORT_DIRECTION.DESC) {
    words.reverse();
  }

  return words;
};
