# AnotFire CAC

Aplicativo completo para Caçadores, Atiradores e Colecionadores (CAC) desenvolvido com Expo, React Native e Node.js.

## Funcionalidades

- ✅ Controle de armas com fotos e documentos
- ✅ Gestão de documentos com alertas de vencimento
- ✅ Registro de caça de javali com fotos e localização GPS
- ✅ Sistema de equipes com privacidade de dados
- ✅ Compartilhamento público em redes sociais
- ✅ Notificações push e por email
- ✅ Dashboard com estatísticas

## Tecnologias

### Frontend
- Expo SDK 51+
- React Native
- TypeScript
- Expo Router
- React Navigation

### Backend
- Node.js + Express
- TypeScript
- MySQL (Hostinger)
- JWT Authentication
- Nodemailer (Email)
- Expo Notifications (Push)

## Estrutura do Projeto

```
anotfire/
├── app/                    # Frontend Expo
│   ├── (auth)/            # Telas de autenticação
│   ├── (tabs)/            # Navegação principal
│   ├── contexts/          # Contextos React
│   └── services/          # Serviços (API, notificações)
├── backend/               # API REST
│   └── src/
│       ├── modules/       # Módulos modulares
│       ├── database/     # Conexão MySQL
│       └── middleware/    # Middlewares
├── database/              # Scripts SQL
│   └── schema.sql         # Schema completo
└── docs/                  # Documentação
```

## Instalação

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)

### Frontend

```bash
# Instalar dependências
npm install

# Configurar .env com URL da API da Hostinger
# Criar arquivo .env na raiz:
# EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api

# Iniciar desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Backend (Hostinger)

O backend roda na Hostinger. Para deploy, veja `docs/deploy-hostinger-backend.md`.

**Resumo:**
1. Build: `cd backend && npm run build`
2. Upload para Hostinger
3. Instalar dependências na Hostinger
4. Configurar `.env` na Hostinger
5. Iniciar com PM2

## Configuração

### Frontend

Criar arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://api.fire.dgapp.com.br/api
```

### Backend (Hostinger)

Configurar `.env` na Hostinger com:
- Banco de dados MySQL (credenciais da Hostinger)
- JWT secrets
- SMTP para emails
- Ver `backend/CONFIGURACAO_HOSTINGER.md` para detalhes

### Banco de Dados

O banco está na Hostinger. Executar migrações via phpMyAdmin:
- `database/migrations/002_add_subscriptions.sql`
- `database/seeds/001_create_admin.sql`

## Documentação

- [Arquitetura](docs/arquitetura.md)
- [Banco de Dados](docs/banco-dados.md)
- [Módulos](docs/modulos.md)
- [API](docs/api.md)
- [Deploy](docs/deploy.md)

## Deploy

### Backend (Hostinger)

1. Fazer upload dos arquivos
2. Configurar Node.js no painel
3. Executar migrações do banco
4. Configurar variáveis de ambiente
5. Iniciar com PM2

### Frontend

- **Web**: Deploy na Hostinger, Vercel ou Netlify
- **Android/iOS**: Build com EAS (`eas build`)

Ver [docs/deploy.md](docs/deploy.md) para detalhes completos.

## Desenvolvimento

### Estrutura Modular

O projeto segue arquitetura modular:
- Cada módulo tem suas próprias rotas, controllers e schemas
- Fácil manutenção e extensão
- Separação de concerns

### Adicionar Novo Módulo

1. Criar pasta em `backend/src/modules/`
2. Criar `routes.ts`, `controller.ts`, `schemas.ts`
3. Adicionar rotas em `server.ts`
4. Criar tabelas no banco se necessário

## Segurança

- JWT com refresh tokens
- Validação de dados (Zod)
- Rate limiting
- CORS configurado
- Hash de senhas (bcrypt)
- Sanitização de inputs

## Licença

Este projeto é privado e proprietário.

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
