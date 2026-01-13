# Quick Start - AnotFire CAC

## Configuração Rápida

### 1. Frontend (Expo)

```bash
# Instalar dependências
npm install

# Criar arquivo .env na raiz:
# EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api

# Iniciar
npm start
```

### 2. Backend (Hostinger)

O backend já deve estar deployado na Hostinger. Se não estiver:

1. Ver `docs/deploy-hostinger-backend.md`
2. Fazer upload dos arquivos
3. Configurar `.env` na Hostinger
4. Iniciar com PM2

### 3. Banco de Dados (Hostinger)

Executar no phpMyAdmin:
- `database/migrations/002_add_subscriptions.sql`
- `database/seeds/001_create_admin.sql`

### 4. Testar

1. Abrir app no dispositivo
2. Fazer login com admin:
   - Email: `danielinvestigador@gmail.com`
   - Senha: `Admin@2024`

## URLs Importantes

- **API**: `https://api.fire.dgapp.com.br/api`
- **Health Check**: `https://api.fire.dgapp.com.br/health`
- **Frontend Web**: `https://fire.dgapp.com.br` (quando deployado)

## Problemas Comuns

### Network Error
- Verificar se backend está rodando na Hostinger
- Verificar URL da API no `.env`
- Testar health check no navegador

### Erro de Autenticação
- Verificar se banco de dados está configurado
- Verificar se usuário admin foi criado
- Verificar JWT_SECRET no backend
