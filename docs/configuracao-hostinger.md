# Configuração do Banco de Dados - Hostinger

## Informações do Banco de Dados

### Credenciais MySQL (fire.dgapp.com.br)

- **Host**: `localhost` (quando acessando do servidor Hostinger)
- **Usuário**: `u984823938_fireuser`
- **Senha**: `fireuser00!`
- **Banco de Dados**: `u984823938_fire`

### Acesso Remoto

Para acessar o banco de dados remotamente (fora do servidor Hostinger), você precisará:

1. Habilitar "MySQL remoto" no painel Hostinger
2. Adicionar seu IP aos hosts permitidos
3. Usar o host remoto fornecido pela Hostinger (geralmente algo como `mysql.hostinger.com`)

## Configuração do Backend

### Arquivo .env

Criar arquivo `.env` na pasta `backend/` com as seguintes configurações:

```env
# Banco de Dados MySQL
DB_HOST=localhost
DB_USER=u984823938_fireuser
DB_PASSWORD=fireuser00!
DB_NAME=u984823938_fire
```

**Importante**: 
- Para desenvolvimento local, você pode precisar usar o host remoto se a Hostinger permitir acesso externo
- Para produção no servidor Hostinger, use `localhost`

## Executar Schema

### Via phpMyAdmin (Recomendado)

1. Acessar phpMyAdmin pelo painel Hostinger
2. Selecionar o banco `u984823938_fire` (já deve estar selecionado)
3. Ir na aba "SQL"
4. **IMPORTANTE**: Use o arquivo `database/schema-hostinger.sql` (não o `schema.sql`)
   - O `schema-hostinger.sql` não tenta criar o banco, apenas as tabelas
   - O `schema.sql` tenta criar o banco `anotfire` e causará erro de permissão
5. Copiar e colar o conteúdo de `database/schema-hostinger.sql`
6. Executar

### Via Linha de Comando (SSH)

Se você tiver acesso SSH ao servidor:

```bash
mysql -h localhost -u u984823938_fireuser -p u984823938_fire < database/schema.sql
```

Quando solicitado, digite a senha: `fireuser00!`

## Verificar Conexão

### Teste via Node.js

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'u984823938_fireuser',
      password: 'fireuser00!',
      database: 'u984823938_fire'
    });
    
    console.log('✅ Conectado ao MySQL!');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testConnection();
```

## Backup do Banco

### Via phpMyAdmin

1. Selecionar o banco de dados
2. Clicar em "Exportar"
3. Escolher método "Rápido" ou "Personalizado"
4. Baixar o arquivo SQL

### Via Linha de Comando

```bash
mysqldump -h localhost -u u984823938_fireuser -p u984823938_fire > backup_$(date +%Y%m%d).sql
```

## Segurança

⚠️ **IMPORTANTE**:
- Nunca commitar credenciais no Git
- Usar variáveis de ambiente
- Manter senhas fortes
- Fazer backups regulares
- Limitar acesso remoto quando possível

## Troubleshooting

### Erro: "Access denied"
- Verificar se usuário e senha estão corretos
- Verificar se o usuário tem permissões no banco

### Erro: "Can't connect to MySQL server"
- Verificar se está usando `localhost` quando no servidor Hostinger
- Verificar se MySQL remoto está habilitado (para acesso externo)
- Verificar firewall da Hostinger

### Erro: "Unknown database"
- Verificar se o banco `u984823938_fire` existe
- Criar o banco via painel Hostinger se necessário
