import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { checkAdmin } from '../../middleware/checkAdmin';
import { adminController } from './controller';

export const adminRoutes = Router();

adminRoutes.use(authenticateToken);
adminRoutes.use(checkAdmin);

adminRoutes.get('/usuarios', adminController.listUsuarios);
adminRoutes.get('/assinaturas', adminController.listAssinaturas);
adminRoutes.post('/usuarios/:id/liberar', adminController.liberarUsuario);
adminRoutes.post('/usuarios/:id/cancelar', adminController.cancelarAssinatura);
adminRoutes.get('/estatisticas', adminController.getEstatisticas);
