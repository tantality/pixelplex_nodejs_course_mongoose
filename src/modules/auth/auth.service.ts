import normalizeEmail from 'normalize-email';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import {
  INVALID_PASSWORD_MESSAGE,
  REFRESH_TOKEN_IS_INVALID_MESSAGE,
  REFRESH_TOKEN_IS_MISSING_MESSAGE,
  REFRESH_TOKEN_NOT_FOUND_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../../errors/error-messages.constants';
import { UsersService } from '../users/users.service';
import { IAuth, LogInDTO, SignUpDTO } from './types';
import { TokensService } from './tokens.service';
import { SALT_ROUNDS } from './auth.constants';

export class AuthService {
  static signUp = async (body: SignUpDTO): Promise<IAuth> => {
    const normalizedEmail = normalizeEmail(body.email);
    const user = await UsersService.findOne({ normalizedEmail });
    if (user) {
      throw new BadRequestError(USER_ALREADY_EXISTS_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);
    const { _id: userId, role } = await UsersService.create({ ...body, normalizedEmail, password: hashedPassword });
    const { accessToken, refreshToken } = TokensService.generateTokens({ userId, role });

    await TokensService.save(userId, refreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  };

  static logIn = async ({ email, password }: LogInDTO): Promise<IAuth> => {
    const normalizedEmail = normalizeEmail(email);
    const user = await UsersService.findOne({ normalizedEmail });
    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError(INVALID_PASSWORD_MESSAGE);
    }

    const { _id: userId, role } = user;
    const { accessToken, refreshToken } = TokensService.generateTokens({ userId, role });

    await TokensService.save(userId, refreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  };

  static logOut = async (userId: ObjectId, refreshTokenToDelete: string): Promise<void> => {
    await TokensService.delete(userId, refreshTokenToDelete);
  };

  static refresh = async (receivedRefreshToken?: string): Promise<IAuth> => {
    if (!receivedRefreshToken) {
      throw new UnauthorizedError(REFRESH_TOKEN_IS_MISSING_MESSAGE);
    }

    const token = await TokensService.findOne(receivedRefreshToken);
    if (!token) {
      throw new NotFoundError(REFRESH_TOKEN_NOT_FOUND_MESSAGE);
    }

    const verifiedRefreshToken = TokensService.validateRefreshToken(receivedRefreshToken);
    if (!verifiedRefreshToken) {
      throw new UnauthorizedError(REFRESH_TOKEN_IS_INVALID_MESSAGE);
    }

    const { userId, role } = verifiedRefreshToken;
    const { accessToken, refreshToken } = TokensService.generateTokens({ userId, role });

    await TokensService.update(token._id, refreshToken);

    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  };
}
