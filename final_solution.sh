#!/bin/bash
# Correção final - Montar .env no container

echo "🔧 SOLUÇÃO FINAL - Variáveis de ambiente no container"
echo "===================================================="

# 1. Parar containers
echo "⏹️ Parando containers..."
docker-compose down

# 2. Modificar docker-compose para passar variáveis do .env
echo "✏️ Modificando docker-compose.yml..."

# Backup do docker-compose original
cp docker-compose.yml docker-compose.yml.backup

# Adicionar env_file ao backend
sed -i '/backend:/,/^[[:space:]]*[^[:space:]]/ {
    /environment:/a\
    env_file:\
      - .env
}' docker-compose.yml

echo "📋 Verificando modificação:"
grep -A 10 "backend:" docker-compose.yml | head -15

# 3. Iniciar containers com .env
echo ""
echo "🚀 Iniciando containers com .env..."
docker-compose up -d

# 4. Aguardar containers
echo "⏳ Aguardando containers subirem..."
sleep 30

# 5. Verificar se variáveis foram carregadas
echo ""
echo "🔍 Verificando variáveis no container:"
docker-compose exec -T backend env | grep -E "(DB_|POSTGRES_|DATABASE_URL)" | sort || true

# 6. Testar Django novamente
echo ""
echo "🔗 Testando Django com novas variáveis:"
docker-compose exec -T backend python -c "
from decouple import config
print('✅ DB_HOST:', config('DB_HOST', default='NOT_SET'))
print('✅ DB_USER:', config('DB_USER', default='NOT_SET'))  
print('✅ DB_PASSWORD:', config('DB_PASSWORD', default='NOT_SET'))
print('✅ DATABASE_URL:', config('DATABASE_URL', default='NOT_SET'))
"

# 7. Testar conexão Django
echo ""
echo "🔗 Testando conexão Django:"
docker-compose exec -T backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()
from django.db import connection
try:
    with connection.cursor() as cursor:
        cursor.execute('SELECT 1')
        print('✅ SUCESSO! Django conectou ao banco!')
except Exception as e:
    print(f'❌ Erro: {e}')
"

# 8. Se funcionou, executar migrações
echo ""
echo "🔄 Executando migrações:"
docker-compose exec -T backend python manage.py migrate

# 9. Coletar estáticos
echo ""
echo "📁 Coletando estáticos:"
docker-compose exec -T backend python manage.py collectstatic --noinput

# 10. Testar aplicação final
echo ""
echo "🌐 Testando aplicação:"
curl -I http://68.183.211.15

echo ""
echo "🎉 DEPLOY FINALIZADO!"
echo "🌐 Aplicação: http://68.183.211.15"
echo "🔧 Admin: http://68.183.211.15/admin/"
echo "📡 API: http://68.183.211.15/api/"
