import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/auth.validation';
import { container } from '../container/inversify.config';
import TYPES from '../container/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

export default router;
