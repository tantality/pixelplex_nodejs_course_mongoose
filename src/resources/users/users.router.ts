import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { UsersController } from './users.controller';
import { UsersValidation } from './users.validation';

const router = Router();

router.patch('/', checkSchema(UsersValidation.updateUser), validatePayload, UsersController.updateUser);

export function mountUsersRouter(app: Application): void {
  app.use('/users', router);
}
