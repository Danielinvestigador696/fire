# 🔍 Diagnóstico e Correção do Backend na Hostinger

## ⚠️ Problemas Identificados

1. **Arquivo .env no lugar errado**: O `.env` está em `public_html/.env` mas o servidor precisa dele em `public_html/api/.env`
2. **Dependências não instaladas**: Provavelmente falta `node_modules` na pasta `api/`
3. **Servidor não está rodando**: PM2 provavelmente não foi configurado ainda
4. **package.json pode estar faltando**: Necessário para instalar dependências

---

## 📋 Passo 1: Verificar Estrutura Atual na Hostinger

### Via File Manager (Hostinger)

1. Acesse o File Manager no painel Hostinger
2. Navegue até `public_html/api/`
3. Verifique se existem:
   - ✅ `server.js` ou `dist/server.js`
   - ✅ Pasta `database/`
   - ✅ Pasta `modules/`
   - ✅ `package.json` (se não existir, precisa fazer upload)
   - ❌ `node_modules/` (provavelmente não existe ainda)
   - ❌ `.env` (está em `public_html/.env`, precisa estar em `api/.env`)

### Via SSH

Conecte via SSH e execute:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
# ou
cd ~/public_html/api

# Listar arquivos
ls -la

# Verificar se package.json existe
ls -la package.json

# Verificar se .env existe
ls -la .env

# Verificar se node_modules existe
ls -la node_modules

# Verificar estrutura de pastas
ls -la dist/ 2>/dev/null || echo "Pasta dist não existe"
ls -la server.js 2>/dev/null || echo "server.js não existe na raiz"
```

---

## 📋 Passo 2: Mover Arquivo .env para Local Correto

O arquivo `.env` **DEVE** estar em `public_html/api/.env` (mesma pasta do `server.js`).

### Opção A: Via File Manager (Mais Fácil)

1. No File Manager, vá para `public_html/`
2. Abra o arquivo `.env` e copie todo o conteúdo
3. Navegue para `public_html/api/`
4. Crie um novo arquivo chamado `.env`
5. Cole o conteúdo copiado
6. Salve o arquivo
7. (Opcional) Delete o `.env` antigo de `public_html/` ou mantenha como backup

### Opção B: Via SSH

```bash
cd ~/domains/fire.dgapp.com.br/public_html

# Copiar .env para api/
cp .env api/.env

# OU mover (remove o original)
mv .env api/.env

# Verificar se foi copiado
ls -la api/.env
```

### Conteúdo Esperado do .env

O arquivo `.env` deve conter **EXATAMENTE**:

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

**⚠️ IMPORTANTE**: Se os `JWT_SECRET` ainda estão com valores placeholder, gere secrets seguros:

```bash
# Via SSH, gerar secrets:
openssl rand -hex 32
```

Use o resultado para preencher `JWT_SECRET` e gere outro para `JWT_REFRESH_SECRET`.

---

## 📋 Passo 3: Verificar/Criar package.json

### Verificar se Existe

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
ls -la package.json
```

### Se Não Existir

**Opção A: Via File Manager**
1. Faça upload do arquivo `backend/package.json` do seu projeto local para `public_html/api/`

**Opção B: Via SCP (do seu computador)**
```powershell
# No PowerShell do Windows
cd C:\App\React-Native\anotfire
scp -P 65002 backend/package.json u984823938@ssh.hostinger.com:~/domains/fire.dgapp.com.br/public_html/api/
```

**Opção C: Criar Manualmente via SSH**
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
nano package.json
# Cole o conteúdo do package.json do backend
```

---

## 📋 Passo 4: Instalar Dependências

**⚠️ IMPORTANTE**: Execute este passo **APENAS** após ter o `package.json` na pasta `api/`.

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
# ou
cd ~/public_html/api

# Instalar dependências de produção
npm install --production

# Aguardar conclusão (pode demorar alguns minutos)
# Verificar se node_modules foi criado
ls -la node_modules
```

**Tempo estimado**: 2-5 minutos dependendo da conexão.

---

## 📋 Passo 5: Verificar Node.js e PM2

### Verificar Node.js

```bash
node --version
npm --version
```

Se não estiver instalado, contate o suporte Hostinger ou instale via nvm.

### Instalar PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 --version
```

---

## 📋 Passo 6: Iniciar Servidor com PM2

### Verificar Estrutura de Arquivos

Primeiro, verifique onde está o `server.js`:

```bash
cd ~/domains/fire.dgapp.com.br/public_html/api

# Verificar se está em dist/
ls -la dist/server.js

# OU se está na raiz
ls -la server.js
```

### Iniciar Servidor

**Se os arquivos estão em `dist/`:**
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
pm2 start dist/server.js --name anotfire-api
pm2 save
pm2 startup
```

**Se os arquivos estão diretamente em `api/` (sem pasta dist):**
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
pm2 start server.js --name anotfire-api
pm2 save
pm2 startup
```

**Se o PM2 pedir comandos para executar com sudo:**
- Copie o comando que aparecer
- Execute com as permissões necessárias
- Isso configura o PM2 para iniciar automaticamente ao reiniciar o servidor

---

## 📋 Passo 7: Verificar Logs e Status

### Ver Status do PM2

```bash
pm2 status
```

Deve mostrar `anotfire-api` com status `online` (verde).

### Ver Logs

```bash
# Ver logs em tempo real
pm2 logs anotfire-api

# Ver últimas 50 linhas
pm2 logs anotfire-api --lines 50

# Ver apenas erros
pm2 logs anotfire-api --err
```

### Logs Esperados (Sucesso)

Você deve ver algo como:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
📡 Acessível em: http://0.0.0.0:3000
```

### Se Ver Erros

Veja a seção "Troubleshooting" abaixo.

---

## 📋 Passo 8: Testar API

### Teste 1: Health Check

No navegador ou Postman:
```
https://api.fire.dgapp.com.br/health
```

Ou se não tiver subdomínio configurado:
```
http://IP_DO_SERVIDOR:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T..."
}
```

### Teste 2: Login (se tiver usuário criado)

```bash
POST https://api.fire.dgapp.com.br/api/auth/login
Content-Type: application/json

{
  "email": "danielinvestigador@gmail.com",
  "password": "sua-senha"
}
```

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"

**Causa**: `node_modules` não instalado ou incompleto

**Solução**:
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
rm -rf node_modules
npm install --production
pm2 restart anotfire-api
```

### Erro: "ECONNREFUSED" no MySQL

**Causa**: `.env` não encontrado ou credenciais erradas

**Solução**:
1. Verificar se `.env` está em `api/`:
   ```bash
   ls -la ~/domains/fire.dgapp.com.br/public_html/api/.env
   ```

2. Verificar conteúdo do `.env`:
   ```bash
   cat ~/domains/fire.dgapp.com.br/public_html/api/.env | grep DB_
   ```

3. Verificar se credenciais estão corretas:
   - `DB_HOST=localhost` (não IP externo)
   - `DB_USER=u984823938_fireuser`
   - `DB_PASSWORD=fireuser00!`
   - `DB_NAME=u984823938_fire`

4. Testar conexão MySQL manualmente:
   ```bash
   mysql -h localhost -u u984823938_fireuser -p u984823938_fire
   # Digite a senha quando solicitado
   ```

### Erro: "Port 3000 already in use"

**Causa**: Outro processo usando a porta

**Solução**:
```bash
# Parar todos os processos PM2
pm2 stop all

# OU parar apenas o anotfire-api
pm2 stop anotfire-api

# OU deletar e recriar
pm2 delete anotfire-api
pm2 start dist/server.js --name anotfire-api
```

### Servidor inicia mas não responde

**Causa 1**: Firewall bloqueando porta 3000

**Solução**: 
- Verificar configurações de firewall no painel Hostinger
- Verificar se porta 3000 está aberta

**Causa 2**: Servidor não escutando em `0.0.0.0`

**Solução**: 
- Verificar se `server.ts` usa `app.listen(PORT, '0.0.0.0', ...)`
- Se não, recompilar e fazer upload novamente

### Erro: "PM2 command not found"

**Causa**: PM2 não instalado ou não no PATH

**Solução**:
```bash
# Instalar PM2
npm install -g pm2

# Verificar instalação
which pm2
pm2 --version

# Se ainda não funcionar, usar caminho completo
~/.npm-global/bin/pm2 start dist/server.js --name anotfire-api
```

### Erro: "Cannot read property 'pool' of undefined"

**Causa**: Dependências não instaladas corretamente

**Solução**:
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
rm -rf node_modules package-lock.json
npm install --production
pm2 restart anotfire-api
```

---

## ✅ Checklist de Verificação Final

Execute este checklist após seguir todos os passos:

- [ ] `.env` está em `public_html/api/.env` ✅
- [ ] `package.json` está em `public_html/api/` ✅
- [ ] `node_modules/` existe em `public_html/api/` ✅
- [ ] `server.js` ou `dist/server.js` existe ✅
- [ ] Node.js está instalado (`node --version` retorna versão) ✅
- [ ] PM2 está instalado (`pm2 --version` retorna versão) ✅
- [ ] Servidor está rodando (`pm2 status` mostra `anotfire-api` online) ✅
- [ ] Logs não mostram erros (`pm2 logs anotfire-api` mostra sucesso) ✅
- [ ] API responde em `/health` (teste no navegador) ✅

---

## 📞 Próximos Passos Após Correção

1. ✅ Testar endpoint `/health`
2. ✅ Testar login: `POST /api/auth/login`
3. ✅ Verificar CORS se necessário
4. ✅ Configurar subdomínio `api.fire.dgapp.com.br` se ainda não estiver
5. ✅ Configurar SSL/HTTPS

---

## 📝 Comandos Rápidos de Referência

```bash
# Navegar para pasta
cd ~/domains/fire.dgapp.com.br/public_html/api

# Ver status PM2
pm2 status

# Ver logs
pm2 logs anotfire-api

# Reiniciar
pm2 restart anotfire-api

# Parar
pm2 stop anotfire-api

# Iniciar
pm2 start dist/server.js --name anotfire-api

# Deletar
pm2 delete anotfire-api
```
