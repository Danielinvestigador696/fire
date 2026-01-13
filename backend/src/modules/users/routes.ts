import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { usersController } from './controller';

export const usersRoutes = Router();

usersRoutes.use(authenticateToken);
usersRoutes.get('/profile', usersController.getProfile);
usersRoutes.put('/profile', usersController.updateProfile);
usersRoutes.put('/avatar', usersController.updateAvatar);
