# Troubleshooting - Network Error

## Problemas Comuns e Soluções

### 1. Backend não está rodando

**Sintoma:** Network error ao tentar acessar qualquer endpoint

**Solução:**
```bash
cd backend
npm install
npm run dev
```

Verifique se aparece a mensagem:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
```

### 2. URL da API incorreta

**Sintoma:** Network error, especialmente em dispositivos móveis

**Problema:** `localhost` não funciona em dispositivos móveis ou web

**Solução:**

1. **Para desenvolvimento local:**
   - Android Emulator: use `10.0.2.2:3000`
   - iOS Simulator: use `localhost:3000`
   - Dispositivo físico: use o IP da sua máquina (ex: `192.168.1.100:3000`)

2. **Criar arquivo `.env` na raiz do projeto:**
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
   ```
   Substitua `192.168.1.100` pelo IP da sua máquina.

3. **Descobrir seu IP:**
   - Windows: `ipconfig` (procure por IPv4)
   - Mac/Linux: `ifconfig` ou `ip addr`

### 3. CORS bloqueando requisições

**Sintoma:** Network error no navegador/web

**Solução:**

No `backend/src/server.ts`, verificar:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

Se estiver usando web, adicionar:
```typescript
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', '*'],
  credentials: true,
}));
```

### 4. Erro no middleware de autenticação

**Sintoma:** Network error ao fazer login ou acessar rotas protegidas

**Verificar:**
- Token está sendo enviado no header?
- JWT_SECRET está configurado no `.env`?

### 5. Banco de dados não conectado

**Sintoma:** Erro ao iniciar backend

**Verificar:**
- Credenciais no `.env` do backend
- MySQL está rodando?
- Banco de dados existe?

### 6. Porta já em uso

**Sintoma:** Erro ao iniciar backend

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

## Testar Conexão

### 1. Testar backend diretamente

```bash
# No navegador ou Postman
GET http://localhost:3000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 2. Testar endpoint de admin

```bash
# Com token de admin
GET http://localhost:3000/api/admin/estatisticas
Authorization: Bearer <seu-token>
```

### 3. Verificar logs do backend

Os logs devem mostrar:
- Conexão com banco de dados
- Requisições recebidas
- Erros (se houver)

## Checklist

- [ ] Backend está rodando?
- [ ] URL da API está correta no `.env`?
- [ ] CORS está configurado?
- [ ] Banco de dados está conectado?
- [ ] Token está sendo enviado?
- [ ] Usuário tem role 'admin'?
- [ ] Porta 3000 está livre?
