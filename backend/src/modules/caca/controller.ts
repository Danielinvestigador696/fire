import { Request, Response } from 'express';
import { database } from '../../database/connection';

interface AuthRequest extends Request {
  userId?: string;
}

export const cacaController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { equipeId, publico, dataInicio, dataFim } = req.query;

      let query = `
        SELECT c.*, u.name as usuario_nome
        FROM caca_registros c
        INNER JOIN users u ON c.user_id = u.id
        WHERE (c.user_id = ? OR c.publico = 1)
      `;
      const params: any[] = [userId];

      if (equipeId) {
        query += ' AND c.equipe_id = ?';
        params.push(equipeId);
      }

      if (publico !== undefined) {
        query += ' AND c.publico = ?';
        params.push(publico === 'true' ? 1 : 0);
      }

      if (dataInicio) {
        query += ' AND c.data >= ?';
        params.push(dataInicio);
      }

      if (dataFim) {
        query += ' AND c.data <= ?';
        params.push(dataFim);
      }

      query += ' ORDER BY c.data DESC';

      const [registros] = await database.query(query, params) as any[];

      res.json({ registros });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const [registros] = await database.query(
        `SELECT c.*, u.name as usuario_nome
         FROM caca_registros c
         INNER JOIN users u ON c.user_id = u.id
         WHERE c.id = ? AND (c.user_id = ? OR c.publico = 1)`,
        [id, userId]
      ) as any[];

      if (registros.length === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }

      // Buscar fotos adicionais
      const [fotos] = await database.query(
        'SELECT * FROM caca_fotos WHERE caca_id = ? ORDER BY ordem',
        [id]
      ) as any[];

      res.json({
        registro: {
          ...registros[0],
          fotos,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { fotoUrl, latitude, longitude, data, peso, tamanho, observacoes, equipeId, publico } = req.body;

      const [result] = await database.query(
        'INSERT INTO caca_registros (user_id, equipe_id, publico, foto_url, latitude, longitude, data, peso, tamanho, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, equipeId || null, publico || false, fotoUrl, latitude, longitude, data, peso || null, tamanho || null, observacoes || null]
      ) as any[];

      const registroId = result.insertId;

      // Criar notificação para membros da equipe se houver equipe
      if (equipeId) {
        const [membros] = await database.query(
          'SELECT user_id FROM equipe_membros WHERE equipe_id = ? AND user_id != ?',
          [equipeId, userId]
        ) as any[];

        for (const membro of membros) {
          await database.query(
            'INSERT INTO notificacoes (user_id, tipo, titulo, mensagem) VALUES (?, ?, ?, ?)',
            [membro.user_id, 'NOVA_CACA', 'Nova caça registrada', 'Uma nova caça foi registrada na sua equipe']
          );
        }
      }

      const [registros] = await database.query(
        'SELECT * FROM caca_registros WHERE id = ?',
        [registroId]
      ) as any[];

      res.status(201).json({ registro: registros[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { peso, tamanho, observacoes, publico } = req.body;

      // Verificar se registro pertence ao usuário
      const [registros] = await database.query(
        'SELECT id FROM caca_registros WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (registros.length === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (peso !== undefined) {
        updates.push('peso = ?');
        values.push(peso);
      }

      if (tamanho !== undefined) {
        updates.push('tamanho = ?');
        values.push(tamanho);
      }

      if (observacoes !== undefined) {
        updates.push('observacoes = ?');
        values.push(observacoes);
      }

      if (publico !== undefined) {
        updates.push('publico = ?');
        values.push(publico);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      updates.push('updated_at = NOW()');
      values.push(id);

      await database.query(
        `UPDATE caca_registros SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const [updatedRegistros] = await database.query(
        'SELECT * FROM caca_registros WHERE id = ?',
        [id]
      ) as any[];

      res.json({ registro: updatedRegistros[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se registro pertence ao usuário
      const [registros] = await database.query(
        'SELECT id FROM caca_registros WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (registros.length === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }

      await database.query('DELETE FROM caca_registros WHERE id = ?', [id]);

      res.json({ message: 'Registro excluído com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMapa(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { equipeId, publico } = req.query;

      let query = `
        SELECT id, latitude, longitude, data, foto_url
        FROM caca_registros
        WHERE (user_id = ? OR publico = 1)
      `;
      const params: any[] = [userId];

      if (equipeId) {
        query += ' AND equipe_id = ?';
        params.push(equipeId);
      }

      if (publico !== undefined) {
        query += ' AND publico = ?';
        params.push(publico === 'true' ? 1 : 0);
      }

      const [localizacoes] = await database.query(query, params) as any[];

      res.json({ localizacoes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async compartilhar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { tipo, urlCompartilhada } = req.body;

      // Verificar se registro pertence ao usuário ou é público
      const [registros] = await database.query(
        'SELECT id FROM caca_registros WHERE id = ? AND (user_id = ? OR publico = 1)',
        [id, userId]
      ) as any[];

      if (registros.length === 0) {
        return res.status(404).json({ error: 'Registro não encontrado' });
      }

      await database.query(
        'INSERT INTO compartilhamentos (caca_id, tipo, url_compartilhada) VALUES (?, ?, ?)',
        [id, tipo, urlCompartilhada || null]
      );

      res.json({ message: 'Compartilhamento registrado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async count(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [result] = await database.query(
        'SELECT COUNT(*) as count FROM caca_registros WHERE user_id = ?',
        [userId]
      ) as any[];

      res.json({ count: result[0].count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
