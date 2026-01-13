import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { notificacoesController } from './controller';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const tokenSchema = z.object({
  token: z.string(),
  plataforma: z.enum(['ios', 'android', 'web']),
});

export const notificacoesRoutes = Router();

notificacoesRoutes.use(authenticateToken);
notificacoesRoutes.get('/', notificacoesController.list);
notificacoesRoutes.get('/nao-lidas', notificacoesController.listNaoLidas);
notificacoesRoutes.put('/:id/lida', notificacoesController.marcarComoLida);
notificacoesRoutes.put('/todas-lidas', notificacoesController.marcarTodasComoLidas);
notificacoesRoutes.get('/preferencias', notificacoesController.getPreferencias);
notificacoesRoutes.put('/preferencias', notificacoesController.updatePreferencias);
notificacoesRoutes.post('/token', validate(tokenSchema), notificacoesController.registerToken);
