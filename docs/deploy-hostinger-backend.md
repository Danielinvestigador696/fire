# Deploy do Backend na Hostinger

## Pré-requisitos

- Conta Hostinger ativa
- Acesso SSH ou File Manager
- Node.js configurado na Hostinger (verificar se está disponível)

## Passo 1: Preparar Arquivos

### 1.1 Build do Backend

```bash
cd backend
npm install
npm run build
```

Isso criará a pasta `dist/` com os arquivos compilados.

### 1.2 Arquivos Necessários para Upload

Faça upload dos seguintes arquivos/pastas para a Hostinger:

```
backend/
├── dist/              # Arquivos compilados (IMPORTANTE)
├── package.json       # Dependências
├── .env              # Variáveis de ambiente (criar na Hostinger)
└── node_modules/     # OU instalar na Hostinger
```

## Passo 2: Upload para Hostinger

### Opção A: Via File Manager (Hostinger)

1. Acesse o painel Hostinger
2. Vá em "Gerenciador de Arquivos"
3. Navegue até a pasta do seu domínio (ex: `public_html/api`)
4. Faça upload dos arquivos

### Opção B: Via FTP

Use um cliente FTP (FileZilla, WinSCP) para fazer upload.

### Opção C: Via Git (se disponível)

```bash
# Na Hostinger via SSH
cd public_html/api
git clone seu-repositorio .
npm install --production
npm run build
```

## Passo 3: Configurar Variáveis de Ambiente

Crie arquivo `.env` na pasta do backend na Hostinger:

```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados MySQL (Hostinger)
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire

# JWT (GERAR SECRETS SEGUROS!)
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@fire.dgapp.com.br

# Frontend URL (para CORS)
FRONTEND_URL=https://fire.dgapp.com.br

# Storage (opcional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_BUCKET=anotfire-storage
```

## Passo 4: Instalar Dependências

Via SSH na Hostinger:

```bash
cd public_html/api  # ou pasta onde fez upload
npm install --production
```

## Passo 5: Executar Migrações do Banco

Execute as migrações no phpMyAdmin ou via SSH:

```bash
# Via phpMyAdmin (recomendado):
# 1. Acessar phpMyAdmin
# 2. Selecionar banco u984823938_fire
# 3. Executar database/migrations/002_add_subscriptions.sql
# 4. Executar database/seeds/001_create_admin.sql (após gerar hash da senha)
```

## Passo 6: Iniciar Servidor

### Opção A: PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
cd public_html/api
pm2 start dist/server.js --name anotfire-api

# Salvar configuração
pm2 save

# Configurar para iniciar automaticamente
pm2 startup
```

### Opção B: Node.js Direto (Temporário)

```bash
cd public_html/api
node dist/server.js
```

**Nota:** Isso só funciona enquanto a sessão SSH estiver aberta.

### Opção C: Serviço do Sistema (Linux)

Criar arquivo `/etc/systemd/system/anotfire-api.service`:

```ini
[Unit]
Description=AnotFire API
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/home/usuario/public_html/api
ExecStart=/usr/bin/node dist/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Depois:
```bash
sudo systemctl enable anotfire-api
sudo systemctl start anotfire-api
```

## Passo 7: Configurar Domínio/Subdomínio

### Criar Subdomínio api.fire.dgapp.com.br

1. No painel Hostinger, vá em "Domínios"
2. Crie subdomínio `api`
3. Aponte para a pasta onde está o backend

### Configurar Proxy Reverso (Nginx/Apache)

Se a Hostinger usar Nginx, criar configuração:

```nginx
server {
    listen 80;
    server_name api.fire.dgapp.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Passo 8: Verificar Funcionamento

### Testar Health Check

No navegador ou Postman:
```
https://api.fire.dgapp.com.br/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### Testar Login

```bash
POST https://api.fire.dgapp.com.br/api/auth/login
Content-Type: application/json

{
  "email": "danielinvestigador@gmail.com",
  "password": "Admin@2024"
}
```

## Troubleshooting

### Servidor não inicia
- Verificar logs: `pm2 logs anotfire-api`
- Verificar se porta 3000 está livre
- Verificar variáveis de ambiente

### Erro de conexão com banco
- Verificar credenciais no `.env`
- Verificar se MySQL está rodando
- Verificar se banco existe

### CORS bloqueando
- Verificar `FRONTEND_URL` no `.env`
- Verificar configuração CORS no `server.ts`

### Porta não acessível
- Verificar firewall da Hostinger
- Verificar se servidor está escutando em `0.0.0.0`

## Monitoramento

### Ver logs do PM2
```bash
pm2 logs anotfire-api
```

### Ver status
```bash
pm2 status
```

### Reiniciar
```bash
pm2 restart anotfire-api
```

### Parar
```bash
pm2 stop anotfire-api
```

## Segurança

- ✅ Usar HTTPS (certificado SSL)
- ✅ Secrets fortes para JWT
- ✅ Senhas fortes no banco
- ✅ CORS configurado corretamente
- ✅ Rate limiting ativo
- ✅ Helmet configurado
