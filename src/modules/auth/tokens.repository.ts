import { ObjectId } from 'mongoose';
import { User } from '../users/user.model';
import { REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { IToken, RefreshTokenWithUserId } from './types';
import { getTokenFromArray } from './utils';

export class TokensRepository {
  static findOneByCondition = async (refreshTokenReceived: string): Promise<IToken | null> => {
    const tokenInArray: { token: IToken }[] = await User.aggregate([
      { $match: { refreshTokens: { $elemMatch: { value: refreshTokenReceived } } } },
      {
        $project: {
          _id: 0,
          token: {
            $filter: {
              input: '$refreshTokens',
              as: 'refreshToken',
              cond: { $eq: ['$$refreshToken.value', refreshTokenReceived] },
            },
          },
        },
      },
      { $unwind: '$token' },
    ]);

    return getTokenFromArray(tokenInArray);
  };

  static save = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    const { userId, refreshToken } = tokenData;
    await User.updateOne({ _id: userId }, { $push: { refreshTokens: { value: refreshToken } } });
  };

  static update = async (_id: ObjectId, tokenData: RefreshTokenWithUserId): Promise<void> => {
    const { userId, refreshToken } = tokenData;

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          'refreshTokens.$[token].value': refreshToken,
          'refreshTokens.$[token].expiresAt': Date.now() + REFRESH_TOKEN_LIFETIME_IN_MS,
        },
      },
      { arrayFilters: [{ 'token._id': _id }] },
    );
  };

  static delete = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    const { userId, refreshToken } = tokenData;
    await User.updateOne({ _id: userId }, { $pull: { refreshTokens: { value: refreshToken } } });
  };
}
