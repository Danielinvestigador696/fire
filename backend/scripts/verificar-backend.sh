#!/bin/bash
# Script de Verificação do Backend
# Execute: bash verificar-backend.sh

echo "🔍 Verificando Backend na Hostinger..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificações
CHECKS_PASSED=0
CHECKS_FAILED=0

# Função de verificação
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# 1. Verificar Node.js
echo "1. Verificando Node.js..."
node --version >/dev/null 2>&1
check "Node.js instalado"

# 2. Verificar npm
echo "2. Verificando npm..."
npm --version >/dev/null 2>&1
check "npm instalado"

# 3. Verificar se está na pasta correta
echo "3. Verificando pasta atual..."
[ -f "package.json" ] && check "package.json encontrado" || echo -e "${RED}❌ package.json não encontrado (certifique-se de estar em public_html/api/)${NC}"

# 4. Verificar .env
echo "4. Verificando arquivo .env..."
[ -f ".env" ] && check ".env encontrado" || echo -e "${RED}❌ .env não encontrado${NC}"

# 5. Verificar variáveis do .env
if [ -f ".env" ]; then
    echo "5. Verificando variáveis do .env..."
    REQUIRED_VARS=("DB_HOST" "DB_USER" "DB_PASSWORD" "DB_NAME" "JWT_SECRET" "PORT")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env 2>/dev/null; then
            check "Variável $var configurada"
        else
            echo -e "${RED}❌ Variável $var não encontrada no .env${NC}"
        fi
    done
fi

# 6. Verificar node_modules
echo "6. Verificando dependências..."
[ -d "node_modules" ] && check "node_modules encontrado" || echo -e "${RED}❌ node_modules não encontrado (execute: npm install --production)${NC}"

# 7. Verificar arquivo principal
echo "7. Verificando arquivo principal do servidor..."
if [ -f "dist/server.js" ]; then
    check "dist/server.js encontrado"
elif [ -f "server.js" ]; then
    check "server.js encontrado"
else
    echo -e "${RED}❌ Arquivo server.js não encontrado${NC}"
fi

# 8. Verificar PM2
echo "8. Verificando PM2..."
if command -v pm2 >/dev/null 2>&1; then
    check "PM2 instalado"
    
    # Verificar se servidor está rodando
    echo "9. Verificando se servidor está rodando..."
    if pm2 list | grep -q "anotfire-api.*online"; then
        check "Servidor anotfire-api está online"
        
        # Verificar logs recentes
        echo "10. Verificando logs recentes..."
        LOGS=$(pm2 logs anotfire-api --lines 10 --nostream 2>/dev/null)
        if echo "$LOGS" | grep -q "Servidor rodando\|Banco de dados conectado"; then
            check "Logs mostram servidor funcionando"
        else
            echo -e "${YELLOW}⚠️  Verifique os logs manualmente: pm2 logs anotfire-api${NC}"
        fi
    else
        echo -e "${RED}❌ Servidor não está rodando (execute: pm2 start dist/server.js --name anotfire-api)${NC}"
    fi
else
    echo -e "${RED}❌ PM2 não instalado (execute: npm install -g pm2)${NC}"
fi

# Resumo
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumo:"
echo -e "${GREEN}✅ Verificações passadas: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Verificações falhadas: $CHECKS_FAILED${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Tudo parece estar configurado corretamente!${NC}"
    echo ""
    echo "📋 Comandos úteis:"
    echo "  pm2 status          - Ver status"
    echo "  pm2 logs anotfire-api - Ver logs"
    echo "  pm2 restart anotfire-api - Reiniciar"
else
    echo ""
    echo -e "${YELLOW}⚠️  Alguns problemas foram encontrados.${NC}"
    echo "Consulte o guia DIAGNOSTICO_BACKEND_HOSTINGER.md para soluções."
fi
