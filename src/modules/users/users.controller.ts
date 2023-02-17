import { NextFunction, Request } from 'express';
import { ObjectId } from 'mongoose';
import { GetOneUserResponse, IUser, UpdateUserRequest, UpdateUserResponse, UserDTO } from './types';
import { UsersService } from './users.service';

export class UsersController {
  static getOneUser = async (req: Request, res: GetOneUserResponse, next: NextFunction): Promise<void> => {
    try {
      const user = (await UsersService.findOne({ _id: req.userId as ObjectId })) as IUser;
      res.status(200).json(new UserDTO(user));
    } catch (err) {
      next(err);
    }
  };

  static updateUser = async (req: UpdateUserRequest, res: UpdateUserResponse, next: NextFunction): Promise<void> => {
    try {
      const updatedUser = await UsersService.update(req.userId as ObjectId, req.body);
      res.status(200).json(new UserDTO(updatedUser));
    } catch (err) {
      next(err);
    }
  };
}
