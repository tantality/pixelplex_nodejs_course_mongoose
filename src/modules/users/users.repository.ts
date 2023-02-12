import { FilterQuery, ObjectId } from 'mongoose';
import { User } from './user.model';
import { CreateUserDTO, IUser, UpdateUserDTO } from './types';

export class UsersRepository {
  static create = async (userData: CreateUserDTO): Promise<IUser> => {
    const createdUser = await User.create(userData);
    return createdUser;
  };

  static update = async (_id: ObjectId, body: UpdateUserDTO): Promise<IUser> => {
    await User.updateOne({ _id }, { ...body });

    const updatedUser = (await UsersRepository.findOne({ _id })) as IUser;

    return updatedUser;
  };

  static findOne = async (condition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(condition);
    return user;
  };
}
