# 🚀 Iniciar Backend na Hostinger - Passo a Passo

## Informações SSH

- **IP**: `82.112.247.202`
- **Porta**: `65002`
- **Usuário**: `u984823938`
- **Senha**: Configurar no painel Hostinger

## Passo 1: Conectar via SSH

### No Windows (PowerShell ou CMD):

```bash
ssh -p 65002 u984823938@82.112.247.202
```

Digite a senha quando solicitado.

## Passo 2: Navegar até a Pasta do Backend

```bash
cd public_html/api
```

## Passo 3: Verificar Arquivos

```bash
ls -la
```

Deve mostrar:
- `dist/` (pasta com arquivos compilados)
- `package.json`
- `.env` (arquivo de configuração)

## Passo 4: Instalar Dependências (Primeira Vez)

```bash
npm install --production
```

Isso instalará apenas as dependências de produção (sem devDependencies).

## Passo 5: Instalar PM2 (Primeira Vez)

PM2 é um gerenciador de processos que mantém o servidor rodando:

```bash
npm install -g pm2
```

## Passo 6: Iniciar o Servidor

```bash
pm2 start dist/server.js --name anotfire-api
```

## Passo 7: Salvar Configuração

```bash
pm2 save
```

Isso salva a configuração para que o servidor reinicie automaticamente.

## Passo 8: Configurar Inicialização Automática

```bash
pm2 startup
```

Siga as instruções que aparecerem.

## Passo 9: Verificar se Está Rodando

```bash
pm2 status
```

Deve mostrar `anotfire-api` com status `online`.

## Passo 10: Ver Logs

```bash
pm2 logs anotfire-api
```

Deve mostrar:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
📡 Acessível em: http://0.0.0.0:3000
```

## Testar

No navegador, acesse:
```
https://api.fire.dgapp.com.br/health
```

Ou:
```
http://82.112.247.202:3000/health
```

Deve retornar: `{"status":"ok",...}`

## Se Der Erro

### Erro: "Cannot find module"
```bash
cd public_html/api
npm install --production
```

### Erro: "Port already in use"
```bash
pm2 list
pm2 stop anotfire-api
pm2 start dist/server.js --name anotfire-api
```

### Erro: "Database connection error"
- Verificar arquivo `.env` na Hostinger
- Verificar credenciais do banco
- Verificar se MySQL está rodando

## Comandos Rápidos

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs anotfire-api

# Reiniciar
pm2 restart anotfire-api

# Parar
pm2 stop anotfire-api
```
