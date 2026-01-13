import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { documentosController } from './controller';
import { validate } from '../../middleware/validate';
import { createDocumentoSchema, updateDocumentoSchema } from './schemas';

export const documentosRoutes = Router();

documentosRoutes.use(authenticateToken);
documentosRoutes.get('/', documentosController.list);
documentosRoutes.get('/vencendo', documentosController.listVencendo);
documentosRoutes.get('/:id', documentosController.getById);
documentosRoutes.post('/', validate(createDocumentoSchema), documentosController.create);
documentosRoutes.put('/:id', validate(updateDocumentoSchema), documentosController.update);
documentosRoutes.delete('/:id', documentosController.delete);
