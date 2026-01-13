#!/bin/bash
# Script de Setup Automático para Hostinger
# Execute: bash setup-hostinger.sh

set -e  # Parar em caso de erro

echo "🚀 Configurando Backend na Hostinger..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Por favor, instale Node.js ou contate o suporte Hostinger."
    exit 1
fi

# Verificar npm
echo "📦 Verificando npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm instalado: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi

# Verificar se está na pasta correta
echo ""
echo "📁 Verificando estrutura de pastas..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado!${NC}"
    echo "Certifique-se de estar na pasta public_html/api/"
    exit 1
fi
echo -e "${GREEN}✅ package.json encontrado${NC}"

# Verificar .env
echo ""
echo "🔐 Verificando arquivo .env..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    echo "Procurando .env em public_html/..."
    if [ -f "../.env" ]; then
        cp ../.env .env
        echo -e "${GREEN}✅ .env copiado de public_html/.env${NC}"
    elif [ -f "../../.env" ]; then
        cp ../../.env .env
        echo -e "${GREEN}✅ .env copiado de public_html/.env${NC}"
    else
        echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
        echo "Por favor, crie o arquivo .env manualmente em:"
        echo "  $(pwd)/.env"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
fi

# Verificar variáveis essenciais no .env
echo ""
echo "🔍 Verificando variáveis do .env..."
REQUIRED_VARS=("DB_HOST" "DB_USER" "DB_PASSWORD" "DB_NAME" "JWT_SECRET" "PORT")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env 2>/dev/null; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Variáveis faltando no .env:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo "Por favor, adicione essas variáveis ao arquivo .env"
else
    echo -e "${GREEN}✅ Todas as variáveis essenciais encontradas${NC}"
fi

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules já existe. Reinstalando...${NC}"
    rm -rf node_modules
fi

npm install --production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências instaladas com sucesso${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# Verificar se dist/ existe ou se server.js está na raiz
echo ""
echo "🔍 Verificando arquivo principal..."
if [ -f "dist/server.js" ]; then
    SERVER_FILE="dist/server.js"
    echo -e "${GREEN}✅ Encontrado: dist/server.js${NC}"
elif [ -f "server.js" ]; then
    SERVER_FILE="server.js"
    echo -e "${GREEN}✅ Encontrado: server.js${NC}"
else
    echo -e "${RED}❌ Arquivo server.js não encontrado!${NC}"
    echo "Por favor, compile o projeto com 'npm run build' ou faça upload dos arquivos."
    exit 1
fi

# Instalar PM2
echo ""
echo "📦 Verificando PM2..."
if command_exists pm2; then
    PM2_VERSION=$(pm2 --version)
    echo -e "${GREEN}✅ PM2 instalado: $PM2_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 não encontrado. Instalando...${NC}"
    npm install -g pm2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 instalado com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar PM2${NC}"
        exit 1
    fi
fi

# Parar processo existente se houver
echo ""
echo "🛑 Verificando processos PM2 existentes..."
if pm2 list | grep -q "anotfire-api"; then
    echo -e "${YELLOW}⚠️  Processo anotfire-api já existe. Parando...${NC}"
    pm2 stop anotfire-api 2>/dev/null || true
    pm2 delete anotfire-api 2>/dev/null || true
fi

# Iniciar servidor
echo ""
echo "🚀 Iniciando servidor com PM2..."
pm2 start "$SERVER_FILE" --name anotfire-api

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servidor iniciado com sucesso${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar servidor${NC}"
    exit 1
fi

# Salvar configuração PM2
echo ""
echo "💾 Salvando configuração PM2..."
pm2 save

# Configurar startup automático
echo ""
echo "⚙️  Configurando startup automático..."
STARTUP_CMD=$(pm2 startup 2>&1 | grep -o "sudo.*" || echo "")
if [ -n "$STARTUP_CMD" ]; then
    echo -e "${YELLOW}⚠️  Execute este comando para configurar startup automático:${NC}"
    echo "$STARTUP_CMD"
else
    echo -e "${GREEN}✅ Startup automático configurado${NC}"
fi

# Verificar status
echo ""
echo "📊 Status do servidor:"
pm2 status

echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "  1. Ver logs: pm2 logs anotfire-api"
echo "  2. Verificar status: pm2 status"
echo "  3. Testar API: curl http://localhost:3000/health"
echo ""
echo "🔍 Se houver erros, verifique os logs:"
echo "  pm2 logs anotfire-api --lines 50"
