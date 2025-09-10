#!/bin/bash
# Correção do arquivo .env

echo "🔧 Corrigindo arquivo .env..."

# Backup do .env atual
cp .env .env.backup 2>/dev/null || echo "Nenhum .env para backup"

# Criar .env correto
cat > .env << 'EOF'
# Django Settings
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database
POSTGRES_DB=agroalerta
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1Jossilene
DATABASE_URL=postgresql://postgres:1Jossilene@db:5432/agroalerta

# APIs
OPENWEATHER_API_KEY=your-openweather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF

echo "✅ Arquivo .env corrigido!"
echo "📝 Conteúdo do .env:"
cat .env
