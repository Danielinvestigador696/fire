# Documentação da API REST

## Base URL

```
http://localhost:3000/api
```

## Autenticação

Todas as rotas protegidas requerem token JWT no header:

```
Authorization: Bearer <token>
```

## Respostas de Erro

### 400 Bad Request
```json
{
  "error": "Mensagem de erro",
  "details": ["Detalhes de validação"]
}
```

### 401 Unauthorized
```json
{
  "error": "Token não fornecido"
}
```

### 403 Forbidden
```json
{
  "error": "Acesso negado"
}
```

### 404 Not Found
```json
{
  "error": "Recurso não encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Erro interno do servidor"
}
```

## Endpoints Principais

### Autenticação

#### POST /auth/register
Registrar novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

#### POST /auth/login
Fazer login.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** (mesmo formato de register)

### Equipes

#### GET /equipes
Listar equipes do usuário.

**Response:**
```json
{
  "equipes": [
    {
      "id": 1,
      "nome": "Equipe Alpha",
      "descricao": "Equipe de caça",
      "admin_id": 1,
      "role": "admin"
    }
  ]
}
```

#### POST /equipes
Criar nova equipe.

**Body:**
```json
{
  "nome": "Equipe Alpha",
  "descricao": "Equipe de caça"
}
```

### Armas

#### GET /armas
Listar armas do usuário.

**Query Params:**
- `equipeId` (opcional): Filtrar por equipe

**Response:**
```json
{
  "armas": [
    {
      "id": 1,
      "numeroSerie": "123456",
      "modelo": "Taurus",
      "calibre": ".40",
      "fotos": ["url1", "url2"]
    }
  ]
}
```

#### POST /armas
Cadastrar nova arma.

**Body:**
```json
{
  "numeroSerie": "123456",
  "modelo": "Taurus",
  "calibre": ".40",
  "fabricante": "Taurus",
  "tipo": "Pistola",
  "observacoes": "Observações",
  "equipeId": 1
}
```

### Documentos

#### GET /documentos/vencendo
Listar documentos próximos ao vencimento.

**Response:**
```json
{
  "documentos": [
    {
      "id": 1,
      "tipo": "CR",
      "numero": "12345",
      "dataVencimento": "2024-03-15",
      "diasRestantes": 30,
      "status": "vencendo"
    }
  ],
  "count": 1
}
```

#### POST /documentos
Cadastrar novo documento.

**Body:**
```json
{
  "tipo": "CR",
  "numero": "12345",
  "orgaoEmissor": "Polícia Federal",
  "dataEmissao": "2023-01-15",
  "dataVencimento": "2024-01-15",
  "arquivoUrl": "https://...",
  "observacoes": "Observações"
}
```

### Caça

#### GET /caca
Listar registros de caça.

**Query Params:**
- `equipeId` (opcional): Filtrar por equipe
- `publico` (opcional): true/false
- `dataInicio` (opcional): Data inicial
- `dataFim` (opcional): Data final

**Response:**
```json
{
  "registros": [
    {
      "id": 1,
      "fotoUrl": "https://...",
      "latitude": -23.5505,
      "longitude": -46.6333,
      "data": "2024-01-15T10:00:00Z",
      "peso": 80.5,
      "tamanho": 150,
      "publico": false
    }
  ]
}
```

#### POST /caca
Registrar nova caça.

**Body:**
```json
{
  "fotoUrl": "https://...",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "data": "2024-01-15T10:00:00Z",
  "peso": 80.5,
  "tamanho": 150,
  "observacoes": "Observações",
  "equipeId": 1,
  "publico": false
}
```

#### GET /caca/mapa
Obter localizações para exibir no mapa.

**Response:**
```json
{
  "localizacoes": [
    {
      "id": 1,
      "latitude": -23.5505,
      "longitude": -46.6333,
      "data": "2024-01-15",
      "fotoUrl": "https://..."
    }
  ]
}
```

### Notificações

#### GET /notificacoes
Listar notificações.

**Query Params:**
- `tipo` (opcional): Filtrar por tipo
- `lida` (opcional): true/false

**Response:**
```json
{
  "notificacoes": [
    {
      "id": 1,
      "tipo": "DOCUMENTO_VENCENDO",
      "titulo": "Documento vencendo",
      "mensagem": "Seu CR vence em 30 dias",
      "lida": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```
