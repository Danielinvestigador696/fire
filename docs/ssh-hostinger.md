# Configuração SSH - Hostinger

## Informações de Conexão

- **IP**: `82.112.247.202`
- **Porta**: `65002`
- **Usuário**: `u984823938`
- **Senha**: Configurar no painel Hostinger (botão "Alterar")

## Conectar via SSH

### Windows (PowerShell ou CMD)

```bash
ssh -p 65002 u984823938@82.112.247.202
```

Quando solicitado, digite a senha SSH.

### Windows (PuTTY)

1. Baixar PuTTY: https://www.putty.org/
2. Abrir PuTTY
3. Configurar:
   - **Host Name**: `82.112.247.202`
   - **Port**: `65002`
   - **Connection type**: SSH
4. Clicar em "Open"
5. Login: `u984823938`
6. Senha: (sua senha SSH)

### Windows Terminal (Recomendado)

```bash
ssh -p 65002 u984823938@82.112.247.202
```

### Mac/Linux

```bash
ssh -p 65002 u984823938@82.112.247.202
```

## Primeira Conexão

Na primeira vez, você verá uma mensagem sobre autenticidade do host. Digite `yes` para continuar.

## Após Conectar

Você estará no servidor Hostinger. Execute:

```bash
# Navegar até a pasta do backend
cd public_html/api

# Verificar arquivos
ls -la

# Instalar dependências (se necessário)
npm install --production

# Instalar PM2
npm install -g pm2

# Iniciar servidor
pm2 start dist/server.js --name anotfire-api

# Salvar configuração
pm2 save

# Ver status
pm2 status
```

## Configurar Senha SSH

1. No painel Hostinger, vá em "Acesso SSH"
2. Clique em "Alterar" na seção "Senha"
3. Defina uma senha forte
4. Use esta senha para conectar via SSH

## Troubleshooting

### Erro: "Connection refused"
- Verificar se SSH está ativo no painel Hostinger
- Verificar IP e porta corretos

### Erro: "Permission denied"
- Verificar usuário e senha
- Tentar alterar senha no painel

### Erro: "Host key verification failed"
- Remover entrada antiga: `ssh-keygen -R 82.112.247.202`

## Comandos Úteis

```bash
# Ver processos rodando
pm2 list

# Ver logs do servidor
pm2 logs anotfire-api

# Reiniciar servidor
pm2 restart anotfire-api

# Parar servidor
pm2 stop anotfire-api

# Ver uso de recursos
pm2 monit
```
