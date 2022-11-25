/* eslint-disable require-await */
import { Request } from 'express';
import { logRequest } from '../../utils/log-request.utils';
import { UpdateUserRequest } from './types';
import { UserDTO } from './user.dto';
import { User } from './user.entity';

export class UsersService {
  private static user = new User(
    1,
    'Angelina',
    'email@gmail.com',
    'email@gmail.com',
    'qwerty123',
    'user',
    'awdwkmkwad243',
    new Date(),
    new Date(),
  );
  private static userDTO = new UserDTO(UsersService.user);

  static findById = async (req: Request): Promise<UserDTO | null> => {
    logRequest(req);
    return UsersService.userDTO;
  };

  static update = async (req: UpdateUserRequest): Promise<UserDTO | null> => {
    logRequest(req);
    return UsersService.userDTO;
  };
}
