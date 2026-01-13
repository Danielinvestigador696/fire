import { z } from 'zod';

export const createCacaSchema = z.object({
  fotoUrl: z.string().url('URL da foto inválida'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  data: z.string().datetime(),
  peso: z.number().positive().optional(),
  tamanho: z.number().positive().optional(),
  observacoes: z.string().optional(),
  equipeId: z.number().optional(),
  publico: z.boolean().optional(),
});

export const updateCacaSchema = z.object({
  peso: z.number().positive().optional(),
  tamanho: z.number().positive().optional(),
  observacoes: z.string().optional(),
  publico: z.boolean().optional(),
});
