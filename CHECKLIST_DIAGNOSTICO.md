# ✅ Checklist de Diagnóstico do Backend

Use este checklist para verificar se tudo está configurado corretamente na Hostinger.

## 📋 Pré-requisitos

- [ ] Acesso SSH configurado na Hostinger
- [ ] Credenciais SSH anotadas (host, porta, usuário, senha)
- [ ] Acesso ao File Manager da Hostinger

## 📁 Estrutura de Arquivos

### Pasta: `public_html/api/`

- [ ] Arquivo `package.json` existe
- [ ] Arquivo `.env` existe (não em `public_html/.env`)
- [ ] Pasta `node_modules/` existe (após `npm install`)
- [ ] Arquivo `server.js` OU `dist/server.js` existe
- [ ] Pasta `database/` existe (se aplicável)
- [ ] Pasta `modules/` existe (se aplicável)

## 🔐 Configuração do .env

O arquivo `.env` deve estar em `public_html/api/.env` e conter:

- [ ] `DB_HOST=localhost`
- [ ] `DB_USER=u984823938_fireuser`
- [ ] `DB_PASSWORD=fireuser00!`
- [ ] `DB_NAME=u984823938_fire`
- [ ] `JWT_SECRET` configurado (não placeholder)
- [ ] `JWT_REFRESH_SECRET` configurado (não placeholder)
- [ ] `PORT=3000`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://fire.dgapp.com.br`

## 🛠️ Ferramentas Instaladas

- [ ] Node.js instalado (`node --version` retorna versão)
- [ ] npm instalado (`npm --version` retorna versão)
- [ ] PM2 instalado (`pm2 --version` retorna versão)

## 📦 Dependências

- [ ] `npm install --production` foi executado
- [ ] Pasta `node_modules/` foi criada
- [ ] Nenhum erro durante instalação

## 🚀 Servidor

- [ ] Servidor iniciado com PM2 (`pm2 status` mostra `anotfire-api` online)
- [ ] PM2 save executado (`pm2 save`)
- [ ] PM2 startup configurado (`pm2 startup`)

## 📊 Logs

- [ ] Logs mostram: "✅ Banco de dados conectado"
- [ ] Logs mostram: "🚀 Servidor rodando na porta 3000"
- [ ] Nenhum erro de conexão MySQL
- [ ] Nenhum erro de módulo não encontrado

## 🌐 Testes de API

- [ ] Endpoint `/health` responde (teste no navegador)
- [ ] Resposta do `/health` contém `{"status": "ok"}`
- [ ] Endpoint `/api/auth/login` acessível (se tiver usuário)

## 🔍 Verificações Adicionais

- [ ] Conexão MySQL funciona (teste manual via `mysql` command)
- [ ] Porta 3000 está acessível (teste local: `curl http://localhost:3000/health`)
- [ ] Firewall não está bloqueando porta 3000
- [ ] Subdomínio `api.fire.dgapp.com.br` configurado (se aplicável)

## 📝 Comandos de Verificação Rápida

Execute estes comandos via SSH para verificação rápida:

```bash
# 1. Verificar estrutura
cd ~/domains/fire.dgapp.com.br/public_html/api
ls -la

# 2. Verificar .env
ls -la .env
cat .env | grep DB_

# 3. Verificar dependências
ls -la node_modules

# 4. Verificar Node.js
node --version
npm --version

# 5. Verificar PM2
pm2 --version
pm2 status

# 6. Ver logs
pm2 logs anotfire-api --lines 20

# 7. Testar API
curl http://localhost:3000/health
```

## 🎯 Status Final

- [ ] **TODOS** os itens acima estão marcados ✅
- [ ] Servidor está rodando e respondendo
- [ ] API está acessível e funcionando

---

## 📞 Se Algo Estiver Faltando

1. Consulte `DIAGNOSTICO_BACKEND_HOSTINGER.md` para guia detalhado
2. Execute `bash scripts/verificar-backend.sh` (se disponível)
3. Verifique logs: `pm2 logs anotfire-api`
4. Consulte seção Troubleshooting no guia principal

---

**Última verificação em**: _______________
**Verificado por**: _______________
