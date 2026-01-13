# Documentação dos Módulos

## Módulo de Autenticação (`auth`)

### Funcionalidades
- Registro de usuário
- Login com email/senha
- Login com OAuth (Google, Facebook)
- Recuperação de senha
- Refresh token
- Obter perfil do usuário

### Endpoints
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/forgot-password` - Solicitar recuperação de senha
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obter usuário atual

### Validações
- Email válido
- Senha mínimo 6 caracteres
- Nome mínimo 3 caracteres

## Módulo de Usuários (`users`)

### Funcionalidades
- Obter perfil
- Atualizar perfil
- Atualizar avatar

### Endpoints
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `PUT /api/users/avatar` - Atualizar avatar

## Módulo de Equipes (`equipes`)

### Funcionalidades
- Criar equipe
- Listar equipes do usuário
- Obter detalhes da equipe
- Atualizar equipe
- Excluir equipe
- Convidar membros
- Listar membros
- Remover membros

### Endpoints
- `GET /api/equipes` - Listar equipes
- `POST /api/equipes` - Criar equipe
- `GET /api/equipes/:id` - Obter equipe
- `PUT /api/equipes/:id` - Atualizar equipe
- `DELETE /api/equipes/:id` - Excluir equipe
- `POST /api/equipes/:id/membros` - Convidar membro
- `GET /api/equipes/:id/membros` - Listar membros
- `DELETE /api/equipes/:id/membros/:userId` - Remover membro
- `GET /api/equipes/count` - Contar equipes

### Permissões
- Apenas admin pode editar/excluir equipe
- Apenas admin pode convidar/remover membros
- Membros podem ver dados da equipe

## Módulo de Armas (`armas`)

### Funcionalidades
- Cadastrar arma
- Listar armas
- Obter detalhes da arma
- Atualizar arma
- Excluir arma
- Adicionar fotos
- Remover fotos
- Registrar manutenções
- Listar manutenções

### Endpoints
- `GET /api/armas` - Listar armas
- `GET /api/armas/:id` - Obter arma
- `POST /api/armas` - Cadastrar arma
- `PUT /api/armas/:id` - Atualizar arma
- `DELETE /api/armas/:id` - Excluir arma
- `POST /api/armas/:id/fotos` - Adicionar foto
- `DELETE /api/armas/:id/fotos/:fotoId` - Remover foto
- `POST /api/armas/:id/manutencoes` - Registrar manutenção
- `GET /api/armas/:id/manutencoes` - Listar manutenções
- `GET /api/armas/count` - Contar armas

### Validações
- Número de série obrigatório e único por usuário
- Modelo obrigatório
- Calibre obrigatório

## Módulo de Documentos (`documentos`)

### Funcionalidades
- Cadastrar documento
- Listar documentos
- Listar documentos vencendo
- Obter detalhes do documento
- Atualizar documento
- Excluir documento
- Alertas automáticos (90, 30, 0 dias)

### Endpoints
- `GET /api/documentos` - Listar documentos
- `GET /api/documentos/vencendo` - Listar vencendo
- `GET /api/documentos/:id` - Obter documento
- `POST /api/documentos` - Cadastrar documento
- `PUT /api/documentos/:id` - Atualizar documento
- `DELETE /api/documentos/:id` - Excluir documento

### Tipos de Documentos
- CR (Certificado de Registro)
- PORTE (Porte de Arma)
- CAC (Registro CAC)
- LICENCA (Licenças especiais)
- SEGURO (Seguro)

## Módulo de Caça (`caca`)

### Funcionalidades
- Registrar caça
- Listar registros
- Obter detalhes do registro
- Atualizar registro
- Excluir registro
- Visualizar mapa com localizações
- Compartilhar registro

### Endpoints
- `GET /api/caca` - Listar registros
- `GET /api/caca/mapa` - Obter localizações para mapa
- `GET /api/caca/:id` - Obter registro
- `POST /api/caca` - Registrar caça
- `PUT /api/caca/:id` - Atualizar registro
- `DELETE /api/caca/:id` - Excluir registro
- `POST /api/caca/:id/compartilhar` - Compartilhar
- `GET /api/caca/count` - Contar registros

### Privacidade
- Registros privados: apenas usuário e equipe veem
- Registros públicos: todos os usuários veem
- Filtros por equipe disponíveis

## Módulo de Notificações (`notificacoes`)

### Funcionalidades
- Listar notificações
- Listar não lidas
- Marcar como lida
- Marcar todas como lidas
- Gerenciar preferências
- Push notifications
- Email notifications

### Endpoints
- `GET /api/notificacoes` - Listar notificações
- `GET /api/notificacoes/nao-lidas` - Listar não lidas
- `PUT /api/notificacoes/:id/lida` - Marcar como lida
- `PUT /api/notificacoes/todas-lidas` - Marcar todas como lidas
- `GET /api/notificacoes/preferencias` - Obter preferências
- `PUT /api/notificacoes/preferencias` - Atualizar preferências
- `POST /api/notificacoes/token` - Registrar push token

### Tipos de Notificações
- DOCUMENTO_VENCENDO
- CONVITE_EQUIPE
- NOVA_CACA
- ALERTA_SISTEMA
