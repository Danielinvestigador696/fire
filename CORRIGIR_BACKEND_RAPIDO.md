# ⚡ Correção Rápida do Backend - Passo a Passo

Guia rápido para corrigir os problemas mais comuns do backend na Hostinger.

## 🎯 Problema Principal

O backend não está funcionando porque:
1. Arquivo `.env` está no lugar errado
2. Dependências não estão instaladas
3. Servidor não está rodando

---

## 🚀 Solução Rápida (SSH)

### Passo 1: Conectar via SSH

**Windows PowerShell:**
```powershell
ssh u984823938@ssh.hostinger.com -p 65002
```

**Ou use PuTTY** (veja `CONECTAR_SSH_HOSTINGER.md`)

---

### Passo 2: Navegar para Pasta do Backend

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
# ou
cd ~/public_html/api
```

---

### Passo 3: Mover .env para Local Correto

```bash
# Verificar onde está o .env
ls -la ../.env

# Copiar para api/
cp ../.env .env

# Verificar se foi copiado
ls -la .env
```

---

### Passo 4: Verificar package.json

```bash
# Verificar se existe
ls -la package.json

# Se não existir, você precisa fazer upload via File Manager
# Ou criar manualmente (veja OPCAO_MANUAL_FILE_MANAGER.md)
```

---

### Passo 5: Instalar Dependências

```bash
npm install --production
```

Aguarde alguns minutos...

---

### Passo 6: Verificar Node.js e PM2

```bash
# Verificar Node.js
node --version
npm --version

# Instalar PM2 se necessário
npm install -g pm2
```

---

### Passo 7: Iniciar Servidor

```bash
# Verificar onde está o server.js
ls -la dist/server.js
# ou
ls -la server.js

# Iniciar com PM2
# Se estiver em dist/:
pm2 start dist/server.js --name anotfire-api

# OU se estiver na raiz:
pm2 start server.js --name anotfire-api

# Salvar configuração
pm2 save

# Configurar startup automático
pm2 startup
# (Siga as instruções que aparecerem)
```

---

### Passo 8: Verificar se Funcionou

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs anotfire-api --lines 20
```

**Você deve ver:**
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
```

---

### Passo 9: Testar API

No navegador, acesse:
```
https://api.fire.dgapp.com.br/health
```

Ou via SSH:
```bash
curl http://localhost:3000/health
```

---

## 📁 Solução Manual (File Manager)

Se você **NÃO tem acesso SSH**, siga `OPCAO_MANUAL_FILE_MANAGER.md`.

**Resumo rápido:**
1. File Manager → `public_html/api/`
2. Criar arquivo `.env` (copiar de `public_html/.env`)
3. Fazer upload de `package.json`
4. **Mas**: Você ainda precisará de SSH para instalar dependências e iniciar servidor

---

## 🔧 Script Automático

Se você tem SSH, pode usar o script automático:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api

# Fazer upload do script primeiro (via File Manager ou SCP)
# Depois executar:
bash scripts/setup-hostinger.sh
```

---

## ❌ Se Algo Der Errado

### Erro: "Cannot find module"

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
rm -rf node_modules
npm install --production
pm2 restart anotfire-api
```

### Erro: "ECONNREFUSED" MySQL

```bash
# Verificar se .env está correto
cat .env | grep DB_

# Deve mostrar:
# DB_HOST=localhost
# DB_USER=u984823938_fireuser
# DB_PASSWORD=fireuser00!
# DB_NAME=u984823938_fire
```

### Erro: "Port 3000 already in use"

```bash
pm2 stop all
pm2 delete anotfire-api
pm2 start dist/server.js --name anotfire-api
```

---

## ✅ Checklist Final

- [ ] Conectado via SSH ✅
- [ ] `.env` está em `api/.env` ✅
- [ ] `package.json` existe ✅
- [ ] `node_modules/` existe (após npm install) ✅
- [ ] PM2 instalado ✅
- [ ] Servidor rodando (`pm2 status` mostra online) ✅
- [ ] Logs mostram sucesso ✅
- [ ] API responde em `/health` ✅

---

## 📚 Documentação Completa

- **Conectar SSH**: `CONECTAR_SSH_HOSTINGER.md`
- **Opção Manual**: `OPCAO_MANUAL_FILE_MANAGER.md`
- **Diagnóstico Completo**: `DIAGNOSTICO_BACKEND_HOSTINGER.md`
- **Troubleshooting**: `TROUBLESHOOTING_RAPIDO.md`

---

## 🎯 Comandos em Uma Linha (Copiar/Colar)

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api && cp ../.env .env && npm install --production && npm install -g pm2 && pm2 start dist/server.js --name anotfire-api && pm2 save && pm2 status
```

**Nota**: Ajuste `dist/server.js` para `server.js` se os arquivos estiverem na raiz.
