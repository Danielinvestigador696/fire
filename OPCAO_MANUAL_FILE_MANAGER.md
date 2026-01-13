# 📁 Opção Manual - Via File Manager (Hostinger)

Se você não tem acesso SSH ou prefere usar a interface gráfica, siga este guia.

## 📋 Passo 1: Acessar File Manager

1. Acesse o painel Hostinger
2. Vá em "Gerenciador de Arquivos" ou "File Manager"
3. Navegue até `public_html/`

---

## 📋 Passo 2: Verificar Estrutura Atual

### Verificar se pasta `api/` existe

1. Em `public_html/`, verifique se existe a pasta `api/`
2. Se não existir, crie:
   - Clique em "New folder"
   - Nome: `api`
   - Clique em "Create"

### Verificar arquivos em `api/`

Entre na pasta `api/` e verifique se existem:
- ✅ `server.js` ou `dist/server.js`
- ✅ `package.json`
- ❌ `.env` (provavelmente não está aqui)
- ❌ `node_modules/` (será criado depois)

---

## 📋 Passo 3: Mover Arquivo .env

### Situação Atual

O arquivo `.env` provavelmente está em `public_html/.env` (raiz).

### Ação Necessária

1. **Em `public_html/`** (raiz):
   - Clique no arquivo `.env`
   - Clique em "Edit" ou abra o arquivo
   - **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)

2. **Navegue para `public_html/api/`**:
   - Entre na pasta `api/`
   - Clique em "New file"
   - Nome: `.env`
   - Cole o conteúdo copiado (Ctrl+V)
   - Clique em "Save" ou "Create"

3. **(Opcional) Backup**:
   - Mantenha o `.env` original em `public_html/` como backup
   - Ou delete após confirmar que o novo funciona

---

## 📋 Passo 4: Verificar/Criar package.json

### Verificar se Existe

1. Em `public_html/api/`, verifique se existe `package.json`
2. Se **NÃO existir**:

### Fazer Upload do package.json

**Opção A: Via File Manager**

1. No seu computador, abra o arquivo:
   ```
   C:\App\React-Native\anotfire\backend\package.json
   ```

2. No File Manager da Hostinger:
   - Navegue para `public_html/api/`
   - Clique em "Upload"
   - Selecione o arquivo `package.json`
   - Aguarde upload completar

**Opção B: Criar Manualmente**

1. No File Manager, em `public_html/api/`:
   - Clique em "New file"
   - Nome: `package.json`
   - Cole o seguinte conteúdo (ajuste se necessário):

```json
{
  "name": "anotfire-backend",
  "version": "1.0.0",
  "description": "Backend API para AnotFire CAC",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "nodemailer": "^6.9.7",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1509.0",
    "date-fns": "^3.0.0"
  }
}
```

---

## 📋 Passo 5: Verificar Conteúdo do .env

1. Em `public_html/api/`, abra o arquivo `.env`
2. O arquivo `.env` deve conter **EXATAMENTE** este conteúdo:

```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui
FRONTEND_URL=https://fire.dgapp.com.br
```

3. **IMPORTANTE**: Se `JWT_SECRET` ou `JWT_REFRESH_SECRET` ainda estiverem com valores placeholder (`seu-jwt-secret-super-seguro-aqui`), você **DEVE** gerar secrets seguros (veja próximo passo)

---

## 📋 Passo 6: Gerar JWT Secrets (Se Necessário)

### Opção A: Via Terminal Online (Hostinger)

Se a Hostinger oferecer terminal online:

1. No painel Hostinger, procure por "Terminal" ou "SSH Terminal"
2. Execute:
   ```bash
   openssl rand -hex 32
   ```
3. Copie o resultado
4. Use para `JWT_SECRET`
5. Execute novamente para `JWT_REFRESH_SECRET`

### Opção B: Via Site Online

Acesse: https://www.random.org/strings/
- Length: 64
- Characters: Hexadecimal
- Gere 2 strings diferentes

### Opção C: Via PowerShell (Seu Computador)

```powershell
# Gerar secret
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Execute 2 vezes para ter 2 secrets diferentes.

---

## 📋 Passo 7: Instalar Dependências (Requer SSH ou Terminal)

⚠️ **IMPORTANTE**: Instalar `node_modules` via File Manager não é possível. Você precisa de:

- **SSH** (recomendado), OU
- **Terminal Online** da Hostinger (se disponível)

### Se Tiver SSH:

Conecte via SSH e execute:
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
npm install --production
```

### Se Tiver Terminal Online:

1. Acesse o terminal online no painel Hostinger
2. Execute os mesmos comandos acima

### Se NÃO Tiver Nenhum:

**Opção 1**: Solicitar acesso SSH ao suporte Hostinger

**Opção 2**: Fazer upload da pasta `node_modules` do seu computador (não recomendado - muito grande)

---

## 📋 Passo 8: Iniciar Servidor (Requer SSH ou Terminal)

⚠️ **IMPORTANTE**: Iniciar o servidor também requer SSH ou terminal.

### Via SSH:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api

# Instalar PM2 (se não tiver)
npm install -g pm2

# Iniciar servidor
pm2 start dist/server.js --name anotfire-api
# ou se estiver na raiz:
pm2 start server.js --name anotfire-api

# Salvar configuração
pm2 save

# Configurar startup automático
pm2 startup
```

---

## ✅ Checklist Manual

Após seguir todos os passos, verifique:

- [ ] `.env` está em `public_html/api/.env` ✅
- [ ] `package.json` está em `public_html/api/` ✅
- [ ] Conteúdo do `.env` está correto ✅
- [ ] `JWT_SECRET` e `JWT_REFRESH_SECRET` foram gerados ✅
- [ ] Dependências instaladas (`node_modules/` existe) ✅
- [ ] Servidor iniciado com PM2 ✅

---

## 🔄 Próximos Passos

Após completar os passos manuais:

1. **Testar API**: Acesse `https://api.fire.dgapp.com.br/health`
2. **Verificar Logs**: Via SSH: `pm2 logs anotfire-api`
3. **Seguir Guia Completo**: `DIAGNOSTICO_BACKEND_HOSTINGER.md`

---

## ⚠️ Limitações do Método Manual

- ❌ Não é possível instalar `node_modules` apenas via File Manager
- ❌ Não é possível iniciar servidor Node.js apenas via File Manager
- ✅ É possível configurar arquivos (`.env`, `package.json`)
- ✅ É possível fazer upload de arquivos

**Recomendação**: Use SSH para passos que requerem terminal (instalar dependências, iniciar servidor).

---

## 📞 Se Precisar de Ajuda

1. Consulte: `CONECTAR_SSH_HOSTINGER.md` para configurar SSH
2. Consulte: `DIAGNOSTICO_BACKEND_HOSTINGER.md` para guia completo
3. Contate suporte Hostinger se SSH não estiver disponível
