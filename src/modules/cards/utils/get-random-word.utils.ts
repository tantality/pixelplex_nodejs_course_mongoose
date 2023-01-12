import { getRandomInt } from './get-random-int.utils';

export const getRandomWord = ({ count, words }: { count: number; words: string[] }): string => {
  const randomWordIndex = getRandomInt(count);
  const randomWord = words[randomWordIndex];

  return randomWord;
};
