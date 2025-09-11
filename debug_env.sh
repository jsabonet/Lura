#!/bin/bash
# Debug das variáveis de ambiente

echo "🔍 DIAGNÓSTICO DAS VARIÁVEIS DE AMBIENTE"
echo "========================================"

echo ""
echo "📋 1. Arquivo .env no host:"
cat .env | grep -E "(DB_|POSTGRES_)"

echo ""
echo "🐳 2. Variáveis no container backend:"
docker-compose exec backend env | grep -E "(DB_|POSTGRES_)" | sort

echo ""
echo "🔧 3. Testando configuração Django:"
docker-compose exec backend python -c "
from decouple import config
print('DB_HOST:', config('DB_HOST', default='NOT_SET'))
print('DB_USER:', config('DB_USER', default='NOT_SET'))  
print('DB_PASSWORD:', config('DB_PASSWORD', default='NOT_SET'))
print('DB_NAME:', config('DB_NAME', default='NOT_SET'))
"

echo ""
echo "📦 4. Testando conexão direta PostgreSQL:"
echo "Testando conexão com usuário postgres..."
docker-compose exec db psql -U postgres -c "SELECT version();" 2>/dev/null && echo "✅ Conexão OK" || echo "❌ Conexão falhou"

echo ""
echo "🔄 5. Forçando reload das variáveis:"
echo "Recriando container backend..."
docker-compose up -d --force-recreate backend

echo ""
echo "⏳ Aguardando container subir..."
sleep 20

echo ""
echo "🔗 6. Testando conexão Django após reload:"
docker-compose exec backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1')
        print('✅ Django conectou ao banco!')
except Exception as e:
    print(f'❌ Erro: {e}')
"

echo ""
echo "🔄 7. Se funcionou, executar migrações:"
docker-compose exec backend python manage.py migrate

echo ""
echo "✅ Diagnóstico concluído!"
