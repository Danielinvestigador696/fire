# Anotações para Manutenção - AnotFire CAC

Este arquivo contém anotações importantes para facilitar a manutenção da aplicação.

## Estrutura do Projeto

### Frontend (Expo)
- **Localização**: `app/`
- **Navegação**: Expo Router (baseado em arquivos)
- **Estado Global**: Context API (AuthContext)
- **API**: Serviço em `app/services/api.ts`
- **Tipos**: Compartilhados em `shared/types/`

### Backend (Express)
- **Localização**: `backend/src/`
- **Arquitetura**: Modular (cada módulo em sua pasta)
- **Banco**: MySQL via `database/connection.ts`
- **Autenticação**: JWT via middleware `authenticateToken`
- **Validação**: Zod schemas em cada módulo

### Banco de Dados
- **Schema**: `database/schema.sql`
- **Migrações**: `database/migrations/`
- **Host**: Hostinger MySQL

## Módulos Principais

### 1. Autenticação (`backend/src/modules/auth/`)
- Login/Registro
- JWT tokens
- OAuth (estrutura pronta, implementar providers)

### 2. Usuários (`backend/src/modules/users/`)
- Perfil do usuário
- Atualização de dados

### 3. Equipes (`backend/src/modules/equipes/`)
- CRUD de equipes
- Gestão de membros
- Permissões (admin/membro)

### 4. Armas (`backend/src/modules/armas/`)
- CRUD de armas
- Fotos múltiplas
- Histórico de manutenções

### 5. Documentos (`backend/src/modules/documentos/`)
- CRUD de documentos
- Alertas automáticos de vencimento
- Tipos: CR, PORTE, CAC, LICENCA, SEGURO

### 6. Caça (`backend/src/modules/caca/`)
- Registros de caça de javali
- Fotos e localização GPS
- Privacidade (público/privado)
- Compartilhamento

### 7. Notificações (`backend/src/modules/notificacoes/`)
- Push notifications
- Email notifications
- Preferências do usuário

## Pontos de Atenção

### Segurança
- ✅ JWT tokens implementados
- ✅ Hash de senhas (bcrypt)
- ✅ Validação de dados (Zod)
- ✅ Rate limiting
- ⚠️ OAuth não implementado (estrutura pronta)
- ⚠️ Verificar CORS em produção

### Performance
- ✅ Índices no banco de dados
- ⚠️ Considerar cache para queries frequentes
- ⚠️ Otimizar upload de imagens (compressão)

### Funcionalidades Pendentes
1. **OAuth Google/Facebook**: Estrutura pronta, implementar providers
2. **Upload de Imagens**: Integrar com S3 ou storage
3. **Job de Notificações**: Agendar verificação de documentos vencendo
4. **Testes**: Adicionar testes unitários e de integração

## Como Adicionar Novo Módulo

1. Criar pasta em `backend/src/modules/nome-modulo/`
2. Criar arquivos:
   - `routes.ts` - Rotas do módulo
   - `controller.ts` - Lógica de negócio
   - `schemas.ts` - Validações Zod
3. Adicionar rotas em `backend/src/server.ts`
4. Criar tabelas no banco se necessário
5. Adicionar tipos em `shared/types/index.ts`
6. Criar telas no frontend se necessário

## Como Adicionar Nova Tela

1. Criar arquivo em `app/(tabs)/` ou pasta apropriada
2. Usar `useRouter()` para navegação
3. Usar `api` service para chamadas HTTP
4. Usar `useAuth()` para dados do usuário

## Variáveis de Ambiente Importantes

### Frontend
- `EXPO_PUBLIC_API_URL` - URL da API
  - **Produção (Hostinger)**: `https://api.fire.dgapp.com.br/api`
  - Criar arquivo `.env` na raiz do projeto com esta variável

### Backend (Hostinger)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL (Hostinger)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - Autenticação
- `SMTP_*` - Configuração de email
- `FRONTEND_URL` - CORS (URL do frontend)

## Comandos Úteis

### Desenvolvimento
```bash
# Frontend
npm start
npm run android
npm run ios
npm run web

# Backend (apenas para build, não roda localmente)
cd backend
npm run build  # Para gerar dist/ para upload na Hostinger
```

**Nota:** O backend roda apenas na Hostinger, não localmente.

### Build
```bash
# Frontend
npx expo export:web
eas build --platform android
eas build --platform ios

# Backend
cd backend
npm run build
npm start
```

### Banco de Dados
```bash
# Executar schema
mysql -u root -p < database/schema.sql

# Backup
mysqldump -u root -p anotfire > backup.sql
```

## Troubleshooting Comum

### Backend não conecta ao banco
- Verificar credenciais no `.env`
- Verificar se MySQL está rodando
- Verificar firewall/host

### Frontend não carrega dados
- Verificar `EXPO_PUBLIC_API_URL`
- Verificar CORS no backend
- Verificar token de autenticação

### Notificações não funcionam
- Verificar permissões no dispositivo
- Verificar configuração Expo
- Verificar tokens no banco

## Próximas Melhorias Sugeridas

1. **Testes**: Adicionar Jest/Vitest
2. **CI/CD**: GitHub Actions
3. **Monitoramento**: Logs estruturados
4. **Analytics**: Tracking de uso
5. **Offline**: Cache local com AsyncStorage
6. **PWA**: Melhorar suporte web
7. **Internacionalização**: i18n
8. **Dark Mode**: Tema escuro

## Contatos e Recursos

- **Documentação**: Ver pasta `docs/`
- **API**: Ver `docs/api.md`
- **Deploy**: Ver `docs/deploy.md`
- **Banco de Dados**: Ver `docs/banco-dados.md`

## Notas de Desenvolvimento

- Projeto iniciado em: 2024
- Stack: Expo + Node.js + MySQL
- Padrão: Modular e escalável
- Documentação: Completa em `docs/`
