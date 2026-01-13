import { Request, Response } from 'express';
import { database } from '../../database/connection';

interface AuthRequest extends Request {
  userId?: string;
}

export const equipesController = {
  async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [equipes] = await database.query(
        `SELECT e.*, em.role 
         FROM equipes e
         INNER JOIN equipe_membros em ON e.id = em.equipe_id
         WHERE em.user_id = ?`,
        [userId]
      ) as any[];

      res.json({ equipes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { nome, descricao } = req.body;

      const [result] = await database.query(
        'INSERT INTO equipes (nome, descricao, admin_id) VALUES (?, ?, ?)',
        [nome, descricao, userId]
      ) as any[];

      const equipeId = result.insertId;

      // Adicionar criador como admin
      await database.query(
        'INSERT INTO equipe_membros (equipe_id, user_id, role) VALUES (?, ?, ?)',
        [equipeId, userId, 'admin']
      );

      const [equipes] = await database.query(
        'SELECT * FROM equipes WHERE id = ?',
        [equipeId]
      ) as any[];

      res.status(201).json({ equipe: equipes[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se usuário é membro da equipe
      const [members] = await database.query(
        'SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (members.length === 0) {
        return res.status(403).json({ error: 'Você não tem acesso a esta equipe' });
      }

      const [equipes] = await database.query(
        'SELECT * FROM equipes WHERE id = ?',
        [id]
      ) as any[];

      if (equipes.length === 0) {
        return res.status(404).json({ error: 'Equipe não encontrada' });
      }

      res.json({ equipe: equipes[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { nome, descricao } = req.body;

      // Verificar se usuário é admin da equipe
      const [members] = await database.query(
        'SELECT role FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (members.length === 0 || members[0].role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem editar a equipe' });
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (nome) {
        updates.push('nome = ?');
        values.push(nome);
      }

      if (descricao !== undefined) {
        updates.push('descricao = ?');
        values.push(descricao);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      updates.push('updated_at = NOW()');
      values.push(id);

      await database.query(
        `UPDATE equipes SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const [equipes] = await database.query(
        'SELECT * FROM equipes WHERE id = ?',
        [id]
      ) as any[];

      res.json({ equipe: equipes[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se usuário é admin da equipe
      const [members] = await database.query(
        'SELECT role FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (members.length === 0 || members[0].role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem excluir a equipe' });
      }

      await database.query('DELETE FROM equipes WHERE id = ?', [id]);

      res.json({ message: 'Equipe excluída com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async inviteMember(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { email } = req.body;

      // Verificar se usuário é admin da equipe
      const [members] = await database.query(
        'SELECT role FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (members.length === 0 || members[0].role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem convidar membros' });
      }

      // Buscar usuário por email
      const [users] = await database.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      ) as any[];

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const invitedUserId = users[0].id;

      // Verificar se já é membro
      const [existingMembers] = await database.query(
        'SELECT id FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, invitedUserId]
      ) as any[];

      if (existingMembers.length > 0) {
        return res.status(400).json({ error: 'Usuário já é membro da equipe' });
      }

      // Adicionar membro
      await database.query(
        'INSERT INTO equipe_membros (equipe_id, user_id, role) VALUES (?, ?, ?)',
        [id, invitedUserId, 'membro']
      );

      res.json({ message: 'Membro adicionado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listMembers(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Verificar se usuário é membro da equipe
      const [userMembers] = await database.query(
        'SELECT * FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (userMembers.length === 0) {
        return res.status(403).json({ error: 'Você não tem acesso a esta equipe' });
      }

      const [members] = await database.query(
        `SELECT em.*, u.name, u.email, u.avatar
         FROM equipe_membros em
         INNER JOIN users u ON em.user_id = u.id
         WHERE em.equipe_id = ?`,
        [id]
      ) as any[];

      res.json({ membros: members });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async removeMember(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id, userId: targetUserId } = req.params;

      // Verificar se usuário é admin da equipe
      const [members] = await database.query(
        'SELECT role FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, userId]
      ) as any[];

      if (members.length === 0 || members[0].role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem remover membros' });
      }

      // Não permitir remover a si mesmo
      if (userId === targetUserId) {
        return res.status(400).json({ error: 'Você não pode remover a si mesmo' });
      }

      await database.query(
        'DELETE FROM equipe_membros WHERE equipe_id = ? AND user_id = ?',
        [id, targetUserId]
      );

      res.json({ message: 'Membro removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async count(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [result] = await database.query(
        `SELECT COUNT(*) as count
         FROM equipes e
         INNER JOIN equipe_membros em ON e.id = em.equipe_id
         WHERE em.user_id = ?`,
        [userId]
      ) as any[];

      res.json({ count: result[0].count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
