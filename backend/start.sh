#!/bin/bash
# Script para iniciar o servidor na Hostinger
# Execute: bash start.sh

echo "🚀 Iniciando servidor AnotFire API..."

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --production
fi

# Verificar se dist existe
if [ ! -d "dist" ]; then
    echo "🔨 Compilando TypeScript..."
    npm run build
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "Crie o arquivo .env com as configurações necessárias"
    exit 1
fi

# Iniciar com PM2 (se disponível)
if command -v pm2 &> /dev/null; then
    echo "✅ Usando PM2 para iniciar servidor..."
    pm2 start dist/server.js --name anotfire-api
    pm2 save
    echo "✅ Servidor iniciado com PM2"
    echo "📊 Ver status: pm2 status"
    echo "📋 Ver logs: pm2 logs anotfire-api"
else
    echo "⚠️  PM2 não encontrado. Iniciando diretamente com Node..."
    echo "⚠️  Nota: Servidor irá parar quando você fechar o terminal"
    node dist/server.js
fi
