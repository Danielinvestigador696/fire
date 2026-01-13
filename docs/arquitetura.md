# Arquitetura do Sistema AnotFire CAC

## Visão Geral

O AnotFire CAC é uma aplicação multiplataforma desenvolvida com Expo (React Native) para Android, iOS e Web, com backend em Node.js/Express e banco de dados MySQL.

## Arquitetura Geral

```
┌─────────────────┐
│   Frontend      │
│   (Expo/RN)     │
│   Android/iOS/Web│
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │
│   (Express)     │
│   TypeScript    │
└────────┬────────┘
         │
┌────────▼────────┐
│   MySQL         │
│   (Hostinger)   │
└─────────────────┘
```

## Estrutura do Frontend

### Tecnologias
- **Expo SDK 51+**: Framework React Native
- **TypeScript**: Tipagem estática
- **Expo Router**: Navegação baseada em arquivos
- **React Navigation**: Navegação entre telas
- **Context API**: Gerenciamento de estado global (autenticação)

### Estrutura de Pastas
```
app/
├── (auth)/          # Telas de autenticação
├── (tabs)/          # Navegação principal (tabs)
├── contexts/        # Contextos React
├── services/        # Serviços (API, notificações)
└── components/      # Componentes reutilizáveis
```

## Estrutura do Backend

### Tecnologias
- **Node.js + Express**: Servidor HTTP
- **TypeScript**: Tipagem estática
- **MySQL2**: Driver MySQL
- **JWT**: Autenticação
- **Zod**: Validação de dados
- **Nodemailer**: Envio de emails
- **Expo Notifications**: Push notifications

### Arquitetura Modular
```
backend/src/
├── modules/         # Módulos de negócio
│   ├── auth/
│   ├── users/
│   ├── equipes/
│   ├── armas/
│   ├── documentos/
│   ├── caca/
│   └── notificacoes/
├── database/         # Conexão com banco
├── middleware/       # Middlewares (auth, validação)
├── services/         # Serviços (notificações)
└── utils/           # Utilitários
```

## Fluxo de Autenticação

1. Usuário faz login (email/senha ou OAuth)
2. Backend valida credenciais
3. Backend gera JWT token e refresh token
4. Frontend armazena token no AsyncStorage
5. Todas as requisições incluem token no header Authorization
6. Middleware `authenticateToken` valida token em cada requisição

## Fluxo de Dados

### Criar Registro de Caça
1. Usuário preenche formulário e tira foto
2. Frontend captura localização GPS
3. Frontend envia dados para `/api/caca`
4. Backend valida dados e salva no banco
5. Se houver equipe, cria notificações para membros
6. Backend retorna registro criado
7. Frontend atualiza lista

### Notificações de Documentos
1. Job agendado verifica documentos vencendo
2. Para cada documento próximo ao vencimento:
   - Verifica preferências do usuário
   - Envia push notification (se habilitado)
   - Envia email (se habilitado)
   - Marca alerta como enviado

## Segurança

- **JWT Tokens**: Autenticação stateless
- **Refresh Tokens**: Renovação de sessão
- **Validação de Dados**: Zod schemas
- **Rate Limiting**: Proteção contra abuso
- **CORS**: Configurado para frontend específico
- **Helmet**: Headers de segurança HTTP
- **Hash de Senhas**: bcryptjs

## Privacidade de Dados

- Dados de equipe são privados por padrão
- Apenas membros da equipe podem ver dados da equipe
- Usuário pode marcar registros de caça como públicos
- Dados públicos são visíveis para todos os usuários

## Escalabilidade

- Backend modular facilita adição de novos recursos
- Banco de dados indexado para performance
- Cache de queries quando necessário
- Separação de concerns (MVC-like)
