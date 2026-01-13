import { Request, Response } from 'express';
import { database } from '../../database/connection';

interface AuthRequest extends Request {
  userId?: string;
}

export const armasController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { equipeId } = req.query;

      let query = `
        SELECT a.*, 
               GROUP_CONCAT(af.url ORDER BY af.ordem) as fotos
        FROM armas a
        LEFT JOIN arma_fotos af ON a.id = af.arma_id
        WHERE a.user_id = ?
      `;
      const params: any[] = [userId];

      if (equipeId) {
        query += ' AND a.equipe_id = ?';
        params.push(equipeId);
      }

      query += ' GROUP BY a.id ORDER BY a.created_at DESC';

      const [armas] = await database.query(query, params) as any[];

      // Processar fotos
      const armasProcessadas = armas.map((arma: any) => ({
        ...arma,
        fotos: arma.fotos ? arma.fotos.split(',') : [],
      }));

      res.json({ armas: armasProcessadas });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const [armas] = await database.query(
        'SELECT * FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      // Buscar fotos
      const [fotos] = await database.query(
        'SELECT * FROM arma_fotos WHERE arma_id = ? ORDER BY ordem',
        [id]
      ) as any[];

      // Buscar documentos
      const [documentos] = await database.query(
        'SELECT * FROM arma_documentos WHERE arma_id = ?',
        [id]
      ) as any[];

      // Buscar manutenções
      const [manutencoes] = await database.query(
        'SELECT * FROM arma_manutencoes WHERE arma_id = ? ORDER BY data DESC',
        [id]
      ) as any[];

      res.json({
        arma: {
          ...armas[0],
          fotos,
          documentos,
          manutencoes,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { numeroSerie, modelo, calibre, fabricante, tipo, observacoes, equipeId } = req.body;

      // Verificar se número de série já existe
      const [existing] = await database.query(
        'SELECT id FROM armas WHERE numero_serie = ? AND user_id = ?',
        [numeroSerie, userId]
      ) as any[];

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Número de série já cadastrado' });
      }

      const [result] = await database.query(
        'INSERT INTO armas (user_id, equipe_id, numero_serie, modelo, calibre, fabricante, tipo, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, equipeId || null, numeroSerie, modelo, calibre, fabricante || null, tipo || null, observacoes || null]
      ) as any[];

      const armaId = result.insertId;

      const [armas] = await database.query(
        'SELECT * FROM armas WHERE id = ?',
        [armaId]
      ) as any[];

      res.status(201).json({ arma: armas[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { modelo, calibre, fabricante, tipo, observacoes } = req.body;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (modelo) {
        updates.push('modelo = ?');
        values.push(modelo);
      }

      if (calibre) {
        updates.push('calibre = ?');
        values.push(calibre);
      }

      if (fabricante !== undefined) {
        updates.push('fabricante = ?');
        values.push(fabricante);
      }

      if (tipo !== undefined) {
        updates.push('tipo = ?');
        values.push(tipo);
      }

      if (observacoes !== undefined) {
        updates.push('observacoes = ?');
        values.push(observacoes);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      updates.push('updated_at = NOW()');
      values.push(id);

      await database.query(
        `UPDATE armas SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const [updatedArmas] = await database.query(
        'SELECT * FROM armas WHERE id = ?',
        [id]
      ) as any[];

      res.json({ arma: updatedArmas[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      await database.query('DELETE FROM armas WHERE id = ?', [id]);

      res.json({ message: 'Arma excluída com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async addFoto(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { url, ordem } = req.body;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      await database.query(
        'INSERT INTO arma_fotos (arma_id, url, ordem) VALUES (?, ?, ?)',
        [id, url, ordem || 0]
      );

      res.json({ message: 'Foto adicionada com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async removeFoto(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id, fotoId } = req.params;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      await database.query('DELETE FROM arma_fotos WHERE id = ? AND arma_id = ?', [fotoId, id]);

      res.json({ message: 'Foto removida com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async addManutencao(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { data, tipo, descricao, custo } = req.body;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      await database.query(
        'INSERT INTO arma_manutencoes (arma_id, data, tipo, descricao, custo) VALUES (?, ?, ?, ?, ?)',
        [id, data, tipo, descricao || null, custo || null]
      );

      res.json({ message: 'Manutenção registrada com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listManutencoes(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se arma pertence ao usuário
      const [armas] = await database.query(
        'SELECT id FROM armas WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (armas.length === 0) {
        return res.status(404).json({ error: 'Arma não encontrada' });
      }

      const [manutencoes] = await database.query(
        'SELECT * FROM arma_manutencoes WHERE arma_id = ? ORDER BY data DESC',
        [id]
      ) as any[];

      res.json({ manutencoes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async count(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [result] = await database.query(
        'SELECT COUNT(*) as count FROM armas WHERE user_id = ?',
        [userId]
      ) as any[];

      res.json({ count: result[0].count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
