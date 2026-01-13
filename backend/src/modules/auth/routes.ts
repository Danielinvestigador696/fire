import { Router } from 'express';
import { authController } from './controller';
import { validate } from '../../middleware/validate';
import { loginSchema, registerSchema, forgotPasswordSchema } from './schemas';
import { authenticateToken } from '../../middleware/auth';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
authRoutes.post('/refresh', authController.refreshToken);
authRoutes.get('/me', authenticateToken, authController.getMe);
