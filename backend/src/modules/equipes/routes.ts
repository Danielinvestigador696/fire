import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { equipesController } from './controller';
import { validate } from '../../middleware/validate';
import { createEquipeSchema, inviteMemberSchema } from './schemas';

export const equipesRoutes = Router();

equipesRoutes.use(authenticateToken);
equipesRoutes.get('/', equipesController.list);
equipesRoutes.post('/', validate(createEquipeSchema), equipesController.create);
equipesRoutes.get('/:id', equipesController.getById);
equipesRoutes.put('/:id', equipesController.update);
equipesRoutes.delete('/:id', equipesController.delete);
equipesRoutes.post('/:id/membros', validate(inviteMemberSchema), equipesController.inviteMember);
equipesRoutes.get('/:id/membros', equipesController.listMembers);
equipesRoutes.delete('/:id/membros/:userId', equipesController.removeMember);
equipesRoutes.get('/count', equipesController.count);
