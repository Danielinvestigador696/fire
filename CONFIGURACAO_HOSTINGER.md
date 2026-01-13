# Configuração para Hostinger - Guia Completo

## Visão Geral

Este projeto está configurado para rodar **diretamente na Hostinger**, sem necessidade de backend local.

## Estrutura

- **Backend**: Hostinger (Node.js + Express)
- **Frontend Web**: Hostinger, Vercel ou Netlify
- **Apps Mobile**: Conectam diretamente à API da Hostinger
- **Banco de Dados**: MySQL na Hostinger

## URL da API

A API está configurada para usar:
```
https://api.fire.dgapp.com.br/api
```

## Configuração do Frontend

### Arquivo .env

Crie arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api
```

### Para Desenvolvimento

Se quiser testar localmente antes do deploy, pode usar a mesma URL da Hostinger ou configurar:

```env
# Desenvolvimento (se backend estiver rodando localmente)
EXPO_PUBLIC_API_URL=http://192.168.1.17:3000/api

# Produção (Hostinger)
# EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api
```

## Deploy do Backend

Siga as instruções em `docs/deploy-hostinger-backend.md` para fazer deploy do backend na Hostinger.

**Resumo rápido:**
1. Build: `cd backend && npm run build`
2. Upload arquivos para Hostinger
3. Instalar dependências: `npm install --production`
4. Configurar `.env` na Hostinger
5. Executar migrações do banco
6. Iniciar com PM2: `pm2 start dist/server.js`

## Banco de Dados

### Credenciais (Hostinger)

- **Host**: `localhost` (quando no servidor)
- **Usuário**: `u984823938_fireuser`
- **Senha**: `fireuser00!`
- **Banco**: `u984823938_fire`

### Executar Migrações

1. Acessar phpMyAdmin
2. Selecionar banco `u984823938_fire`
3. Executar `database/migrations/002_add_subscriptions.sql`
4. Executar `database/seeds/001_create_admin.sql` (após gerar hash da senha)

## Testar Conexão

### Health Check

```
https://api.fire.dgapp.com.br/health
```

### Login Admin

```
POST https://api.fire.dgapp.com.br/api/auth/login
{
  "email": "danielinvestigador@gmail.com",
  "password": "Admin@2024"
}
```

## Próximos Passos

1. ✅ Fazer deploy do backend na Hostinger
2. ✅ Configurar subdomínio `api.fire.dgapp.com.br`
3. ✅ Testar conexão da API
4. ✅ Configurar frontend para usar URL da Hostinger
5. ✅ Testar login e funcionalidades

## Documentação Relacionada

- `docs/deploy-hostinger-backend.md` - Guia completo de deploy
- `docs/configuracao-hostinger.md` - Configuração do banco
- `backend/CONFIGURACAO_HOSTINGER.md` - Credenciais do banco
