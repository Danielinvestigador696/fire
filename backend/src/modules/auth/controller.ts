import { Request, Response } from 'express';
import { database } from '../../database/connection';
import { hashPassword, comparePassword } from '../../utils/hash';
import { generateToken, generateRefreshToken } from '../../utils/jwt';
import { authenticateToken } from '../../middleware/auth';
import { addDays } from 'date-fns';

interface AuthRequest extends Request {
  userId?: string;
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Verificar se email já existe
      const [existingUsers] = await database.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      ) as any[];

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await hashPassword(password);

      // Criar usuário
      const [result] = await database.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      ) as any[];

      const userId = result.insertId;

      // Gerar tokens
      const token = generateToken(userId.toString());
      const refreshToken = generateRefreshToken(userId.toString());

      // Salvar refresh token
      await database.query(
        'INSERT INTO user_sessions (user_id, refresh_token) VALUES (?, ?)',
        [userId, refreshToken]
      );

      // Criar assinatura TRIAL automaticamente (15 dias)
      const hoje = new Date();
      const dataFim = addDays(hoje, 15);
      await database.query(
        `INSERT INTO assinaturas (user_id, tipo, status, data_inicio, data_fim, dias_trial) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'TRIAL', 'ATIVA', hoje.toISOString().split('T')[0], dataFim.toISOString().split('T')[0], 15]
      );

      // Buscar usuário criado
      const [users] = await database.query(
        'SELECT id, name, email, avatar, role, created_at FROM users WHERE id = ?',
        [userId]
      ) as any[];

      res.status(201).json({
        token,
        refreshToken,
        user: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          avatar: users[0].avatar,
          role: users[0].role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const [users] = await database.query(
        'SELECT id, name, email, password, avatar, role FROM users WHERE email = ?',
        [email]
      ) as any[];

      if (users.length === 0) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      const user = users[0];

      // Verificar senha
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Gerar tokens
      const token = generateToken(user.id.toString());
      const refreshToken = generateRefreshToken(user.id.toString());

      // Salvar refresh token
      await database.query(
        'INSERT INTO user_sessions (user_id, refresh_token) VALUES (?, ?)',
        [user.id, refreshToken]
      );

      // Buscar status da assinatura
      const [assinaturas] = await database.query(
        `SELECT * FROM assinaturas 
         WHERE user_id = ? 
         ORDER BY created_at DESC
         LIMIT 1`,
        [user.id]
      ) as any[];

      let assinaturaStatus = null;
      if (assinaturas.length > 0) {
        const assinatura = assinaturas[0];
        const hoje = new Date();
        const dataFim = assinatura.data_fim ? new Date(assinatura.data_fim) : null;
        
        let diasRestantes = null;
        if (dataFim) {
          const diff = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
          diasRestantes = Math.max(0, diff);
        }

        assinaturaStatus = {
          status: assinatura.status,
          tipo: assinatura.tipo,
          ativa: assinatura.status === 'ATIVA' && (!dataFim || diasRestantes! >= 0),
          diasRestantes,
        };
      }

      res.json({
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        assinatura: assinaturaStatus,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Verificar se email existe
      const [users] = await database.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      ) as any[];

      if (users.length === 0) {
        // Por segurança, não informar se o email existe ou não
        return res.json({ message: 'Se o email existir, você receberá instruções' });
      }

      // TODO: Implementar envio de email com link de recuperação
      // Por enquanto, apenas retornar sucesso
      res.json({ message: 'Email de recuperação enviado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token não fornecido' });
      }

      // Verificar refresh token no banco
      const [sessions] = await database.query(
        'SELECT user_id FROM user_sessions WHERE refresh_token = ?',
        [refreshToken]
      ) as any[];

      if (sessions.length === 0) {
        return res.status(403).json({ error: 'Refresh token inválido' });
      }

      const userId = sessions[0].user_id;

      // Gerar novo token
      const newToken = generateToken(userId.toString());

      res.json({ token: newToken });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMe(req: AuthRequest, res: Response) {
    try {
      // Este middleware deve ser usado com authenticateToken
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const [users] = await database.query(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
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
};
