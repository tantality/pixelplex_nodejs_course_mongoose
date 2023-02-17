import { IToken } from '../types';

export const getTokenFromArray = (tokenInArray: { token: IToken }[]): IToken | null => {
  if (!tokenInArray.length) {
    return null;
  }

  const [{ token }] = tokenInArray;

  return token;
};
