#!/bin/bash
# Solução definitiva - Rebuild com permissões corretas

echo "🔧 Solução definitiva para dependências..."

# 1. Parar containers
docker-compose down

# 2. Criar Dockerfile temporário com dependências corretas
cat > backend/Dockerfile.temp << 'EOF'
FROM python:3.11-alpine

# Instalar dependências do sistema
RUN apk update && apk add --no-cache \
        postgresql-dev \
        gcc \
        g++ \
        musl-dev \
        libffi-dev \
        jpeg-dev \
        zlib-dev

WORKDIR /app

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --upgrade pip

# Instalar dependências uma por uma para evitar conflitos
RUN pip install --no-cache-dir Django==4.2.7
RUN pip install --no-cache-dir djangorestframework==3.14.0
RUN pip install --no-cache-dir djangorestframework-simplejwt==5.3.0
RUN pip install --no-cache-dir django-cors-headers==4.3.1
RUN pip install --no-cache-dir psycopg2-binary==2.9.9
RUN pip install --no-cache-dir dj-database-url==2.1.0
RUN pip install --no-cache-dir gunicorn==21.2.0
RUN pip install --no-cache-dir whitenoise==6.6.0
RUN pip install --no-cache-dir python-decouple==3.8
RUN pip install --no-cache-dir requests==2.31.0
RUN pip install --no-cache-dir twilio==8.10.0
RUN pip install --no-cache-dir Pillow==10.0.1

# Copiar código
COPY . .

# Criar usuário não-root
RUN adduser -D -s /bin/sh appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["gunicorn", "agroalerta.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
EOF

# 3. Backup do Dockerfile original
cp backend/Dockerfile backend/Dockerfile.backup

# 4. Usar Dockerfile temporário
cp backend/Dockerfile.temp backend/Dockerfile

# 5. Build com Dockerfile corrigido
echo "🔨 Building com Dockerfile corrigido..."
docker-compose build --no-cache backend

# 6. Iniciar containers
docker-compose up -d

# 7. Aguardar containers subirem
echo "⏳ Aguardando containers subirem..."
sleep 30

# 8. Executar migrações
echo "🔄 Executando migrações..."
docker-compose exec backend python manage.py migrate

# 9. Coletar estáticos
echo "📁 Coletando estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

# 10. Verificar status
echo "✅ Verificando status final..."
docker-compose ps

echo ""
echo "🎯 Testando aplicação:"
curl -s http://localhost/health || echo "❌ Health check falhou"

echo ""
echo "📋 Para verificar dependências instaladas:"
echo "docker-compose exec backend pip list | grep -E 'twilio|Pillow'"
