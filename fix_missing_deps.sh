#!/bin/bash
# Script para adicionar dependências faltantes

echo "🔍 Verificando dependências faltantes..."

# Dependências encontradas no código
MISSING_DEPS=(
    "twilio==8.10.0"
    "Pillow==10.0.1"
)

# Verificar se já estão no requirements.txt
for dep in "${MISSING_DEPS[@]}"; do
    package=$(echo $dep | cut -d'=' -f1)
    if grep -q "$package" backend/requirements.txt; then
        echo "✅ $package já está no requirements.txt"
    else
        echo "❌ $package faltando, adicionando..."
        echo "$dep" >> backend/requirements.txt
    fi
done

echo "📦 Requirements.txt atualizado:"
cat backend/requirements.txt

echo ""
echo "🔧 Para aplicar no servidor:"
echo "1. git pull origin main"
echo "2. docker-compose build --no-cache backend"
echo "3. docker-compose up -d backend"
echo "4. docker-compose exec backend python manage.py migrate"
