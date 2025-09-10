#!/bin/bash
# Correção rápida no servidor

echo "🔧 Aplicando correção rápida..."

# 1. Atualizar código
git pull origin main

# 2. Usar docker-compose mínimo
if [ -f "docker-compose-minimal.yml" ]; then
    echo "🎯 Usando versão mínima"
    COMPOSE_CMD="docker-compose -f docker-compose-minimal.yml"
else
    COMPOSE_CMD="docker-compose"
fi

# 3. Parar containers
$COMPOSE_CMD down

# 4. Limpar cache
docker system prune -f

# 5. Build apenas backend
echo "🔨 Building backend..."
$COMPOSE_CMD build --no-cache backend

# 6. Iniciar apenas essenciais
echo "▶️ Iniciando serviços essenciais..."
$COMPOSE_CMD up -d db

# Aguardar banco
sleep 15

# 7. Iniciar backend
$COMPOSE_CMD up -d backend

# Aguardar backend
sleep 10

# 8. Executar comandos Django DEPOIS do container rodar
echo "🔄 Executando migrações..."
$COMPOSE_CMD exec backend python manage.py migrate

echo "📁 Coletando arquivos estáticos..."
$COMPOSE_CMD exec backend python manage.py collectstatic --noinput

# 9. Iniciar frontend e nginx
$COMPOSE_CMD up -d frontend nginx

echo "✅ Correção aplicada!"
$COMPOSE_CMD ps
