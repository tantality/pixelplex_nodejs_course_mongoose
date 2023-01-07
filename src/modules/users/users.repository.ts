import { FilterQuery, ObjectId } from 'mongoose';
import { User } from '../../models/user.model';
import { CreateUserData, IUser, UpdateUserBody } from './types';

export class UsersRepository {
  static findOneByCondition = async (condition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(condition);
    return user;
  };

  static create = async (userData: CreateUserData): Promise<IUser> => {
    const createdUser = await User.create(userData);
    return createdUser;
  };

  static update = async (_id: ObjectId, body: UpdateUserBody): Promise<IUser> => {
    await User.updateOne({ _id }, { ...body });

    const updatedUser = (await UsersRepository.findOneByCondition({ _id })) as IUser;

    return updatedUser;
  };
}
