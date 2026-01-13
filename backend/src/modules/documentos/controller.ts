import { Request, Response } from 'express';
import { database } from '../../database/connection';
import { differenceInDays, addDays } from 'date-fns';

interface AuthRequest extends Request {
  userId?: string;
}

export const documentosController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { tipo } = req.query;

      let query = 'SELECT * FROM documentos WHERE user_id = ?';
      const params: any[] = [userId];

      if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
      }

      query += ' ORDER BY data_vencimento ASC';

      const [documentos] = await database.query(query, params) as any[];

      res.json({ documentos });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listVencendo(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const hoje = new Date();
      const em90Dias = addDays(hoje, 90);

      const [documentos] = await database.query(
        `SELECT * FROM documentos 
         WHERE user_id = ? 
         AND data_vencimento BETWEEN ? AND ?
         ORDER BY data_vencimento ASC`,
        [userId, hoje, em90Dias]
      ) as any[];

      // Adicionar informação de dias restantes
      const documentosComDias = documentos.map((doc: any) => {
        const diasRestantes = differenceInDays(new Date(doc.data_vencimento), hoje);
        return {
          ...doc,
          diasRestantes,
          status: diasRestantes < 0 ? 'vencido' : diasRestantes <= 30 ? 'vencendo' : 'atencao',
        };
      });

      res.json({ documentos: documentosComDias, count: documentosComDias.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const [documentos] = await database.query(
        'SELECT * FROM documentos WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (documentos.length === 0) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      res.json({ documento: documentos[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { tipo, numero, orgaoEmissor, dataEmissao, dataVencimento, arquivoUrl, observacoes } = req.body;

      const [result] = await database.query(
        'INSERT INTO documentos (user_id, tipo, numero, orgao_emissor, data_emissao, data_vencimento, arquivo_url, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, tipo, numero, orgaoEmissor || null, dataEmissao, dataVencimento, arquivoUrl || null, observacoes || null]
      ) as any[];

      const documentoId = result.insertId;

      // Criar alertas automáticos (90, 30, 0 dias)
      await database.query(
        'INSERT INTO documento_alertas (documento_id, dias_antes) VALUES (?, ?), (?, ?), (?, ?)',
        [documentoId, 90, documentoId, 30, documentoId, 0]
      );

      const [documentos] = await database.query(
        'SELECT * FROM documentos WHERE id = ?',
        [documentoId]
      ) as any[];

      res.status(201).json({ documento: documentos[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { numero, orgaoEmissor, dataEmissao, dataVencimento, arquivoUrl, observacoes } = req.body;

      // Verificar se documento pertence ao usuário
      const [documentos] = await database.query(
        'SELECT id FROM documentos WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (documentos.length === 0) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (numero) {
        updates.push('numero = ?');
        values.push(numero);
      }

      if (orgaoEmissor !== undefined) {
        updates.push('orgao_emissor = ?');
        values.push(orgaoEmissor);
      }

      if (dataEmissao) {
        updates.push('data_emissao = ?');
        values.push(dataEmissao);
      }

      if (dataVencimento) {
        updates.push('data_vencimento = ?');
        values.push(dataVencimento);
      }

      if (arquivoUrl !== undefined) {
        updates.push('arquivo_url = ?');
        values.push(arquivoUrl);
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
        `UPDATE documentos SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const [updatedDocumentos] = await database.query(
        'SELECT * FROM documentos WHERE id = ?',
        [id]
      ) as any[];

      res.json({ documento: updatedDocumentos[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se documento pertence ao usuário
      const [documentos] = await database.query(
        'SELECT id FROM documentos WHERE id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (documentos.length === 0) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      await database.query('DELETE FROM documentos WHERE id = ?', [id]);

      res.json({ message: 'Documento excluído com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
