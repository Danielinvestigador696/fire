# Deploy na Hostinger - Guia Rápido

## Arquivos Necessários

Faça upload destes arquivos/pastas para `public_html/api` na Hostinger:

```
backend/
├── dist/              # Pasta com arquivos compilados (IMPORTANTE!)
├── package.json       # Dependências
├── .env              # Variáveis de ambiente (criar na Hostinger)
└── start.sh          # Script para iniciar (opcional)
```

## Passo a Passo

### 1. Build Local (Opcional)

Se quiser fazer build local antes de enviar:

```bash
cd backend
npm install
npm run build
```

Isso criará a pasta `dist/` com os arquivos JavaScript compilados.

### 2. Upload para Hostinger

Via File Manager ou FTP, faça upload de:
- Pasta `dist/` completa
- Arquivo `package.json`
- Arquivo `start.sh` (opcional)

### 3. Instalar Dependências na Hostinger

Via SSH:

```bash
cd public_html/api
npm install --production
```

### 4. Criar Arquivo .env

Na Hostinger, criar arquivo `.env` na pasta `api/`:

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire

JWT_SECRET=seu-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@fire.dgapp.com.br

FRONTEND_URL=https://fire.dgapp.com.br
```

### 5. Iniciar Servidor

**Opção A: PM2 (Recomendado)**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar servidor
pm2 start dist/server.js --name anotfire-api

# Salvar configuração
pm2 save

# Configurar para iniciar automaticamente
pm2 startup
```

**Opção B: Node Direto (Temporário)**

```bash
node dist/server.js
```

**Opção C: Script**

```bash
bash start.sh
```

### 6. Verificar se Está Rodando

Teste no navegador:
```
http://seu-ip:3000/health
```

Ou se tiver subdomínio configurado:
```
https://api.fire.dgapp.com.br/health
```

## Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install --production` na Hostinger

### Erro: "Port already in use"
- Verificar se já existe processo rodando: `pm2 list`
- Parar processo: `pm2 stop anotfire-api`

### Servidor não responde
- Verificar logs: `pm2 logs anotfire-api`
- Verificar se porta 3000 está aberta
- Verificar firewall da Hostinger
