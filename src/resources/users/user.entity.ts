import { USER_ROLE } from './users.constants';

let usersCounter = 0;

export class User {
  id: number;

  constructor(
    public readonly nativeLanguageId: number,
    public readonly name: string,
    public readonly email: string,
    public readonly normalizedEmail: string,
    public readonly password: string,
    public readonly role: USER_ROLE,
    public readonly refreshToken: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = usersCounter;
    usersCounter += 1;
  }
}
