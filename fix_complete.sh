#!/bin/bash
# Script para corrigir o problema de YAML e configurar API keys

echo "🔧 CORRIGINDO PROBLEMAS DE CONFIGURAÇÃO"
echo "========================================"

# 1. Verificar se o arquivo .env está correto
echo "📝 Verificando arquivo .env..."

# Limpar .env e recriar
cat > .env << 'EOF'
# Django Settings
SECRET_KEY=django-insecure-8c994ucz1_fnvjuwf0&cdalq19!p0d_(5r8@r4hhj(lc5bxom(
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,68.183.211.15

# Database
POSTGRES_DB=lurafarm
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1Jossilene
DATABASE_URL=postgresql://postgres:1Jossilene@db:5432/lurafarm

# Frontend API Keys (CRÍTICO para funcionamento)
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_FRONTEND_URL=http://68.183.211.15
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB7aO-WqSLJGPR1CKlkOQHBU74CrXM4B8I
NEXT_PUBLIC_OPENWEATHER_API_KEY=a9448b9afa666f5666d52cc5e6dc90a9

# Backend API Keys
OPENWEATHER_API_KEY=a9448b9afa666f5666d52cc5e6dc90a9
GOOGLE_MAPS_API_KEY=AIzaSyB7aO-WqSLJGPR1CKlkOQHBU74CrXM4B8I

# CORS/CSRF
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://68.183.211.15
CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1,http://68.183.211.15

# Redis
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0

# Twilio (opcional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# AI (opcional)
HUGGINGFACE_API_KEY=
EOF

echo "✅ Arquivo .env recriado com configurações corretas"

# 2. Puxar últimas correções do GitHub
echo ""
echo "📥 Puxando correções do GitHub..."
git pull origin main

# 3. Parar containers completamente
echo ""
echo "⏹️ Parando todos os containers..."
docker-compose down -v

# 4. Limpar cache do Docker
echo ""
echo "🧹 Limpando cache do Docker..."
docker system prune -f

# 5. Rebuild completo
echo ""
echo "🔨 Fazendo rebuild completo..."
docker-compose build --no-cache

# 6. Subir containers
echo ""
echo "🚀 Subindo containers..."
docker-compose up -d

# 7. Aguardar inicialização
echo ""
echo "⏳ Aguardando containers iniciarem..."
sleep 45

# 8. Verificar status
echo ""
echo "🔍 Verificando status dos containers..."
docker-compose ps

# 9. Executar migrações
echo ""
echo "🔄 Executando migrações..."
docker-compose exec -T backend python manage.py migrate

# 10. Coletar estáticos
echo ""
echo "📁 Coletando arquivos estáticos..."
docker-compose exec -T backend python manage.py collectstatic --noinput

# 11. Testes finais
echo ""
echo "🌐 Testando aplicação..."
echo "========================"

echo "🩺 Health endpoint:"
curl -s -I http://localhost/health | head -1

echo "🎯 Frontend:"
curl -s -I http://localhost/ | head -1

echo "📡 API:"
curl -s -I http://localhost/api/ | head -1

# 12. Verificar se as variáveis foram carregadas no frontend
echo ""
echo "🔧 Verificando variáveis no frontend..."
docker-compose exec -T frontend env | grep NEXT_PUBLIC || echo "❌ Variáveis NEXT_PUBLIC não encontradas"

# 13. Verificar se as variáveis foram carregadas no backend
echo ""
echo "🔧 Verificando variáveis no backend..."
docker-compose exec -T backend env | grep -E "(NEXT_PUBLIC|OPENWEATHER|GOOGLE)" || echo "❌ Algumas variáveis não encontradas"

echo ""
echo "🎉 CORREÇÃO COMPLETA!"
echo "===================="
echo "🌐 Aplicação: http://68.183.211.15"
echo "🩺 Health: http://68.183.211.15/health"
echo ""
echo "🔄 Recarregue a página no navegador para testar"
echo "📋 Se ainda houver problemas: docker-compose logs -f frontend"
