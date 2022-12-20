/* eslint-disable require-await */
import { FilterQuery } from 'mongoose';
import { NotFoundError, LANGUAGE_NOT_FOUND_MESSAGE, BadRequestError, USER_ALREADY_EXISTS_MESSAGE } from '../../errors';
import { logRequest } from '../../utils';
import { LanguagesService } from '../languages/languages.service';
import { CreateUserData, IUser, UpdateUserRequest } from './types';
import { UserDTO } from './user.dto';
import { UsersRepository } from './users.repository';

const userDTO = {
  id: '639f76',
  name: 'Angelina',
  email: 'email@gmail.com',
  nativeLanguageId: '639f',
} as unknown as UserDTO;

export class UsersService {
  static findOneByCondition = async (whereCondition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await UsersRepository.findOneByCondition(whereCondition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<IUser> => {
    const nativeLanguage = await LanguagesService.findOneByCondition({ _id: userData.nativeLanguageId });
    if (!nativeLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const user = await UsersService.findOneByCondition({ normalizedEmail: userData.normalizedEmail });
    if (user) {
      throw new BadRequestError(USER_ALREADY_EXISTS_MESSAGE);
    }

    const createdUser = await UsersRepository.create(userData);

    return createdUser;
  };

  static update = async (req: UpdateUserRequest): Promise<UserDTO | null> => {
    logRequest(req);
    return userDTO;
  };
}
