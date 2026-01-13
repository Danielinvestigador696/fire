# 📤 Configurar GitHub e Fazer Push

O commit do backend foi criado com sucesso! Agora você precisa configurar o repositório remoto no GitHub.

## ✅ Commit Criado

```
Commit: 5897b23
Mensagem: feat: adicionar backend completo com suporte a Hostinger
Arquivos: 49 arquivos, 7204 linhas adicionadas
```

---

## 📋 Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `anotfire` (ou o nome que preferir)
   - **Description**: "Aplicativo CAC - Caçador, Atirador e Colecionador"
   - **Visibility**: Escolha Público ou Privado
   - **NÃO** marque "Initialize with README" (já temos arquivos)
3. Clique em "Create repository"

---

## 📋 Passo 2: Configurar Remote

Após criar o repositório, o GitHub mostrará comandos. Use estes comandos:

### Opção A: HTTPS (Recomendado)

```bash
git remote add origin https://github.com/SEU_USUARIO/anotfire.git
git branch -M main
git push -u origin main
```

**Substitua** `SEU_USUARIO` pelo seu usuário do GitHub.

### Opção B: SSH (Se você tem chave SSH configurada)

```bash
git remote add origin git@github.com:SEU_USUARIO/anotfire.git
git branch -M main
git push -u origin main
```

---

## 📋 Passo 3: Fazer Push

Execute o comando de push:

```bash
git push -u origin main
```

Se for a primeira vez, o GitHub pode pedir autenticação:
- **HTTPS**: Usuário e Personal Access Token (não senha)
- **SSH**: Usa sua chave SSH automaticamente

---

## 🔑 Criar Personal Access Token (HTTPS)

Se usar HTTPS e pedir autenticação:

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Preencha:
   - **Note**: "anotfire-backend"
   - **Expiration**: Escolha um prazo
   - **Scopes**: Marque `repo` (acesso completo a repositórios)
4. Clique em "Generate token"
5. **COPIE O TOKEN** (você não verá novamente!)
6. Use o token como senha quando o Git pedir

---

## ✅ Verificar Push

Após o push, acesse seu repositório no GitHub:
```
https://github.com/SEU_USUARIO/anotfire
```

Você deve ver todos os arquivos do backend!

---

## 📝 Próximos Commits

Para fazer commits futuros:

```bash
# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "sua mensagem de commit"

# Fazer push
git push
```

---

## 🔄 Comandos Úteis

```bash
# Ver status
git status

# Ver histórico
git log --oneline

# Ver remotes configurados
git remote -v

# Mudar branch para main (se necessário)
git branch -M main
```

---

## ❌ Problemas Comuns

### Erro: "remote origin already exists"

```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/SEU_USUARIO/anotfire.git
```

### Erro: "Authentication failed"

- Verifique se está usando Personal Access Token (não senha)
- Ou configure SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Erro: "branch main does not exist"

```bash
# Renomear branch atual para main
git branch -M main
```

---

## 📚 Documentação GitHub

- Criar repositório: https://docs.github.com/en/get-started/quickstart/create-a-repo
- Personal Access Token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- Configurar SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
