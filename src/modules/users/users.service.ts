/* eslint-disable require-await */
import { FilterQuery, ObjectId } from 'mongoose';
import {
  NotFoundError,
  LANGUAGE_NOT_FOUND_MESSAGE,
  BadRequestError,
  USER_ALREADY_EXISTS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../../errors';
import { LanguagesService } from '../languages/languages.service';
import { CreateUserData, IUser, UpdateUserData } from './types';
import { UsersRepository } from './users.repository';
import { isUpdateUserBodyType } from './utils';

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

  static update = async (userId: ObjectId, userData: UpdateUserData): Promise<IUser> => {
    const userToUpdate = await UsersService.findOneByCondition({ _id: userId });
    if (!userToUpdate) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    let nativeLanguage = null;

    if (isUpdateUserBodyType(userData)) {
      nativeLanguage = await LanguagesService.findOneByCondition({ _id: userData.nativeLanguageId });
      if (!nativeLanguage) {
        throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
      }
    }

    const updatedUser = await UsersRepository.update(userId, userData);

    return updatedUser;
  };
}
