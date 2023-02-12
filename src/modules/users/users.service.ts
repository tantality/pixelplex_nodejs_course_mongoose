import { FilterQuery, ObjectId } from 'mongoose';
import {
  NotFoundError,
  LANGUAGE_NOT_FOUND_MESSAGE,
  BadRequestError,
  USER_ALREADY_EXISTS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../../errors';
import { LanguagesService } from '../languages/languages.service';
import { CreateUserDTO, IUser, UpdateUserDTO } from './types';
import { UsersRepository } from './users.repository';

export class UsersService {
  static create = async (userData: CreateUserDTO): Promise<IUser> => {
    const nativeLanguage = await LanguagesService.findOne({ _id: userData.nativeLanguageId });
    if (!nativeLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const user = await UsersService.findOne({ normalizedEmail: userData.normalizedEmail });
    if (user) {
      throw new BadRequestError(USER_ALREADY_EXISTS_MESSAGE);
    }

    const createdUser = await UsersRepository.create(userData);

    return createdUser;
  };

  static update = async (userId: ObjectId, body: UpdateUserDTO): Promise<IUser> => {
    const userToUpdate = await UsersService.findOne({ _id: userId });
    if (!userToUpdate) {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    }

    const nativeLanguage = await LanguagesService.findOne({ _id: body.nativeLanguageId });
    if (!nativeLanguage) {
      throw new NotFoundError(LANGUAGE_NOT_FOUND_MESSAGE);
    }

    const updatedUser = await UsersRepository.update(userId, body);

    return updatedUser;
  };

  static findOne = async (condition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await UsersRepository.findOne(condition);
    return user;
  };
}
