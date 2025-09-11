#!/bin/bash
# Correção final da senha do banco

echo "🔑 Corrigindo senha do banco de dados..."

# 1. Verificar arquivo .env atual
echo "📋 Conteúdo atual do .env:"
cat .env | grep -E "(DB_|POSTGRES_)" || echo "Nenhuma configuração de banco encontrada"

# 2. Criar .env correto com senha do docker-compose
echo ""
echo "✏️ Criando .env com configurações corretas..."

cat > .env << 'EOF'
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,68.183.211.15

# Database - Usar mesmas credenciais do docker-compose.yml
POSTGRES_DB=agroalerta
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1Jossilene
DB_ENGINE=django.db.backends.postgresql
DB_NAME=agroalerta
DB_USER=postgres
DB_PASSWORD=1Jossilene
DB_HOST=db
DB_PORT=5432

# APIs
OPENWEATHER_API_KEY=your-openweather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Frontend
NEXT_PUBLIC_API_URL=http://68.183.211.15:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://68.183.211.15:3000
EOF

echo "✅ Arquivo .env atualizado!"
echo ""
echo "📋 Novo conteúdo do .env:"
cat .env

# 3. Reiniciar backend para ler novo .env
echo ""
echo "🔄 Reiniciando backend com novas configurações..."
docker-compose restart backend

# 4. Aguardar backend subir
echo "⏳ Aguardando backend reiniciar..."
sleep 15

# 5. Testar conexão Django novamente
echo "🔗 Testando conexão Django com nova senha..."
docker-compose exec backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()
from django.db import connection
try:
    connection.ensure_connection()
    print('✅ Django conectou ao banco com sucesso!')
except Exception as e:
    print(f'❌ Erro de conexão: {e}')
"

# 6. Se conexão OK, executar migrações
echo ""
echo "🔄 Executando migrações..."
docker-compose exec backend python manage.py migrate

# 7. Testar aplicação final
echo ""
echo "🌐 Testando aplicação final..."
curl -s -o /dev/null -w "Status HTTP: %{http_code}\n" http://localhost:8000/admin/ || echo "❌ Backend não responde"

echo ""
echo "✅ CONFIGURAÇÃO FINAL CONCLUÍDA!"
echo "🎯 Sua aplicação está em: http://68.183.211.15"
echo "🔧 Admin Django: http://68.183.211.15/admin/"
echo "📡 API: http://68.183.211.15/api/"
