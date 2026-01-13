# Guia de Deploy

## Pré-requisitos

- Node.js 18+ instalado
- Conta na Hostinger
- Banco MySQL criado na Hostinger
- Conta Expo (para build mobile)
- AWS S3 ou similar (para armazenar imagens)

## Deploy do Backend

### 1. Preparar Ambiente

```bash
cd backend
npm install
npm run build
```

### 2. Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do backend:

```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados (Hostinger - fire.dgapp.com.br)
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire

# JWT
JWT_SECRET=seu-jwt-secret-super-seguro
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@anotfire.com

# Frontend
FRONTEND_URL=https://seu-app.expo.dev

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=sua-key
AWS_SECRET_ACCESS_KEY=sua-secret
AWS_REGION=us-east-1
AWS_BUCKET=anotfire-storage
```

### 3. Executar Migrações

```bash
# Conectar ao MySQL e executar
mysql -h seu-host -u seu-user -p < database/schema.sql
```

### 4. Deploy na Hostinger

1. Acessar painel Hostinger
2. Ir em "Gerenciador de Arquivos"
3. Fazer upload dos arquivos do backend
4. Configurar Node.js no painel (se disponível)
5. Ou usar SSH para fazer deploy

**Via SSH:**
```bash
# Conectar via SSH
ssh usuario@seu-host.hostinger.com

# Navegar para pasta do projeto
cd public_html/api

# Fazer pull do código (se usar Git)
git pull origin main

# Instalar dependências
npm install --production

# Build
npm run build

# Iniciar com PM2 (recomendado)
pm2 start dist/server.js --name anotfire-api
pm2 save
pm2 startup
```

### 5. Configurar Nginx (se necessário)

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deploy do Frontend

### 1. Build para Web

```bash
# Na raiz do projeto
npm install
npx expo export:web

# Upload da pasta web-build/ para Hostinger ou Vercel/Netlify
```

### 2. Build para Android/iOS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://api.seudominio.com/api
```

## Configuração do Banco de Dados

### 1. Criar Banco na Hostinger

1. Acessar painel Hostinger
2. Ir em "MySQL Databases"
3. Criar novo banco de dados
4. Criar usuário e senha
5. Anotar credenciais

### 2. Executar Schema

```bash
mysql -h seu-host -u seu-user -p seu-banco < database/schema.sql
```

### 3. Verificar Conexão

Testar conexão do backend com o banco.

## Configuração de Storage (Imagens)

### Opção 1: AWS S3

1. Criar bucket S3
2. Configurar CORS
3. Configurar credenciais no backend
4. Implementar upload no backend

### Opção 2: Hostinger Storage

1. Usar storage da Hostinger
2. Configurar upload via FTP/API

## Configuração de Notificações

### Push Notifications (Expo)

1. Criar projeto no Expo
2. Configurar credenciais push
3. Adicionar ao `app.json`

### Email (SMTP)

1. Configurar conta SMTP (Gmail, SendGrid, etc)
2. Adicionar credenciais no `.env` do backend
3. Testar envio

## Monitoramento

### PM2 (Backend)

```bash
# Ver logs
pm2 logs anotfire-api

# Ver status
pm2 status

# Reiniciar
pm2 restart anotfire-api
```

### Logs

- Backend: logs do PM2 ou arquivo de log
- Frontend: logs do Expo/React Native

## Backup

### Banco de Dados

```bash
# Backup diário (cron job)
mysqldump -h seu-host -u seu-user -p seu-banco > backup_$(date +%Y%m%d).sql
```

### Arquivos

- Backup de imagens no S3
- Backup de código no Git

## Segurança

- Usar HTTPS
- Configurar CORS corretamente
- Validar todos os inputs
- Rate limiting ativo
- Senhas fortes no banco
- JWT secrets seguros
- Não commitar `.env`

## Troubleshooting

### Backend não inicia
- Verificar logs do PM2
- Verificar variáveis de ambiente
- Verificar porta disponível

### Banco não conecta
- Verificar credenciais
- Verificar firewall Hostinger
- Verificar host correto

### Frontend não carrega
- Verificar URL da API
- Verificar CORS
- Verificar build correto
