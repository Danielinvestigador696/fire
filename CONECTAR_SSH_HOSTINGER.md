# 🔌 Como Conectar via SSH na Hostinger

## Método 1: PowerShell/CMD (Windows)

### Passo 1: Abrir PowerShell

1. Pressione `Win + X`
2. Selecione "Windows PowerShell" ou "Terminal"
3. Ou pesquise "PowerShell" no menu Iniciar

### Passo 2: Conectar via SSH

```powershell
ssh u984823938@ssh.hostinger.com -p 65002
```

**Substitua**:
- `u984823938` pelo seu usuário SSH da Hostinger
- `ssh.hostinger.com` pelo host SSH fornecido pela Hostinger (pode ser um IP também)
- `65002` pela porta SSH (geralmente 65002 na Hostinger)

### Passo 3: Inserir Senha

Quando solicitado, digite a senha SSH (a senha não aparecerá enquanto você digita - isso é normal).

### Passo 4: Verificar Conexão

Se conectado com sucesso, você verá algo como:
```
Welcome to Hostinger...
u984823938@server:~$
```

---

## Método 2: PuTTY (Windows - Recomendado para Iniciantes)

### Passo 1: Baixar PuTTY

1. Acesse: https://www.putty.org/
2. Baixe o instalador
3. Instale o PuTTY

### Passo 2: Configurar Conexão

1. Abra o PuTTY
2. Preencha:
   - **Host Name (or IP address)**: `ssh.hostinger.com` (ou IP fornecido)
   - **Port**: `65002`
   - **Connection type**: SSH (já selecionado)
3. Clique em "Open"

### Passo 3: Aceitar Certificado

Na primeira conexão, aparecerá um aviso de segurança. Clique em "Yes".

### Passo 4: Inserir Credenciais

1. **Login as**: `u984823938` (seu usuário SSH)
2. **Password**: (digite sua senha SSH - não aparecerá)

---

## Método 3: Git Bash (Windows)

Se você tem Git instalado:

1. Abra "Git Bash"
2. Execute:
```bash
ssh u984823938@ssh.hostinger.com -p 65002
```

---

## Método 4: VS Code Remote SSH (Avançado)

### Passo 1: Instalar Extensão

1. Abra VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Procure por "Remote - SSH"
4. Instale a extensão

### Passo 2: Conectar

1. Pressione `F1` ou `Ctrl+Shift+P`
2. Digite "Remote-SSH: Connect to Host"
3. Selecione "Add New SSH Host"
4. Digite: `ssh u984823938@ssh.hostinger.com -p 65002`
5. Escolha o arquivo de configuração
6. Clique em "Connect"

---

## 🔑 Obtendo Credenciais SSH

### No Painel Hostinger:

1. Acesse o painel Hostinger
2. Vá em "SSH" ou "Acesso SSH"
3. Anote:
   - **Host**: (ex: `ssh.hostinger.com` ou IP)
   - **Porta**: (geralmente `65002`)
   - **Usuário**: (ex: `u984823938`)
   - **Senha**: (sua senha SSH)

### Se SSH não estiver habilitado:

1. No painel Hostinger, procure por "SSH Access"
2. Ative o acesso SSH
3. Defina uma senha SSH
4. Anote as credenciais

---

## ✅ Testar Conexão

Após conectar, teste com:

```bash
# Verificar onde você está
pwd

# Verificar Node.js
node --version

# Navegar para pasta do projeto
cd ~/domains/fire.dgapp.com.br/public_html/api
# ou
cd ~/public_html/api

# Listar arquivos
ls -la
```

---

## ❌ Problemas Comuns

### Erro: "Connection refused"

**Causa**: SSH não habilitado ou porta errada

**Solução**:
- Verificar se SSH está habilitado no painel Hostinger
- Verificar se a porta está correta (geralmente 65002)

### Erro: "Permission denied"

**Causa**: Usuário ou senha incorretos

**Solução**:
- Verificar credenciais no painel Hostinger
- Tentar resetar senha SSH

### Erro: "Host key verification failed"

**Causa**: Certificado SSH mudou

**Solução** (PowerShell):
```powershell
# Remover chave antiga
ssh-keygen -R ssh.hostinger.com
# Tentar conectar novamente
```

---

## 📝 Próximos Passos Após Conectar

1. Navegar para pasta do backend:
   ```bash
   cd ~/domains/fire.dgapp.com.br/public_html/api
   ```

2. Seguir o guia: `DIAGNOSTICO_BACKEND_HOSTINGER.md`

3. Executar script de setup:
   ```bash
   bash scripts/setup-hostinger.sh
   ```

---

## 🔄 Desconectar

Para desconectar do SSH:
```bash
exit
```
ou pressione `Ctrl+D`
