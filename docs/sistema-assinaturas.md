# Sistema de Assinaturas e Limite de Uso

## Implementação Completa

Sistema de controle de acesso implementado com trial gratuito de 15 dias e liberação manual pelo admin.

## Funcionalidades Implementadas

### Backend

1. **Tabela de Assinaturas** (`assinaturas`)
   - Tipos: TRIAL, PAGO
   - Status: ATIVA, EXPIRADA, CANCELADA
   - Controle de datas e dias restantes

2. **Campo Role em Users**
   - Tipos: 'user', 'admin'
   - Usuário admin inicial: danielinvestigador@gmail.com

3. **Módulo de Assinaturas** (`backend/src/modules/assinaturas/`)
   - GET `/api/assinaturas/status` - Status atual do usuário
   - GET `/api/assinaturas` - Listar todas (admin)
   - POST `/api/assinaturas/liberar` - Liberar usuário (admin)

4. **Módulo Admin** (`backend/src/modules/admin/`)
   - GET `/api/admin/usuarios` - Listar todos usuários
   - GET `/api/admin/assinaturas` - Listar todas assinaturas
   - POST `/api/admin/usuarios/:id/liberar` - Liberar usuário
   - POST `/api/admin/usuarios/:id/cancelar` - Cancelar assinatura
   - GET `/api/admin/estatisticas` - Estatísticas gerais

5. **Middlewares**
   - `checkSubscription` - Verifica se usuário tem assinatura ativa
   - `checkAdmin` - Verifica se usuário é admin
   - Aplicado em todas rotas protegidas (exceto auth e status)

6. **Modificações no Auth**
   - Criação automática de trial (15 dias) no registro
   - Retorno de status da assinatura no login

### Frontend

1. **Componentes**
   - `SubscriptionBanner` - Banner de aviso de trial
   - `BlockedScreen` - Tela de bloqueio quando expirado

2. **Telas**
   - `app/(tabs)/assinatura.tsx` - Tela de status da assinatura
   - `app/(tabs)/admin.tsx` - Painel admin para gerenciar usuários

3. **Context**
   - `AuthContext` atualizado com status de assinatura

## Fluxo de Funcionamento

### Novo Usuário
1. Registra no sistema
2. Sistema cria automaticamente assinatura TRIAL
3. `data_inicio` = hoje
4. `data_fim` = hoje + 15 dias
5. `status` = 'ATIVA'

### Durante Trial
- Usuário pode usar todas funcionalidades
- Banner mostra dias restantes
- Aviso quando restam 3 dias ou menos

### Após Expiração
- `status` muda para 'EXPIRADA'
- Middleware bloqueia acesso
- Frontend mostra tela de bloqueio
- Usuário pode solicitar liberação

### Liberação pelo Admin
1. Admin acessa painel (`/admin`)
2. Visualiza lista de usuários com status
3. Clica em "Liberar" para usuário
4. Sistema cria assinatura PAGO
5. `status` = 'ATIVA'
6. `data_fim` = NULL (sem expiração) ou data definida

## Banco de Dados

### Migrações

1. **002_add_subscriptions.sql**
   - Adiciona campo `role` em `users`
   - Cria tabela `assinaturas`

2. **001_create_admin.sql**
   - Cria usuário admin inicial
   - Email: danielinvestigador@gmail.com
   - Senha: Admin@2024 (alterar após primeiro login)

### Executar Migrações

```sql
-- No phpMyAdmin, executar:
-- 1. database/migrations/002_add_subscriptions.sql
-- 2. database/seeds/001_create_admin.sql
```

## Segurança

- Apenas admin pode liberar usuários
- Verificação de role em todas rotas admin
- Middleware valida assinatura em cada requisição
- Admin não precisa de assinatura (sempre tem acesso)

## Notas Importantes

1. **Senha do Admin**: A senha padrão é "Admin@2024" - deve ser alterada após primeiro login
2. **Hash da Senha**: O hash no seed é um placeholder. Gerar hash real com bcrypt antes de usar
3. **Trial**: Todos novos usuários recebem 15 dias automaticamente
4. **Liberação**: Apenas admin pode liberar manualmente via painel

## Próximos Passos

1. Gerar hash real da senha do admin
2. Executar migrações no banco
3. Testar fluxo completo
4. Configurar notificações de expiração (opcional)
