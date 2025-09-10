#!/bin/bash
# ÚLTIMO SCRIPT - Simples e direto

echo "🚨 CORREÇÃO FINAL SIMPLES"
echo "========================="

# 1. Limpar terminal e variáveis
clear
export TERM=linux

# 2. Parar tudo
echo "Parando containers..."
docker-compose down --remove-orphans

# 3. Limpar Docker completamente
echo "Limpando Docker..."
docker system prune -af

# 4. Usar Dockerfile corrigido
echo "Usando Dockerfile corrigido..."
cp backend/Dockerfile.fixed backend/Dockerfile

# 5. Build apenas backend com logs
echo "Building backend..."
docker-compose build --no-cache backend 2>&1 | head -50

# 6. Se build falhou, instalar manualmente
if [ $? -ne 0 ]; then
    echo "Build falhou, tentando instalação manual..."
    
    # Criar container temporário
    docker run -d --name temp-backend python:3.11-alpine tail -f /dev/null
    
    # Instalar dependências uma por uma
    docker exec temp-backend pip install Django==4.2.7
    docker exec temp-backend pip install djangorestframework==3.14.0
    docker exec temp-backend pip install psycopg2-binary==2.9.9
    docker exec temp-backend pip install gunicorn==21.2.0
    docker exec temp-backend pip install python-decouple==3.8
    docker exec temp-backend pip install requests==2.31.0
    docker exec temp-backend pip install twilio==8.10.0
    docker exec temp-backend pip install Pillow==10.0.1
    
    # Commit container
    docker commit temp-backend lurafarm-backend:latest
    docker rm -f temp-backend
fi

# 7. Subir serviços
echo "Iniciando serviços..."
docker-compose up -d db
sleep 10
docker-compose up -d backend
sleep 10
docker-compose up -d frontend nginx

echo "✅ CONCLUÍDO!"
docker-compose ps
