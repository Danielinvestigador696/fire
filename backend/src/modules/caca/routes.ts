import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { cacaController } from './controller';
import { validate } from '../../middleware/validate';
import { createCacaSchema, updateCacaSchema } from './schemas';

export const cacaRoutes = Router();

cacaRoutes.use(authenticateToken);
cacaRoutes.get('/', cacaController.list);
cacaRoutes.get('/count', cacaController.count);
cacaRoutes.get('/mapa', cacaController.getMapa);
cacaRoutes.get('/:id', cacaController.getById);
cacaRoutes.post('/', validate(createCacaSchema), cacaController.create);
cacaRoutes.put('/:id', validate(updateCacaSchema), cacaController.update);
cacaRoutes.delete('/:id', cacaController.delete);
cacaRoutes.post('/:id/compartilhar', cacaController.compartilhar);
