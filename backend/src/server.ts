import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { database } from './database/connection';
import { authRoutes } from './modules/auth/routes';
import { usersRoutes } from './modules/users/routes';
import { equipesRoutes } from './modules/equipes/routes';
import { armasRoutes } from './modules/armas/routes';
import { documentosRoutes } from './modules/documentos/routes';
import { cacaRoutes } from './modules/caca/routes';
import { notificacoesRoutes } from './modules/notificacoes/routes';
import { assinaturasRoutes } from './modules/assinaturas/routes';
import { adminRoutes } from './modules/admin/routes';
import { errorHandler } from './middleware/errorHandler';
import { checkSubscription } from './middleware/checkSubscription';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// CORS configurado para aceitar requisições de qualquer origem
// Em produção, pode restringir para domínios específicos
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/assinaturas', assinaturasRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

// Rotas protegidas (requerem assinatura ativa)
app.use('/api/equipes', checkSubscription, equipesRoutes);
app.use('/api/armas', checkSubscription, armasRoutes);
app.use('/api/documentos', checkSubscription, documentosRoutes);
app.use('/api/caca', checkSubscription, cacaRoutes);
app.use('/api/notificacoes', checkSubscription, notificacoesRoutes);

// Error handler
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    await database.connect();
    console.log('✅ Banco de dados conectado');
    
    // Escutar em 0.0.0.0 para aceitar conexões de qualquer interface de rede
    // Necessário para funcionar na Hostinger e aceitar requisições externas
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 Acessível em: http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
