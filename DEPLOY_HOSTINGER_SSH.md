# 🚀 Deploy do Backend na Hostinger via SSH

## ⚠️ IMPORTANTE

**Você NÃO precisa rodar o backend localmente!** O backend deve rodar apenas na Hostinger.

## Passo 1: Conectar via SSH na Hostinger

### 1.1 Obter Credenciais SSH

1. Acesse o painel Hostinger
2. Vá em "SSH" ou "Acesso SSH"
3. Anote:
   - **Host**: (ex: `ssh.hostinger.com` ou IP)
   - **Porta**: (geralmente `65002`)
   - **Usuário**: (ex: `u984823938`)
   - **Senha**: (ou chave SSH)

### 1.2 Conectar via Terminal (Windows)

**Opção A: PowerShell/CMD**
```powershell
ssh u984823938@ssh.hostinger.com -p 65002
```

**Opção B: PuTTY (Windows)**
1. Baixe PuTTY: https://www.putty.org/
2. Configure:
   - Host: `ssh.hostinger.com`
   - Port: `65002`
   - Connection type: SSH
3. Clique em "Open"
4. Digite usuário e senha quando solicitado

**Opção C: Git Bash**
```bash
ssh u984823938@ssh.hostinger.com -p 65002
```

## Passo 2: Preparar Ambiente na Hostinger

### 2.1 Verificar Node.js

```bash
node --version
npm --version
```

Se não estiver instalado, instale via Hostinger ou peça suporte.

### 2.2 Navegar para Pasta do Projeto

```bash
cd ~/domains/fire.dgapp.com.br/public_html
# ou
cd ~/public_html
```

### 2.3 Criar Pasta para Backend (se necessário)

```bash
mkdir -p api
cd api
```

## Passo 3: Upload dos Arquivos

### Opção A: Via Git (Recomendado)

Se você tem o código no Git:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
git clone https://seu-repositorio.git .
# ou se já existe:
git pull origin main
```

### Opção B: Via FTP/SFTP

1. Use FileZilla, WinSCP ou similar
2. Conecte via SFTP:
   - Host: `sftp://ssh.hostinger.com`
   - Porta: `65002`
   - Usuário: `u984823938`
   - Senha: (sua senha SSH)
3. Faça upload da pasta `backend/` para `public_html/api/`

### Opção C: Via SCP (Linha de Comando)

No seu computador Windows (PowerShell):

```powershell
# Navegar até a pasta do projeto
cd C:\App\React-Native\anotfire

# Fazer upload do backend
scp -P 65002 -r backend u984823938@ssh.hostinger.com:~/domains/fire.dgapp.com.br/public_html/api
```

## Passo 4: Instalar Dependências

Na Hostinger via SSH:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api/backend
# ou
cd ~/public_html/api/backend

# Instalar dependências
npm install --production

# Compilar TypeScript
npm run build
```

## Passo 5: Configurar Variáveis de Ambiente

Criar arquivo `.env` na pasta `backend/`:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api/backend
nano .env
```

Cole o seguinte conteúdo:

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
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-$(openssl rand -hex 32)
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui-$(openssl rand -hex 32)

# Frontend URL (para CORS)
FRONTEND_URL=https://fire.dgapp.com.br
```

**Para salvar no nano**: `Ctrl+O`, Enter, `Ctrl+X`

**Para gerar secrets seguros**:
```bash
openssl rand -hex 32
```

## Passo 6: Instalar PM2

```bash
npm install -g pm2
```

## Passo 7: Iniciar Servidor

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api/backend

# Iniciar com PM2
pm2 start dist/server.js --name anotfire-api

# Salvar configuração
pm2 save

# Configurar para iniciar automaticamente ao reiniciar servidor
pm2 startup
# (Siga as instruções que aparecerem)
```

## Passo 8: Verificar se Está Funcionando

### 8.1 Ver Logs

```bash
pm2 logs anotfire-api
```

Você deve ver:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
📡 Acessível em: http://0.0.0.0:3000
```

### 8.2 Ver Status

```bash
pm2 status
```

Deve mostrar `anotfire-api` como `online`.

### 8.3 Testar API

No navegador ou Postman:
```
https://api.fire.dgapp.com.br/api/health
```

## Passo 9: Configurar Subdomínio (se necessário)

1. No painel Hostinger, vá em "Domínios"
2. Crie subdomínio `api.fire.dgapp.com.br`
3. Aponte para a pasta onde está o backend
4. Configure proxy reverso (se necessário)

## Comandos Úteis PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs anotfire-api

# Reiniciar
pm2 restart anotfire-api

# Parar
pm2 stop anotfire-api

# Iniciar
pm2 start anotfire-api

# Deletar
pm2 delete anotfire-api

# Monitorar
pm2 monit
```

## Troubleshooting

### Erro: "Cannot find module"
- Verificar se `npm install` foi executado
- Verificar se `npm run build` foi executado

### Erro: "ECONNREFUSED" no MySQL
- Verificar se `.env` está configurado corretamente
- Verificar se está usando `localhost` (não IP externo)
- Verificar credenciais do banco

### Erro: "Port already in use"
- Verificar se outra instância está rodando: `pm2 list`
- Parar outras instâncias: `pm2 stop all`

### Servidor não responde
- Verificar logs: `pm2 logs anotfire-api`
- Verificar se porta 3000 está acessível
- Verificar firewall da Hostinger

## Próximos Passos

1. ✅ Backend rodando na Hostinger
2. ✅ Testar conexão do app mobile
3. ✅ Configurar domínio `api.fire.dgapp.com.br`
4. ✅ Configurar SSL/HTTPS
