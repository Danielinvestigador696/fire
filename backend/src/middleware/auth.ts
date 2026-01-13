import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { database } from '../database/connection';

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  user?: any;
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };

    req.userId = decoded.userId;

    // Buscar role do usuário
    const [users] = await database.query(
      'SELECT role FROM users WHERE id = ?',
      [decoded.userId]
    ) as any[];

    if (users.length > 0) {
      req.userRole = users[0].role;
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}
