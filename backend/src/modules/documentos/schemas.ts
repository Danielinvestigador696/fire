import { z } from 'zod';

export const createDocumentoSchema = z.object({
  tipo: z.enum(['CR', 'PORTE', 'CAC', 'LICENCA', 'SEGURO']),
  numero: z.string().min(1, 'Número é obrigatório'),
  orgaoEmissor: z.string().optional(),
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  dataVencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  arquivoUrl: z.string().url().optional(),
  observacoes: z.string().optional(),
});

export const updateDocumentoSchema = z.object({
  numero: z.string().optional(),
  orgaoEmissor: z.string().optional(),
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  dataVencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  arquivoUrl: z.string().url().optional(),
  observacoes: z.string().optional(),
});
