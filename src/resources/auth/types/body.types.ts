import { IUser } from '../../users/user.interface';

export type LogInBody = Pick<IUser, 'email' | 'password'>;

interface ISignUpData extends LogInBody{
  nativeLanguageId: number;
  name: string;
}

export type SignUpBody = ISignUpData;
