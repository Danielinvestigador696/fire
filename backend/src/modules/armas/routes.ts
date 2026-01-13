import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { armasController } from './controller';
import { validate } from '../../middleware/validate';
import { createArmaSchema, updateArmaSchema } from './schemas';

export const armasRoutes = Router();

armasRoutes.use(authenticateToken);
armasRoutes.get('/', armasController.list);
armasRoutes.get('/count', armasController.count);
armasRoutes.get('/:id', armasController.getById);
armasRoutes.post('/', validate(createArmaSchema), armasController.create);
armasRoutes.put('/:id', validate(updateArmaSchema), armasController.update);
armasRoutes.delete('/:id', armasController.delete);
armasRoutes.post('/:id/fotos', armasController.addFoto);
armasRoutes.delete('/:id/fotos/:fotoId', armasController.removeFoto);
armasRoutes.post('/:id/manutencoes', armasController.addManutencao);
armasRoutes.get('/:id/manutencoes', armasController.listManutencoes);
