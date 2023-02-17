import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { isAuth, validatePayload } from '../../middleware';
import { UsersController } from '../users/users.controller';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { LogInRequest, SignUpRequest } from './types';

const router = Router();

router.post('/sign-up', checkSchema(AuthValidation.signUp), validatePayload<SignUpRequest>, AuthController.signUp);
router.post('/log-in', checkSchema(AuthValidation.logIn), validatePayload<LogInRequest>, AuthController.logIn);
router.get('/me', isAuth, UsersController.getOneUser);
router.get('/log-out', isAuth, AuthController.logOut);
router.post('/refresh-tokens', AuthController.refreshTokens);

export function mountAuthRouter(app: Application): void {
  app.use('/api/v1/auth', router);
}
