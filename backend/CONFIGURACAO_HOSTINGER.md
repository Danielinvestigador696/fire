# Configuração Hostinger - fire.dgapp.com.br

## Credenciais do Banco de Dados MySQL

**ATENÇÃO**: Este arquivo contém informações sensíveis. Não commitar no Git!

### Informações do Banco

- **Host**: `localhost` (quando rodando no servidor Hostinger)
- **Usuário**: `u984823938_fireuser`
- **Senha**: `fireuser00!`
- **Banco de Dados**: `u984823938_fire`

### Configuração do .env

Criar arquivo `.env` na pasta `backend/` com:

```env
# Banco de Dados MySQL
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire
```

### Para Acesso Remoto

Se precisar acessar o banco de fora do servidor Hostinger:

1. Habilitar "MySQL remoto" no painel Hostinger
2. Adicionar seu IP aos hosts permitidos
3. Usar o host remoto fornecido (ex: `mysql.hostinger.com`)

### Executar Schema

**IMPORTANTE**: Use o arquivo `database/schema-hostinger.sql` (não o `schema.sql`)

Via phpMyAdmin (recomendado):
1. Acessar phpMyAdmin pelo painel Hostinger
2. Selecionar banco `u984823938_fire` (já deve estar selecionado)
3. Ir na aba "SQL"
4. Copiar e colar o conteúdo de `database/schema-hostinger.sql`
5. Executar

Via linha de comando (SSH):
```bash
mysql -h localhost -u u984823938_fireuser -p u984823938_fire < database/schema-hostinger.sql
```
