import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { UsersController } from '../users/users.controller';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post('/sign-up', checkSchema(AuthValidation.signUp), validatePayload, AuthController.signUp);
router.post('/log-in', checkSchema(AuthValidation.logIn), validatePayload, AuthController.logIn);
router.get('/me', UsersController.getOneUser);
router.get('/log-out', AuthController.logOut);
router.post('/refresh-tokens', AuthController.refreshTokens);

export function mountAuthRouter(app: Application): void {
  app.use('/api/v1/auth', router);
}
