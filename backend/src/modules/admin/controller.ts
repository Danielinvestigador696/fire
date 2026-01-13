import { Request, Response } from 'express';
import { database } from '../../database/connection';
import { addDays } from 'date-fns';

interface AuthRequest extends Request {
  userId?: string;
}

export const adminController = {
  async listUsuarios(req: AuthRequest, res: Response) {
    try {
      const [usuarios] = await database.query(
        `SELECT u.id, u.name, u.email, u.role, u.created_at
         FROM users u
         ORDER BY u.created_at DESC`
      ) as any[];

      // Buscar assinatura mais recente de cada usuário
      const usuariosComAssinatura = await Promise.all(
        usuarios.map(async (u: any) => {
          const [assinaturas] = await database.query(
            `SELECT * FROM assinaturas 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [u.id]
          ) as any[];

          let assinatura = null;
          if (assinaturas.length > 0) {
            const ass = assinaturas[0];
            let diasRestantes = null;
            if (ass.data_fim) {
              const hoje = new Date();
              const dataFim = new Date(ass.data_fim);
              diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            }

            assinatura = {
              id: ass.id,
              status: ass.status,
              tipo: ass.tipo,
              dataFim: ass.data_fim,
              diasRestantes: diasRestantes !== null ? Math.max(0, diasRestantes) : null,
            };
          }

          return {
            ...u,
            assinatura,
          };
        })
      );

      res.json({ usuarios: usuariosComAssinatura });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listAssinaturas(req: AuthRequest, res: Response) {
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

  async liberarUsuario(req: AuthRequest, res: Response) {
    try {
      const adminId = req.userId!;
      const { id } = req.params;
      const { dataFim, observacoes } = req.body;

      // Verificar se usuário existe
      const [users] = await database.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      ) as any[];

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Cancelar assinaturas ativas anteriores
      await database.query(
        "UPDATE assinaturas SET status = 'CANCELADA' WHERE user_id = ? AND status = 'ATIVA'",
        [id]
      );

      // Criar nova assinatura PAGO
      const hoje = new Date().toISOString().split('T')[0];
      const [result] = await database.query(
        `INSERT INTO assinaturas 
         (user_id, tipo, status, data_inicio, data_fim, liberado_por, observacoes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, 'PAGO', 'ATIVA', hoje, dataFim || null, adminId, observacoes || null]
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

  async cancelarAssinatura(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await database.query(
        "UPDATE assinaturas SET status = 'CANCELADA' WHERE user_id = ? AND status = 'ATIVA'",
        [id]
      );

      res.json({ message: 'Assinatura cancelada com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEstatisticas(req: AuthRequest, res: Response) {
    try {
      const [stats] = await database.query(
        `SELECT 
          (SELECT COUNT(*) FROM users) as total_usuarios,
          (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
          (SELECT COUNT(*) FROM assinaturas WHERE status = 'ATIVA' AND tipo = 'TRIAL') as trial_ativos,
          (SELECT COUNT(*) FROM assinaturas WHERE status = 'ATIVA' AND tipo = 'PAGO') as pagos_ativos,
          (SELECT COUNT(*) FROM assinaturas WHERE status = 'EXPIRADA') as expiradas,
          (SELECT COUNT(*) FROM armas) as total_armas,
          (SELECT COUNT(*) FROM caca_registros) as total_cacas`
      ) as any[];

      res.json({ estatisticas: stats[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
