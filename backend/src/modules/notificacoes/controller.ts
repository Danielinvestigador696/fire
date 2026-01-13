import { Request, Response } from 'express';
import { database } from '../../database/connection';

interface AuthRequest extends Request {
  userId?: string;
}

export const notificacoesController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { tipo, lida } = req.query;

      let query = 'SELECT * FROM notificacoes WHERE user_id = ?';
      const params: any[] = [userId];

      if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
      }

      if (lida !== undefined) {
        query += ' AND lida = ?';
        params.push(lida === 'true' ? 1 : 0);
      }

      query += ' ORDER BY created_at DESC LIMIT 50';

      const [notificacoes] = await database.query(query, params) as any[];

      res.json({ notificacoes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listNaoLidas(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [notificacoes] = await database.query(
        'SELECT * FROM notificacoes WHERE user_id = ? AND lida = 0 ORDER BY created_at DESC',
        [userId]
      ) as any[];

      res.json({ notificacoes, count: notificacoes.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async marcarComoLida(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      await database.query(
        'UPDATE notificacoes SET lida = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      res.json({ message: 'Notificação marcada como lida' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async marcarTodasComoLidas(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      await database.query(
        'UPDATE notificacoes SET lida = 1 WHERE user_id = ? AND lida = 0',
        [userId]
      );

      res.json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPreferencias(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [preferencias] = await database.query(
        'SELECT * FROM notificacao_preferencias WHERE user_id = ?',
        [userId]
      ) as any[];

      res.json({ preferencias });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updatePreferencias(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { tipoNotificacao, email, push, diasAntes } = req.body;

      // Verificar se já existe
      const [existing] = await database.query(
        'SELECT id FROM notificacao_preferencias WHERE user_id = ? AND tipo_notificacao = ?',
        [userId, tipoNotificacao]
      ) as any[];

      if (existing.length > 0) {
        await database.query(
          'UPDATE notificacao_preferencias SET email = ?, push = ?, dias_antes = ? WHERE user_id = ? AND tipo_notificacao = ?',
          [email !== undefined ? email : true, push !== undefined ? push : true, diasAntes || null, userId, tipoNotificacao]
        );
      } else {
        await database.query(
          'INSERT INTO notificacao_preferencias (user_id, tipo_notificacao, email, push, dias_antes) VALUES (?, ?, ?, ?, ?)',
          [userId, tipoNotificacao, email !== undefined ? email : true, push !== undefined ? push : true, diasAntes || null]
        );
      }

      res.json({ message: 'Preferências atualizadas com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async registerToken(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { token, plataforma } = req.body;

      // Verificar se já existe
      const [existing] = await database.query(
        'SELECT id FROM push_tokens WHERE user_id = ? AND token = ? AND plataforma = ?',
        [userId, token, plataforma]
      ) as any[];

      if (existing.length === 0) {
        await database.query(
          'INSERT INTO push_tokens (user_id, token, plataforma) VALUES (?, ?, ?)',
          [userId, token, plataforma]
        );
      } else {
        await database.query(
          'UPDATE push_tokens SET updated_at = NOW() WHERE user_id = ? AND token = ? AND plataforma = ?',
          [userId, token, plataforma]
        );
      }

      res.json({ message: 'Token registrado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
