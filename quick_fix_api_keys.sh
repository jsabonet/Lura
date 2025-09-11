#!/bin/bash
# Script rápido para atualizar apenas as chaves de API

echo "🔧 ATUALIZANDO CHAVES DE API"
echo "============================="

# Função para atualizar variável no .env
update_env() {
    local key=$1
    local value=$2
    local file=.env
    
    if grep -q "^${key}=" "$file"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        echo "✅ $key atualizado"
    else
        echo "${key}=${value}" >> "$file"
        echo "➕ $key adicionado"
    fi
}

# Configurar chaves de API
update_env "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" "AIzaSyB7aO-WqSLJGPR1CKlkOQHBU74CrXM4B8I"
update_env "NEXT_PUBLIC_OPENWEATHER_API_KEY" "a9448b9afa666f5666d52cc5e6dc90a9"

echo ""
echo "🔄 Recriando apenas o frontend para aplicar as chaves..."
docker-compose up -d --build frontend

echo ""
echo "⏳ Aguardando frontend reiniciar..."
sleep 15

echo ""
echo "🌐 Testando aplicação..."
curl -s -I http://localhost/ && echo "✅ Frontend OK" || echo "❌ Frontend falhou"

echo ""
echo "✅ Chaves de API configuradas!"
echo "🔄 Recarregue a página no navegador para ver as mudanças."
