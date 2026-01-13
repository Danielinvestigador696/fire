# ✅ Checklist de Deploy - Hostinger

## Backend

- [ ] Fazer build do backend (`npm run build`)
- [ ] Upload da pasta `dist/` para `public_html/api/`
- [ ] Upload do `package.json` para `public_html/api/`
- [ ] Via SSH: `cd public_html/api && npm install --production`
- [ ] Criar arquivo `.env` na Hostinger com todas as variáveis
- [ ] Executar migrações do banco (phpMyAdmin)
- [ ] Executar seed do admin (phpMyAdmin)
- [ ] Instalar PM2: `npm install -g pm2`
- [ ] Iniciar servidor: `pm2 start dist/server.js --name anotfire-api`
- [ ] Salvar PM2: `pm2 save`
- [ ] Testar: `https://api.fire.dgapp.com.br/health`

## Frontend

- [ ] Criar arquivo `.env` na raiz com: `EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api`
- [ ] Reiniciar Expo: `npm start -- --clear`
- [ ] Testar login no app

## Banco de Dados

- [ ] Executar `database/schema-hostinger.sql` no phpMyAdmin
- [ ] Executar `database/migrations/002_add_subscriptions.sql`
- [ ] Gerar hash da senha do admin: `node backend/scripts/generate-password-hash.js "Admin@2024"`
- [ ] Atualizar `database/seeds/001_create_admin.sql` com o hash
- [ ] Executar seed do admin no phpMyAdmin

## Subdomínio

- [ ] Criar subdomínio `api` no painel Hostinger
- [ ] Apontar para pasta `public_html/api`
- [ ] Configurar SSL/HTTPS (se disponível)
- [ ] Testar acesso: `https://api.fire.dgapp.com.br/health`

## Verificações Finais

- [ ] Backend responde em `/health`
- [ ] Login funciona
- [ ] Admin consegue acessar painel
- [ ] Registro de usuário cria trial automaticamente
- [ ] Todas as rotas protegidas funcionam
