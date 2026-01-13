# 🔧 Troubleshooting Rápido - Backend Hostinger

Guia rápido para resolver problemas comuns do backend na Hostinger.

## 🚨 Problemas Comuns e Soluções

### 1. Erro: "Cannot find module"

**Sintoma**: Logs mostram `Error: Cannot find module 'express'` (ou outro módulo)

**Causa**: Dependências não instaladas

**Solução**:
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
rm -rf node_modules package-lock.json
npm install --production
pm2 restart anotfire-api
```

---

### 2. Erro: "ECONNREFUSED" no MySQL

**Sintoma**: Logs mostram `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Causa 1**: Arquivo `.env` não encontrado ou no lugar errado

**Solução**:
```bash
# Verificar se .env existe
ls -la ~/domains/fire.dgapp.com.br/public_html/api/.env

# Se não existir, copiar de public_html/
cd ~/domains/fire.dgapp.com.br/public_html
cp .env api/.env

# Verificar conteúdo
cat api/.env | grep DB_
```

**Causa 2**: Credenciais erradas no `.env`

**Solução**: Verificar se `.env` contém:
```env
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire
```

**Causa 3**: Banco de dados não existe ou usuário sem permissão

**Solução**: Verificar no phpMyAdmin ou testar conexão:
```bash
mysql -h localhost -u u984823938_fireuser -p u984823938_fire
# Digite: fireuser00!
```

---

### 3. Erro: "Port 3000 already in use"

**Sintoma**: `Error: listen EADDRINUSE: address already in use :::3000`

**Causa**: Outro processo usando a porta 3000

**Solução**:
```bash
# Ver processos PM2
pm2 list

# Parar todos
pm2 stop all

# OU parar apenas o anotfire-api
pm2 stop anotfire-api

# OU deletar e recriar
pm2 delete anotfire-api
pm2 start dist/server.js --name anotfire-api
```

---

### 4. Servidor inicia mas não responde

**Sintoma**: PM2 mostra `online` mas API não responde

**Causa 1**: Firewall bloqueando porta 3000

**Solução**: 
- Verificar configurações de firewall no painel Hostinger
- Verificar se porta 3000 está aberta para conexões externas

**Causa 2**: Servidor não escutando em `0.0.0.0`

**Solução**: 
- Verificar se `server.ts` usa `app.listen(PORT, '0.0.0.0', ...)`
- Se não, recompilar e fazer upload:
```bash
# No seu computador local
cd backend
npm run build
# Fazer upload da pasta dist/ novamente
```

**Causa 3**: Subdomínio não configurado

**Solução**: 
- Configurar subdomínio `api.fire.dgapp.com.br` no painel Hostinger
- Configurar proxy reverso se necessário

---

### 5. Erro: "PM2 command not found"

**Sintoma**: `pm2: command not found`

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

---

### 6. Erro: "Cannot read property 'pool' of undefined"

**Sintoma**: `TypeError: Cannot read property 'pool' of undefined`

**Causa**: Dependências não instaladas corretamente ou módulo não encontrado

**Solução**:
```bash
cd ~/domains/fire.dgapp.com.br/public_html/api
rm -rf node_modules package-lock.json
npm install --production
pm2 restart anotfire-api
```

---

### 7. Erro: "JWT_SECRET is not defined"

**Sintoma**: Erro relacionado a JWT ou autenticação

**Causa**: `JWT_SECRET` ou `JWT_REFRESH_SECRET` não configurados no `.env`

**Solução**:
```bash
# Gerar secrets seguros
openssl rand -hex 32

# Editar .env
nano ~/domains/fire.dgapp.com.br/public_html/api/.env

# Adicionar/atualizar:
JWT_SECRET=seu-secret-gerado-aqui
JWT_REFRESH_SECRET=outro-secret-gerado-aqui

# Reiniciar servidor
pm2 restart anotfire-api
```

---

### 8. Servidor para após alguns minutos

**Sintoma**: PM2 mostra `stopped` ou `errored` após algum tempo

**Causa 1**: Erro não tratado causando crash

**Solução**: Verificar logs:
```bash
pm2 logs anotfire-api --lines 100
```

**Causa 2**: Memória insuficiente

**Solução**: Verificar uso de memória:
```bash
pm2 monit
# ou
free -h
```

**Causa 3**: PM2 não configurado para reiniciar automaticamente

**Solução**:
```bash
# Configurar para reiniciar automaticamente
pm2 startup
# Seguir instruções que aparecerem
pm2 save
```

---

### 9. Logs mostram "Route not found"

**Sintoma**: API retorna 404 para rotas que deveriam existir

**Causa**: Rotas não registradas ou caminho incorreto

**Solução**: 
- Verificar se `server.ts` registra todas as rotas
- Verificar se está acessando `/api/...` (não apenas `/...`)
- Verificar logs para ver quais rotas estão registradas

---

### 10. CORS bloqueando requisições

**Sintoma**: Erro de CORS no navegador

**Causa**: `FRONTEND_URL` incorreto ou CORS mal configurado

**Solução**:
```bash
# Verificar .env
cat ~/domains/fire.dgapp.com.br/public_html/api/.env | grep FRONTEND_URL

# Deve ser:
FRONTEND_URL=https://fire.dgapp.com.br

# Reiniciar servidor
pm2 restart anotfire-api
```

---

## 🔍 Comandos de Diagnóstico

### Verificar Status Completo

```bash
# Status PM2
pm2 status

# Logs recentes
pm2 logs anotfire-api --lines 50

# Uso de recursos
pm2 monit

# Informações detalhadas
pm2 describe anotfire-api
```

### Verificar Conexão MySQL

```bash
# Testar conexão
mysql -h localhost -u u984823938_fireuser -p u984823938_fire

# Verificar se banco existe
mysql -h localhost -u u984823938_fireuser -p -e "SHOW DATABASES;"
```

### Verificar Porta

```bash
# Ver se porta 3000 está em uso
netstat -tuln | grep 3000
# ou
lsof -i :3000

# Testar API localmente
curl http://localhost:3000/health
```

### Verificar Arquivos

```bash
# Verificar estrutura
cd ~/domains/fire.dgapp.com.br/public_html/api
ls -la

# Verificar .env
cat .env

# Verificar package.json
cat package.json | grep -A 5 "dependencies"
```

---

## 📞 Se Nada Funcionar

1. **Verificar logs completos**:
   ```bash
   pm2 logs anotfire-api --lines 200
   ```

2. **Reiniciar tudo**:
   ```bash
   pm2 delete anotfire-api
   cd ~/domains/fire.dgapp.com.br/public_html/api
   pm2 start dist/server.js --name anotfire-api
   pm2 save
   ```

3. **Verificar se Node.js está funcionando**:
   ```bash
   node --version
   node -e "console.log('Node.js funcionando!')"
   ```

4. **Contatar suporte Hostinger** se problemas persistirem

---

## 📚 Referências

- Guia completo: `DIAGNOSTICO_BACKEND_HOSTINGER.md`
- Checklist: `CHECKLIST_DIAGNOSTICO.md`
- Comandos SSH: `COMANDOS_SSH_DIAGNOSTICO.txt`
