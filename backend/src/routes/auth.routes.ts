import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from '../validations/auth.validation';
import { container } from '../container/inversify.config';
import TYPES from '../container/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);
router.put('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword); // Both POST/PUT for flexibility
router.put('/profile', protect, validate(updateProfileSchema), authController.updateProfile);

export default router;
