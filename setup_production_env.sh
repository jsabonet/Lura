#!/bin/bash
# Script para configurar variáveis de ambiente em produção

echo "🔧 Configurando ambiente de produção..."
echo "=================================================="

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Fazer backup do .env atual
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Função para atualizar ou adicionar variável no .env
update_env() {
    local key=$1
    local value=$2
    local file=.env
    
    if grep -q "^${key}=" "$file"; then
        # Atualizar variável existente
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        echo "✅ Atualizado: $key"
    else
        # Adicionar nova variável
        echo "${key}=${value}" >> "$file"
        echo "➕ Adicionado: $key"
    fi
}

echo ""
echo "🔐 Configurando variáveis essenciais..."

# Database
update_env "POSTGRES_DB" "lurafarm"
update_env "POSTGRES_USER" "postgres"
update_env "POSTGRES_PASSWORD" "1Jossilene"
update_env "DATABASE_URL" "postgresql://postgres:\${POSTGRES_PASSWORD}@db:5432/\${POSTGRES_DB}"

# Django
update_env "SECRET_KEY" "django-insecure-8c994ucz1_fnvjuwf0&cdalq19!p0d_(5r8@r4hhj(lc5bxom("
update_env "DEBUG" "False"
update_env "ALLOWED_HOSTS" "localhost,127.0.0.1,68.183.211.15"

# CORS/CSRF
update_env "CORS_ALLOWED_ORIGINS" "http://localhost:3000,http://127.0.0.1:3000,http://68.183.211.15"
update_env "CSRF_TRUSTED_ORIGINS" "http://localhost,http://127.0.0.1,http://68.183.211.15"

echo ""
echo "🌤️ Configurando APIs externas..."

# API Keys (Frontend)
update_env "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" "AIzaSyB7aO-WqSLJGPR1CKlkOQHBU74CrXM4B8I"
update_env "NEXT_PUBLIC_OPENWEATHER_API_KEY" "a9448b9afa666f5666d52cc5e6dc90a9"

# API Keys (Backend - opcional)
update_env "OPENWEATHER_API_KEY" "a9448b9afa666f5666d52cc5e6dc90a9"
update_env "GOOGLE_MAPS_API_KEY" "AIzaSyB7aO-WqSLJGPR1CKlkOQHBU74CrXM4B8I"

# Twilio (opcional)
update_env "TWILIO_ACCOUNT_SID" ""
update_env "TWILIO_AUTH_TOKEN" ""
update_env "TWILIO_PHONE_NUMBER" ""

# Redis
update_env "REDIS_URL" "redis://redis:6379/0"
update_env "CELERY_BROKER_URL" "redis://redis:6379/0"

echo ""
echo "📋 Verificando configuração final..."
echo "===================================="

# Mostrar variáveis importantes (sem mostrar senhas)
echo "✅ POSTGRES_DB: $(grep '^POSTGRES_DB=' .env | cut -d'=' -f2)"
echo "✅ POSTGRES_USER: $(grep '^POSTGRES_USER=' .env | cut -d'=' -f2)"
echo "✅ POSTGRES_PASSWORD: [CONFIGURADO]"
echo "✅ DATABASE_URL: [CONFIGURADO]"
echo "✅ SECRET_KEY: [CONFIGURADO]"
echo "✅ DEBUG: $(grep '^DEBUG=' .env | cut -d'=' -f2)"
echo "✅ ALLOWED_HOSTS: $(grep '^ALLOWED_HOSTS=' .env | cut -d'=' -f2)"
echo "✅ CORS_ALLOWED_ORIGINS: $(grep '^CORS_ALLOWED_ORIGINS=' .env | cut -d'=' -f2)"
echo "✅ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: [CONFIGURADO]"
echo "✅ NEXT_PUBLIC_OPENWEATHER_API_KEY: [CONFIGURADO]"

echo ""
echo "🔄 Reiniciando containers para aplicar mudanças..."
echo "=================================================="

# Parar containers
docker-compose down

# Subir containers com novas variáveis
docker-compose up -d --build

echo ""
echo "⏳ Aguardando containers subirem..."
sleep 30

echo ""
echo "🔍 Verificando status dos containers..."
docker-compose ps

echo ""
echo "🌐 Testando aplicação..."
echo "========================"

# Testar health
echo "🩺 Testando health endpoint..."
curl -s -I http://localhost/health || echo "❌ Health endpoint falhou"

# Testar se frontend está servindo
echo "🎯 Testando frontend..."
curl -s -I http://localhost/ || echo "❌ Frontend falhou"

# Verificar se variáveis foram carregadas no backend
echo ""
echo "🔧 Verificando variáveis no backend..."
docker-compose exec -T backend python -c "
import os
from decouple import config
print('✅ DATABASE_URL:', 'CONFIGURADO' if config('DATABASE_URL', default='') else 'NÃO CONFIGURADO')
print('✅ NEXT_PUBLIC_OPENWEATHER_API_KEY:', 'CONFIGURADO' if os.environ.get('NEXT_PUBLIC_OPENWEATHER_API_KEY') else 'NÃO CONFIGURADO')
print('✅ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:', 'CONFIGURADO' if os.environ.get('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY') else 'NÃO CONFIGURADO')
print('✅ CORS_ALLOWED_ORIGINS:', config('CORS_ALLOWED_ORIGINS', default='NÃO CONFIGURADO'))
"

# Testar conexão do Django com banco
echo ""
echo "🔗 Testando conexão Django com banco..."
docker-compose exec -T backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1')
        print('✅ Django conectado ao banco com sucesso!')
except Exception as e:
    print(f'❌ Erro na conexão Django: {e}')
"

echo ""
echo "🎉 Configuração completa!"
echo "========================"
echo "🌐 Aplicação: http://68.183.211.15"
echo "🔧 Admin: http://68.183.211.15/admin/"
echo "📡 API: http://68.183.211.15/api/"
echo "🩺 Health: http://68.183.211.15/health"
echo ""
echo "📝 Backup do .env anterior salvo em: .env.backup.*"
echo "📋 Para verificar logs: docker-compose logs -f [serviço]"
