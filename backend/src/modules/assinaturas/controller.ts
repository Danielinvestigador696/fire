import { Request, Response } from 'express';
import { database } from '../../database/connection';
import { differenceInDays, addDays } from 'date-fns';

interface AuthRequest extends Request {
  userId?: string;
}

export const assinaturasController = {
  async getStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [assinaturas] = await database.query(
        `SELECT * FROM assinaturas 
         WHERE user_id = ? 
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
      ) as any[];

      if (assinaturas.length === 0) {
        return res.json({
          status: 'SEM_ASSINATURA',
          ativa: false,
          diasRestantes: 0,
        });
      }

      const assinatura = assinaturas[0];
      const hoje = new Date();
      const dataFim = assinatura.data_fim ? new Date(assinatura.data_fim) : null;

      let diasRestantes = null;
      if (dataFim) {
        diasRestantes = differenceInDays(dataFim, hoje);
      }

      const ativa = assinatura.status === 'ATIVA' && 
                   (!dataFim || differenceInDays(dataFim, hoje) >= 0);

      return res.json({
        status: assinatura.status,
        tipo: assinatura.tipo,
        ativa,
        diasRestantes: diasRestantes !== null ? Math.max(0, diasRestantes) : null,
        dataInicio: assinatura.data_inicio,
        dataFim: assinatura.data_fim,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async list(req: AuthRequest, res: Response) {
    try {
      const [assinaturas] = await database.query(
        `SELECT a.*, u.name as usuario_nome, u.email as usuario_email,
                admin.name as liberado_por_nome
         FROM assinaturas a
         INNER JOIN users u ON a.user_id = u.id
         LEFT JOIN users admin ON a.liberado_por = admin.id
         ORDER BY a.created_at DESC`
      ) as any[];

      res.json({ assinaturas });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async liberar(req: AuthRequest, res: Response) {
    try {
      const adminId = req.userId!;
      const { userId, dataFim, observacoes } = req.body;

      // Verificar se usuário existe
      const [users] = await database.query(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      ) as any[];

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Cancelar assinaturas ativas anteriores
      await database.query(
        "UPDATE assinaturas SET status = 'CANCELADA' WHERE user_id = ? AND status = 'ATIVA'",
        [userId]
      );

      // Criar nova assinatura PAGO
      const hoje = new Date().toISOString().split('T')[0];
      const [result] = await database.query(
        `INSERT INTO assinaturas 
         (user_id, tipo, status, data_inicio, data_fim, liberado_por, observacoes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, 'PAGO', 'ATIVA', hoje, dataFim || null, adminId, observacoes || null]
      ) as any[];

      const assinaturaId = result.insertId;

      const [novaAssinatura] = await database.query(
        'SELECT * FROM assinaturas WHERE id = ?',
        [assinaturaId]
      ) as any[];

      res.status(201).json({ 
        message: 'Usuário liberado com sucesso',
        assinatura: novaAssinatura[0],
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async cancelar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await database.query(
        "UPDATE assinaturas SET status = 'CANCELADA' WHERE id = ?",
        [id]
      );

      res.json({ message: 'Assinatura cancelada com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
