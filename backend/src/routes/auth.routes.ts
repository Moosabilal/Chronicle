import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { container } from '../container/inversify.config';
import TYPES from '../container/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);

export default router;
