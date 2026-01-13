# 🚀 Deploy no Render - Guia Completo

## ⚠️ ATENÇÃO - Configuração Crítica do DB_HOST

**IMPORTANTE**: O `DB_HOST` correto para conexão MySQL remota na Hostinger é:

- ✅ **Use**: `srv1660.hstgr.io` (hostname recomendado)
- ❌ **NÃO use**: `82.112.247.202` (IP antigo que pode não funcionar)

**Se você está tendo erro de conexão**, atualize o `DB_HOST` no Render para `srv1660.hstgr.io`.

---

## 📋 Problema Comum

Se você está vendo este erro:
```
DB_USER definido: false undefined
DB_NAME definido: false undefined
Erro ao conectar ao MySQL: Error: Access denied for user ''@'...' (using password: NO)
```

**Causa**: As variáveis de ambiente não estão configuradas no painel do Render.

---

## ✅ Solução: Configurar Variáveis de Ambiente no Render

O código agora suporta **duas formas** de configurar variáveis no Render:

### Opção 1: Environment Variables (Recomendado - Mais Simples)

### Passo 1: Acessar Configurações do Serviço

1. Acesse o [painel do Render](https://dashboard.render.com)
2. Selecione seu serviço (Web Service)
3. Clique em **"Environment"** no menu lateral

### Passo 2: Adicionar Variáveis de Ambiente

Clique em **"Add Environment Variable"** e adicione **TODAS** as variáveis abaixo:

---

### Opção 2: Secret Files (Alternativa)

Se você preferir usar Secret Files (como na imagem que você mostrou):

1. Na página **"Environment"**, clique em **"+ New Secret File"**
2. Nome do arquivo: `.env`
3. Cole o conteúdo completo com todas as variáveis
4. O código detectará automaticamente e carregará o arquivo

**Nota**: O código foi atualizado para suportar Secret Files automaticamente!

#### Variáveis Obrigatórias

```env
PORT=10000
NODE_ENV=production
DB_HOST=srv1660.hstgr.io
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire
JWT_SECRET=XRpfsIeGK5zU/Upj4ztnpDPHvVvW8wSeianvoRpzngA=
JWT_REFRESH_SECRET=DVKGXL6MReJCaxnde8fQHFtBGgm6torMTQorY7jFMuY=
FRONTEND_URL=https://fire.dgapp.com.br
```

⚠️ **IMPORTANTE - DB_HOST**: 
- ✅ **Use**: `srv1660.hstgr.io` (hostname recomendado pela Hostinger)
- ❌ **NÃO use**: `82.112.247.202` (IP antigo que pode não funcionar para acesso remoto)
- 🔄 **Alternativa**: `193.203.175.141` (IP alternativo se o hostname não funcionar)

### Passo 3: Verificar Cada Variável

Certifique-se de que **TODAS** as variáveis estão configuradas:

- ✅ `PORT` = `10000` (ou a porta que o Render atribuir)
- ✅ `NODE_ENV` = `production`
- ✅ `DB_HOST` = `srv1660.hstgr.io` (ou `193.203.175.141` como alternativa)
- ✅ `DB_USER` = `u984823938_fireuser`
- ✅ `DB_PASSWORD` = `fireuser00!`
- ✅ `DB_NAME` = `u984823938_fire`
- ✅ `JWT_SECRET` = (seu secret JWT)
- ✅ `JWT_REFRESH_SECRET` = (seu refresh secret)
- ✅ `FRONTEND_URL` = `https://fire.dgapp.com.br`

### Passo 4: Salvar e Fazer Redeploy

1. Clique em **"Save Changes"**
2. O Render irá automaticamente fazer um novo deploy
3. Aguarde o deploy completar

---

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique os logs. Você deve ver:

```
✅ DB_HOST definido: true 82.112.247.202
✅ DB_USER definido: true u984823938_fireuser
✅ DB_NAME definido: true u984823938_fire
✅ Conectado ao MySQL
✅ Banco de dados conectado
🚀 Servidor rodando na porta 10000
```

Se ainda aparecer `undefined` para alguma variável, verifique:

1. ✅ A variável está escrita **exatamente** como mostrado acima (case-sensitive)
2. ✅ Não há espaços antes ou depois do `=` na configuração
3. ✅ O valor não está entre aspas (o Render adiciona aspas automaticamente se necessário)
4. ✅ Você clicou em **"Save Changes"** após adicionar todas as variáveis

---

## 📝 Configuração do Serviço no Render

### ⚠️ Configuração Importante: Diretório Raiz

Se seu código está na pasta `backend/`, configure no Render:

1. Vá em **"Settings"** do seu serviço
2. Em **"Root Directory"**, defina: `backend`
3. Isso fará o Render executar os comandos dentro da pasta `backend/`

### Build Command
⚠️ **IMPORTANTE**: O build precisa instalar `devDependencies` para compilar TypeScript:
```
npm install && npm run build
```

**Nota**: O Render por padrão instala todas as dependências (incluindo devDependencies) durante o build, então o comando acima deve funcionar. Se ainda houver erro, use:
```
npm ci && npm run build
```

### Start Command
```
npm start
```

### Node Version
O Render detecta automaticamente, mas você pode especificar no `package.json`:
```json
{
  "engines": {
    "node": "22.16.0"
  }
}
```

---

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite o arquivo `.env` no Git
- As variáveis de ambiente no Render são seguras e criptografadas
- Use valores diferentes para `JWT_SECRET` e `JWT_REFRESH_SECRET` em produção

---

## 🐛 Troubleshooting

### Erro: "Access denied for user ''@'...'"

**Causa**: `DB_USER` ou `DB_PASSWORD` não estão configurados.

**Solução**: 
1. Verifique se `DB_USER` e `DB_PASSWORD` estão nas variáveis de ambiente
2. Verifique se os valores estão corretos (sem espaços extras)
3. Faça um novo deploy após salvar

### Erro: "Unknown database"

**Causa**: `DB_NAME` não está configurado ou está incorreto.

**Solução**: Verifique se `DB_NAME` está configurado corretamente.

### Erro: "ECONNREFUSED" ou "Access denied for user '...'@'74.220.48.240'"

**Causa**: `DB_HOST` está incorreto ou o banco não aceita conexões externas.

**Solução**: 
1. ⚠️ **IMPORTANTE**: Use o hostname correto `srv1660.hstgr.io` ao invés do IP `82.112.247.202`
2. Verifique se o banco MySQL na Hostinger permite conexões externas:
   - Acesse o hPanel: https://hpanel.hostinger.com
   - Vá em **Bancos de Dados** → **MySQL Remoto**
   - Certifique-se de que o IP do Render (`74.220.48.240`) está na lista de hosts permitidos
3. Se o hostname não funcionar, tente o IP alternativo: `193.203.175.141`
4. Se o erro persistir, tente **reparar o banco de dados** no hPanel:
   - Vá em **Bancos de Dados** → **Gerenciamento**
   - Clique no menu de ações (três pontos) do banco
   - Selecione **"Reparar"** para recriar as permissões

### Erro: "Could not find a declaration file for module 'express'"

**Causa**: As dependências de tipos TypeScript (`@types/*`) não estão sendo instaladas durante o build.

**Solução**: 
1. No painel do Render, vá em **"Settings"** do seu serviço
2. Verifique o **"Build Command"** - deve ser:
   ```
   npm install && npm run build
   ```
3. **IMPORTANTE**: Certifique-se de que o Render está instalando `devDependencies`. Se o problema persistir:
   - Verifique se `@types/express`, `@types/node`, etc. estão em `devDependencies` no `package.json`
   - Tente usar `npm ci` ao invés de `npm install`:
     ```
     npm ci && npm run build
     ```
4. Se ainda não funcionar, mova temporariamente os `@types/*` para `dependencies` (não recomendado, mas funciona):
   ```json
   {
     "dependencies": {
       "@types/express": "^4.17.21",
       "@types/node": "^20.10.0",
       "@types/cors": "^2.8.17",
       "@types/bcryptjs": "^2.4.6",
       "@types/jsonwebtoken": "^9.0.5",
       "@types/multer": "^1.4.11",
       "@types/nodemailer": "^6.4.14",
       "typescript": "^5.3.3"
     }
   }
   ```

---

## 📞 Próximos Passos

Após configurar as variáveis de ambiente:

1. ✅ Aguarde o deploy completar
2. ✅ Verifique os logs para confirmar conexão com o banco
3. ✅ Teste o endpoint `/health` para verificar se está funcionando
4. ✅ Teste autenticação para verificar se JWT está funcionando

---

## 📚 Referências

- [Documentação Render - Environment Variables](https://render.com/docs/environment-variables)
- [Documentação Render - Web Services](https://render.com/docs/web-services)
