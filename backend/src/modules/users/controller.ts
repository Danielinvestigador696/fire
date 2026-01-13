import { Request, Response } from 'express';
import { database } from '../../database/connection';
import { authenticateToken } from '../../middleware/auth';

interface AuthRequest extends Request {
  userId?: string;
}

export const usersController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const [users] = await database.query(
        'SELECT id, name, email, avatar, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      ) as any[];

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ user: users[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { name, email } = req.body;

      // Verificar se email já está em uso por outro usuário
      if (email) {
        const [existingUsers] = await database.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        ) as any[];

        if (existingUsers.length > 0) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }

      if (email) {
        updates.push('email = ?');
        values.push(email);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      updates.push('updated_at = NOW()');
      values.push(userId);

      await database.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Buscar usuário atualizado
      const [users] = await database.query(
        'SELECT id, name, email, avatar, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      ) as any[];

      res.json({ user: users[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateAvatar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { avatarUrl } = req.body;

      await database.query(
        'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
        [avatarUrl, userId]
      );

      res.json({ message: 'Avatar atualizado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
