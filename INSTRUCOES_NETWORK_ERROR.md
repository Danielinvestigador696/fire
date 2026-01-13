# 🔧 Solução para Network Error

## Problema
O erro mostra que está tentando acessar `http://localhost:3000/api`, mas em dispositivos móveis físicos, `localhost` não funciona.

## ✅ Solução Rápida

### 1. Criar arquivo `.env` na raiz do projeto

Crie um arquivo chamado `.env` (sem extensão) na pasta raiz do projeto (mesmo nível do `package.json`) com:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.17:3000/api
```

**Importante:** Substitua `192.168.1.17` pelo IP da sua máquina se for diferente.

### 2. Descobrir seu IP

**Windows:**
```bash
ipconfig
```
Procure por "Endereço IPv4" (ex: 192.168.1.17)

**Mac/Linux:**
```bash
ifconfig
# ou
ip addr
```

### 3. Reiniciar o Expo

```bash
# Pare o Expo (Ctrl+C)
# Limpe o cache e reinicie:
npm start -- --clear
```

### 4. Verificar Backend

Certifique-se de que o backend está rodando:

```bash
cd backend
npm run dev
```

Deve aparecer:
```
✅ Banco de dados conectado
🚀 Servidor rodando na porta 3000
```

### 5. Testar Conexão

No navegador, acesse:
```
http://192.168.1.17:3000/health
```

Deve retornar: `{"status":"ok",...}`

## 📝 Notas

- **Dispositivo físico:** Use o IP da máquina (ex: `192.168.1.17`)
- **Emulador Android:** Pode usar `10.0.2.2:3000`
- **Simulador iOS:** Pode usar `localhost:3000`
- **Web:** Pode usar `localhost:3000`

## ⚠️ Se o IP mudar

Se você mudar de rede Wi-Fi, o IP pode mudar. Atualize o arquivo `.env` com o novo IP.

## 🔍 Verificar se funcionou

Após criar o `.env` e reiniciar:
1. O erro de network deve desaparecer
2. O login deve funcionar
3. As requisições devem chegar ao backend
