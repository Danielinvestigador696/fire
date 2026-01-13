import { z } from 'zod';

export const liberarUsuarioSchema = z.object({
  userId: z.number().int().positive('ID do usuário inválido'),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  observacoes: z.string().optional(),
});
