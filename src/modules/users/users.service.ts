/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils';
import { UpdateUserRequest } from './types';
import { UserDTO } from './user.dto';

const userDTO = {
  id: 1,
  name: 'Angelina',
  email: 'email@gmail.com',
  nativeLanguageId: 2,
} as UserDTO;

export class UsersService {
  static findById = async (req: Request): Promise<UserDTO | null> => {
    logRequest(req);
    return userDTO;
  };

  static update = async (req: UpdateUserRequest): Promise<UserDTO | null> => {
    logRequest(req);
    return userDTO;
  };
}
