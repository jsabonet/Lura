#!/bin/bash
# Script para aplicar melhorias de Tailwind e rebuild frontend

echo "🎨 APLICANDO MELHORIAS TAILWIND PARA MOBILE"
echo "============================================"

echo "📋 Verificando arquivos de configuração..."
ls -la frontend/tailwind.config.ts frontend/src/app/globals.css

echo ""
echo "🔄 Rebuilding frontend com novas configurações..."
docker-compose up -d --build frontend

echo ""
echo "⏳ Aguardando frontend reinicializar..."
sleep 20

echo ""
echo "🧹 Limpando cache do browser (instruções):"
echo "1. No mobile: Settings > Site Data > Limpar cache para lurafarm.com"
echo "2. No desktop: F12 > Application > Storage > Clear storage"
echo "3. Ou force refresh: Ctrl+Shift+R (desktop) / Pull down (mobile)"

echo ""
echo "🌐 Testando aplicação..."
curl -s -I http://localhost/ && echo "✅ Frontend respondendo" || echo "❌ Frontend com problema"

echo ""
echo "🔍 Verificando logs do frontend..."
echo "Para ver logs em tempo real: docker-compose logs -f frontend"
echo ""

echo "✅ MELHORIAS APLICADAS!"
echo "📱 Agora teste no mobile e limpe o cache do navegador"
echo "🎯 Os gradientes e modais devem estar consistentes entre desktop/mobile"
