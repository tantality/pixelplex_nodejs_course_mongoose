import { Response } from 'express';
import { UserDTO } from '.';

export type GetOneUserResponse = Response<UserDTO>;
export type UpdateUserResponse = Response<UserDTO>;
