import { z } from 'zod';

export const createArmaSchema = z.object({
  numeroSerie: z.string().min(1, 'Número de série é obrigatório'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  calibre: z.string().min(1, 'Calibre é obrigatório'),
  fabricante: z.string().optional(),
  tipo: z.string().optional(),
  observacoes: z.string().optional(),
  equipeId: z.number().optional(),
});

export const updateArmaSchema = z.object({
  modelo: z.string().optional(),
  calibre: z.string().optional(),
  fabricante: z.string().optional(),
  tipo: z.string().optional(),
  observacoes: z.string().optional(),
});
