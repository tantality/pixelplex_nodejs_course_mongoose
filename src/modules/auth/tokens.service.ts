/* eslint-disable import/no-named-as-default-member */
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { ACCESS_TOKEN_LIFETIME_IN_MS, REFRESH_TOKEN_LIFETIME_IN_MS } from './auth.constants';
import { TokensRepository } from './tokens.repository';
import { IAuth, IToken, JWTPayload, VerifiedJWTPayload } from './types';

export class TokensService {
  static generateTokens = (payload: JWTPayload): Omit<IAuth, 'id'> => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: `${ACCESS_TOKEN_LIFETIME_IN_MS}ms` });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: `${REFRESH_TOKEN_LIFETIME_IN_MS}ms` });

    return { accessToken, refreshToken };
  };

  static validateAccessToken = (token: string): VerifiedJWTPayload => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as VerifiedJWTPayload;
  };

  static validateRefreshToken = (token: string): VerifiedJWTPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as VerifiedJWTPayload;
  };

  static findOne = async (refreshToken: string): Promise<IToken | null> => {
    const token = await TokensRepository.findOne(refreshToken);
    return token;
  };

  static save = async (userId: ObjectId, refreshToken: string): Promise<void> => {
    await TokensRepository.save(userId, refreshToken);
  };

  static update = async (id: ObjectId, refreshToken: string): Promise<void> => {
    await TokensRepository.update(id, refreshToken);
  };

  static delete = async (userId: ObjectId, refreshToken: string): Promise<void> => {
    await TokensRepository.delete(userId, refreshToken);
  };
}
