import { FilterQuery, ObjectId } from 'mongoose';
import { User } from '../../models/user.model';
import { CreateUserData, IUser, UpdateUserData } from './types';

export class UsersRepository {
  static findOneByCondition = async (whereCondition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(whereCondition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<IUser> => {
    const createdUser = await User.create(userData);
    return createdUser;
  };

  static update = async (_id: ObjectId, userData: UpdateUserData): Promise<IUser> => {
    await User.updateOne({ _id }, { ...userData });

    const updatedUser = (await UsersRepository.findOneByCondition({ _id })) as IUser;

    return updatedUser;
  };
}
