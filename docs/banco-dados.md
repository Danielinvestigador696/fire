# Documentação do Banco de Dados

## Visão Geral

Banco de dados MySQL hospedado na Hostinger, seguindo padrões de normalização e boas práticas.

## Estrutura das Tabelas

### users
Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| name | VARCHAR(255) | Nome completo |
| email | VARCHAR(255) | Email (único) |
| password | VARCHAR(255) | Hash da senha (bcrypt) |
| avatar | VARCHAR(500) | URL do avatar |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### equipes
Armazena equipes de caça.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| nome | VARCHAR(255) | Nome da equipe |
| descricao | TEXT | Descrição opcional |
| admin_id | INT | FK para users.id |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### equipe_membros
Relação muitos-para-muitos entre usuários e equipes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| equipe_id | INT | FK para equipes.id |
| user_id | INT | FK para users.id |
| role | ENUM | 'admin' ou 'membro' |
| created_at | TIMESTAMP | Data de entrada |

### armas
Cadastro de armas dos usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| user_id | INT | FK para users.id |
| equipe_id | INT | FK para equipes.id (opcional) |
| numero_serie | VARCHAR(255) | Número de série |
| modelo | VARCHAR(255) | Modelo da arma |
| calibre | VARCHAR(50) | Calibre |
| fabricante | VARCHAR(255) | Fabricante |
| tipo | VARCHAR(100) | Tipo da arma |
| observacoes | TEXT | Observações |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### arma_fotos
Fotos das armas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| arma_id | INT | FK para armas.id |
| url | VARCHAR(500) | URL da foto |
| ordem | INT | Ordem de exibição |
| created_at | TIMESTAMP | Data de upload |

### documentos
Documentos com validade (CR, Porte, CAC, Licenças, Seguro).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| user_id | INT | FK para users.id |
| tipo | ENUM | 'CR', 'PORTE', 'CAC', 'LICENCA', 'SEGURO' |
| numero | VARCHAR(255) | Número do documento |
| orgao_emissor | VARCHAR(255) | Órgão emissor |
| data_emissao | DATE | Data de emissão |
| data_vencimento | DATE | Data de vencimento |
| arquivo_url | VARCHAR(500) | URL do arquivo PDF |
| observacoes | TEXT | Observações |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### documento_alertas
Controle de alertas enviados para documentos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| documento_id | INT | FK para documentos.id |
| dias_antes | INT | Dias antes do vencimento (90, 30, 0) |
| enviado | BOOLEAN | Se o alerta foi enviado |
| enviado_em | TIMESTAMP | Data de envio |

### caca_registros
Registros de caça de javali.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| user_id | INT | FK para users.id |
| equipe_id | INT | FK para equipes.id (opcional) |
| publico | BOOLEAN | Se é público ou privado |
| foto_url | VARCHAR(500) | URL da foto principal |
| latitude | DECIMAL(10,8) | Latitude GPS |
| longitude | DECIMAL(11,8) | Longitude GPS |
| data | DATETIME | Data/hora da caça |
| peso | DECIMAL(6,2) | Peso em kg |
| tamanho | DECIMAL(6,2) | Tamanho em cm |
| observacoes | TEXT | Observações |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

### notificacoes
Histórico de notificações.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| user_id | INT | FK para users.id |
| tipo | ENUM | Tipo da notificação |
| titulo | VARCHAR(255) | Título |
| mensagem | TEXT | Mensagem |
| lida | BOOLEAN | Se foi lida |
| created_at | TIMESTAMP | Data de criação |

### notificacao_preferencias
Preferências de notificação dos usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK, Auto increment |
| user_id | INT | FK para users.id |
| tipo_notificacao | ENUM | Tipo de notificação |
| email | BOOLEAN | Receber por email |
| push | BOOLEAN | Receber push |
| dias_antes | INT | Dias antes (para documentos) |

## Relacionamentos

- **users** 1:N **equipes** (admin_id)
- **users** N:M **equipes** (via equipe_membros)
- **users** 1:N **armas**
- **users** 1:N **documentos**
- **users** 1:N **caca_registros**
- **users** 1:N **notificacoes**
- **equipes** 1:N **armas** (opcional)
- **equipes** 1:N **caca_registros** (opcional)
- **armas** 1:N **arma_fotos**
- **armas** 1:N **arma_documentos**
- **armas** 1:N **arma_manutencoes**
- **documentos** 1:N **documento_alertas**
- **caca_registros** 1:N **caca_fotos**
- **caca_registros** 1:N **compartilhamentos**

## Índices

Índices criados para otimizar queries:
- `users.email` (único)
- `equipe_membros.equipe_id` + `user_id` (único)
- `armas.numero_serie`
- `documentos.data_vencimento`
- `caca_registros.latitude` + `longitude`
- `notificacoes.user_id` + `lida`

## Migrações

As migrações estão em `database/migrations/`. Execute na ordem numérica.

## Seeds

Scripts de seed para dados iniciais (opcional) em `database/seeds/`.
