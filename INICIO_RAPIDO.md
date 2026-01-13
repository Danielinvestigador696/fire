# 🚀 Início Rápido - Corrigir Backend Hostinger

## Escolha Seu Método

### ✅ Tenho Acesso SSH
→ Vá para: **`CORRIGIR_BACKEND_RAPIDO.md`**

### ❌ NÃO Tenho Acesso SSH
→ Vá para: **`OPCAO_MANUAL_FILE_MANAGER.md`**

### 🔌 Preciso Configurar SSH
→ Vá para: **`CONECTAR_SSH_HOSTINGER.md`**

---

## ⚡ Solução Mais Rápida (SSH)

Se você já tem SSH configurado, execute estes comandos:

```bash
# 1. Conectar
ssh u984823938@ssh.hostinger.com -p 65002

# 2. Navegar e corrigir
cd ~/domains/fire.dgapp.com.br/public_html/api
cp ../.env .env
npm install --production
npm install -g pm2
pm2 start dist/server.js --name anotfire-api
pm2 save
pm2 status
```

**Pronto!** Seu backend deve estar funcionando.

---

## 📋 O Que Fazer Agora?

1. **Se tem SSH**: Siga `CORRIGIR_BACKEND_RAPIDO.md`
2. **Se não tem SSH**: Siga `OPCAO_MANUAL_FILE_MANAGER.md`
3. **Se precisa configurar SSH**: Siga `CONECTAR_SSH_HOSTINGER.md`

---

## 🆘 Ainda com Problemas?

Consulte:
- `TROUBLESHOOTING_RAPIDO.md` - Soluções para erros comuns
- `DIAGNOSTICO_BACKEND_HOSTINGER.md` - Guia completo de diagnóstico
