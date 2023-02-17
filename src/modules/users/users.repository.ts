import { FilterQuery, ObjectId } from 'mongoose';
import { User } from './user.model';
import { CreateUserDTO, IUser, UpdateUserDTO } from './types';

export class UsersRepository {
  static create = async (createUserDTO: CreateUserDTO): Promise<IUser> => {
    const createdUser = await User.create(createUserDTO);
    return createdUser;
  };

  static update = async (id: ObjectId, updateUserDTO: UpdateUserDTO): Promise<IUser> => {
    await User.updateOne({ _id: id }, { ...updateUserDTO });

    const updatedUser = (await UsersRepository.findOne({ _id: id })) as IUser;

    return updatedUser;
  };

  static findOne = async (condition: FilterQuery<IUser>): Promise<IUser | null> => {
    const user = await User.findOne(condition);
    return user;
  };
}
