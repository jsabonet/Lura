#!/bin/bash
# Correção de emergência - Conflito de dependências

echo "🚨 Correção de emergência para conflito Pillow..."

# 1. Parar containers
docker-compose down

# 2. Limpar cache Docker
echo "🧹 Limpando cache Docker..."
docker system prune -f

# 3. Verificar requirements.txt
echo "📦 Verificando requirements.txt..."
sort backend/requirements.txt | uniq > backend/requirements_clean.txt
mv backend/requirements_clean.txt backend/requirements.txt

# 4. Instalar dependências diretamente no container rodando
echo "⚡ Instalação direta no container..."
docker-compose up -d db
sleep 10

# 5. Iniciar backend sem build
docker-compose up -d --no-deps backend

# 6. Instalar dependências diretamente
echo "📦 Instalando dependências diretamente..."
docker-compose exec backend pip install --upgrade pip
docker-compose exec backend pip install twilio==8.10.0
docker-compose exec backend pip install Pillow==10.0.1

# 7. Tentar migração
echo "🔄 Executando migrações..."
docker-compose exec backend python manage.py migrate

# 8. Coletar estáticos
echo "📁 Coletando estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

# 9. Iniciar frontend e nginx
docker-compose up -d frontend nginx

echo "✅ Correção de emergência concluída!"
docker-compose ps
