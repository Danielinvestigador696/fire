# 🚀 Como Iniciar o Servidor na Hostinger

## Problema Atual

O erro mostra que está tentando acessar `https://api.fire.dgapp.com.br/api` mas o servidor não está respondendo.

## Solução: Iniciar o Servidor

### Via SSH (Recomendado)

1. **Conectar via SSH na Hostinger**
   - Acesse o painel Hostinger
   - Vá em "SSH" ou "Terminal"
   - Conecte ao servidor

2. **Navegar até a pasta do backend**
   ```bash
   cd public_html/api
   ```

3. **Verificar se arquivos estão lá**
   ```bash
   ls -la
   ```
   Deve mostrar: `dist/`, `package.json`, `.env`

4. **Instalar dependências (se ainda não fez)**
   ```bash
   npm install --production
   ```

5. **Iniciar com PM2**
   ```bash
   # Instalar PM2 (se ainda não tiver)
   npm install -g pm2
   
   # Iniciar servidor
   pm2 start dist/server.js --name anotfire-api
   
   # Salvar configuração
   pm2 save
   
   # Ver status
   pm2 status
   ```

6. **Verificar logs**
   ```bash
   pm2 logs anotfire-api
   ```
   
   Deve mostrar:
   ```
   ✅ Banco de dados conectado
   🚀 Servidor rodando na porta 3000
   ```

### Se PM2 não estiver disponível

```bash
# Iniciar diretamente (temporário - para quando fechar terminal)
cd public_html/api
node dist/server.js
```

**Nota:** Isso só funciona enquanto o terminal estiver aberto.

## Verificar se Está Funcionando

### Teste 1: Health Check

No navegador, acesse:
```
http://SEU_IP:3000/health
```

Ou se tiver subdomínio:
```
https://api.fire.dgapp.com.br/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### Teste 2: Verificar Processo

```bash
pm2 list
```

Deve mostrar `anotfire-api` como `online`.

## Problemas Comuns

### "Cannot find module"
```bash
cd public_html/api
npm install --production
```

### "Port 3000 already in use"
```bash
# Ver processos na porta 3000
pm2 list
# Parar processo antigo
pm2 stop anotfire-api
# Ou deletar
pm2 delete anotfire-api
# Iniciar novamente
pm2 start dist/server.js --name anotfire-api
```

### "Database connection error"
- Verificar arquivo `.env` na Hostinger
- Verificar credenciais do banco
- Verificar se MySQL está rodando

### Servidor inicia mas não responde
- Verificar firewall da Hostinger
- Verificar se porta 3000 está aberta
- Verificar se está escutando em `0.0.0.0` (já configurado)

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

# Deletar
pm2 delete anotfire-api

# Ver monitoramento
pm2 monit
```

## Próximo Passo

Após iniciar o servidor, teste novamente no app. O erro de network deve desaparecer.
