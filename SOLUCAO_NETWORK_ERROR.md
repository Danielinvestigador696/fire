# Solução para Network Error no Admin

## Verificações Rápidas

### 1. Backend está rodando?

```bash
cd backend
npm run dev
```

Você deve ver:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
```

### 2. URL da API está correta?

**Problema comum:** `localhost` não funciona em dispositivos móveis!

**Solução:**

1. Descubra o IP da sua máquina:
   - Windows: Abra CMD e digite `ipconfig`
   - Procure por "IPv4" (ex: 192.168.1.100)

2. Crie/edite o arquivo `.env` na raiz do projeto:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
   ```
   **Substitua 192.168.1.100 pelo seu IP!**

3. Reinicie o Expo:
   ```bash
   npm start
   ```

### 3. Testar conexão manualmente

No navegador, acesse:
```
http://localhost:3000/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

Se não funcionar, o backend não está rodando.

### 4. Verificar token de admin

1. Faça login com o email do admin: `danielinvestigador@gmail.com`
2. Verifique se o token está sendo salvo
3. Verifique se o usuário tem `role: 'admin'` no banco

### 5. Verificar logs do backend

Quando você tenta acessar o admin, o backend deve mostrar logs:
```
GET /api/admin/usuarios 200
```

Se não aparecer nada, a requisição não está chegando ao backend.

## Solução Rápida

1. **Iniciar backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Configurar IP no .env:**
   ```env
   EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000/api
   ```

3. **Reiniciar Expo:**
   ```bash
   npm start
   ```

4. **Fazer login como admin novamente**

## Se ainda não funcionar

1. Verifique o console do navegador/Expo para ver o erro completo
2. Verifique os logs do backend
3. Teste a rota `/health` diretamente no navegador
4. Verifique se o firewall não está bloqueando a porta 3000
