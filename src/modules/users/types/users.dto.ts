import { ObjectId } from 'mongoose';
import { IUser, UpdateUserBody } from '.';

export class UserDTO implements Pick<IUser, 'name' | 'email' | 'nativeLanguageId'> {
  public readonly id: ObjectId;
  public readonly name: string;
  public readonly email: string;
  public readonly nativeLanguageId: ObjectId | null;
  constructor(user: IUser) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.nativeLanguageId = user.nativeLanguageId;
  }
}

export type CreateUserDTO = Pick<IUser, 'name' | 'email' | 'normalizedEmail' | 'password'> & { nativeLanguageId: ObjectId };
export type UpdateUserDTO = UpdateUserBody;
