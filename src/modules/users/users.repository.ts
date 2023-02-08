import { FilterQuery, ObjectId } from 'mongoose';
import { User } from './user.model';
import { CreateUserData, IUser, UpdateUserBody } from './types';

export class UsersRepository {
  static create = async (userData: CreateUserData): Promise<IUser> => {
    const createdUser = await User.create(userData);
    return createdUser;
  };

  static update = async (_id: ObjectId, body: UpdateUserBody): Promise<IUser> => {
    await User.updateOne({ _id }, { ...body });

    const updatedUser = (await UsersRepository.findOne({ _id })) as IUser;

    return updatedUser;
  };

  static findOne = async (condition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(condition);
    return user;
  };
}
