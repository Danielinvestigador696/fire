import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { checkAdmin } from '../../middleware/checkAdmin';
import { assinaturasController } from './controller';
import { validate } from '../../middleware/validate';
import { liberarUsuarioSchema } from './schemas';

export const assinaturasRoutes = Router();

// Rotas públicas (não precisam de assinatura ativa)
assinaturasRoutes.get('/status', authenticateToken, assinaturasController.getStatus);

// Rotas protegidas (precisam de assinatura ativa)
assinaturasRoutes.use(authenticateToken);

// Rotas de admin
assinaturasRoutes.get('/', checkAdmin, assinaturasController.list);
assinaturasRoutes.post('/liberar', checkAdmin, validate(liberarUsuarioSchema), assinaturasController.liberar);
assinaturasRoutes.put('/:id/cancelar', checkAdmin, assinaturasController.cancelar);
