import { Request, Response, NextFunction } from 'express';
import { database } from '../database/connection';
import { differenceInDays, isAfter, isBefore } from 'date-fns';

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export async function checkSubscription(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    // Admin sempre tem acesso
    if (userRole === 'admin') {
      return next();
    }

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Buscar assinatura ativa do usuário
    const [assinaturas] = await database.query(
      `SELECT * FROM assinaturas 
       WHERE user_id = ? 
       AND status = 'ATIVA'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    ) as any[];

    if (assinaturas.length === 0) {
      return res.status(403).json({
        error: 'Acesso bloqueado',
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Você precisa de uma assinatura ativa para acessar este recurso.',
      });
    }

    const assinatura = assinaturas[0];
    const hoje = new Date();
    const dataFim = assinatura.data_fim ? new Date(assinatura.data_fim) : null;

    // Se tem data_fim, verificar se não expirou
    if (dataFim && isAfter(hoje, dataFim)) {
      // Atualizar status para EXPIRADA
      await database.query(
        'UPDATE assinaturas SET status = ? WHERE id = ?',
        ['EXPIRADA', assinatura.id]
      );

      return res.status(403).json({
        error: 'Assinatura expirada',
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Sua assinatura expirou. Entre em contato para renovar.',
      });
    }

    // Se é trial, verificar dias restantes
    if (assinatura.tipo === 'TRIAL' && dataFim) {
      const diasRestantes = differenceInDays(dataFim, hoje);

      if (diasRestantes < 0) {
        await database.query(
          'UPDATE assinaturas SET status = ? WHERE id = ?',
          ['EXPIRADA', assinatura.id]
        );

        return res.status(403).json({
          error: 'Trial expirado',
          code: 'TRIAL_EXPIRED',
          message: 'Seu período de trial expirou. Entre em contato para liberar seu acesso.',
          diasRestantes: 0,
        });
      }

      // Adicionar informações da assinatura na requisição
      req.subscription = {
        ...assinatura,
        diasRestantes,
      };
    } else {
      req.subscription = assinatura;
    }

    next();
  } catch (error: any) {
    console.error('Erro ao verificar assinatura:', error);
    return res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
}

// Extender tipo Request para incluir subscription
declare global {
  namespace Express {
    interface Request {
      subscription?: any;
    }
  }
}
