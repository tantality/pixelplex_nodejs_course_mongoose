import { FilterQuery, ObjectId } from 'mongoose';
import { Token } from '../../models/token.model';
import { IToken, RefreshTokenWithUserId } from './types';

export class TokensRepository {
  static findOneByCondition = async (condition: FilterQuery<IToken>): Promise<IToken | null> => {
    const token = await Token.findOne(condition);
    return token;
  };

  static save = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    await Token.create(tokenData);
  };

  static update = async (_id: ObjectId, tokenData: RefreshTokenWithUserId): Promise<void> => {
    await Token.updateOne({ _id }, tokenData);
  };

  static delete = async (tokenData: RefreshTokenWithUserId): Promise<void> => {
    await Token.deleteOne(tokenData);
  };
}
