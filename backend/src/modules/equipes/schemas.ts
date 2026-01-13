import { z } from 'zod';

export const createEquipeSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Email inválido'),
});
