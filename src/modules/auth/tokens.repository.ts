import { ObjectId } from 'mongoose';
import { User } from '../users/user.model';
import { REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { IToken } from './types';
import { getTokenFromArray } from './utils';

export class TokensRepository {
  static findOne = async (refreshTokenValue: string): Promise<IToken | null> => {
    const tokenInArray: { token: IToken }[] = await User.aggregate([
      { $match: { refreshTokens: { $elemMatch: { value: refreshTokenValue } } } },
      {
        $project: {
          _id: 0,
          token: {
            $filter: {
              input: '$refreshTokens',
              as: 'refreshToken',
              cond: { $eq: ['$$refreshToken.value', refreshTokenValue] },
            },
          },
        },
      },
      { $unwind: '$token' },
    ]);

    return getTokenFromArray(tokenInArray);
  };

  static save = async (userId: ObjectId, refreshTokenValue: string): Promise<void> => {
    await User.updateOne({ _id: userId }, { $push: { refreshTokens: { value: refreshTokenValue } } });
  };

  static update = async (_id: ObjectId, refreshTokenValue: string): Promise<void> => {
    await User.updateOne(
      { refreshTokens: { $exists: true } },
      {
        $set: {
          'refreshTokens.$[token].value': refreshTokenValue,
          'refreshTokens.$[token].expiresAt': Date.now() + REFRESH_TOKEN_LIFETIME_IN_MS,
        },
      },
      { arrayFilters: [{ 'token._id': _id }] },
    );
  };

  static delete = async (userId: ObjectId, refreshTokenValue: string): Promise<void> => {
    await User.updateOne({ _id: userId }, { $pull: { refreshTokens: { value: refreshTokenValue } } });
  };

  static deleteExpiredRefreshTokens = async (): Promise<void> => {
    await User.updateMany({}, { $pull: { refreshTokens: { expiresAt: { $lt: Date.now() } } } });
  };
}
