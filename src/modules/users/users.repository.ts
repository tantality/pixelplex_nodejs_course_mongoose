import { FilterQuery } from 'mongoose';
import { User } from '../../models/user.model';
import { CreateUserData, IUser } from './types';

export class UsersRepository {
  static findOneByCondition = async (whereCondition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(whereCondition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<IUser> => {
    const createdUser = await User.create(userData);
    return createdUser;
  };
}
