import { Request, Response, NextFunction } from 'express';
import { database } from '../database/connection';

interface AuthRequest extends Request {
  userId?: string;
}

export async function checkAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Buscar role do usuário
    const [users] = await database.query(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (users[0].role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    next();
  } catch (error: any) {
    console.error('Erro ao verificar admin:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
}
