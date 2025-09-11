#!/bin/bash
# Correção final - configuração do banco

echo "🔧 Corrigindo configuração do banco..."

# 1. Verificar se containers estão rodando
echo "📊 Status dos containers:"
docker-compose ps

# 2. Verificar se banco está acessível
echo "🔍 Testando conexão com banco..."
docker-compose exec db psql -U postgres -c "SELECT 1;" 2>/dev/null && echo "✅ Banco acessível" || echo "❌ Banco inacessível"

# 3. Verificar se backend consegue conectar
echo "🔗 Testando conexão Django..."
docker-compose exec backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()
from django.db import connection
try:
    connection.ensure_connection()
    print('✅ Django conectou ao banco!')
except Exception as e:
    print(f'❌ Erro de conexão: {e}')
"

# 4. Se conexão OK, executar migrações
echo "🔄 Executando migrações..."
docker-compose exec backend python manage.py migrate

# 5. Coletar estáticos
echo "📁 Coletando estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

# 6. Testar aplicação
echo "🌐 Testando aplicação..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost/health || echo "❌ Health check falhou"

echo "✅ Configuração concluída!"
echo "🎯 Acesse: http://$(curl -s ifconfig.me)"
