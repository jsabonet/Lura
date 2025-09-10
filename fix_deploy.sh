#!/bin/bash
# Script de correção rápida para problemas de deploy

echo "🔧 Corrigindo problemas de deploy..."

# 1. Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    
    # Gerar senha segura para PostgreSQL
    POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    sed -i "s/SuaSenhaPostgresMuitoSegura123!/$POSTGRES_PASS/" .env
    
    # Gerar SECRET_KEY para Django
    SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
    sed -i "s/sua-chave-secreta-super-segura-aqui-com-50-caracteres-minimo/$SECRET_KEY/" .env
    
    echo "✅ Arquivo .env criado com senhas seguras!"
    echo "⚠️  IMPORTANTE: Edite o .env com suas configurações específicas (domínio, APIs, etc.)"
fi

# 2. Limpar containers e imagens antigas
echo "🧹 Limpando containers antigos..."
docker-compose down --remove-orphans
docker system prune -f

# 3. Build apenas o frontend primeiro (para debug)
echo "🔨 Testando build do frontend..."
cd frontend
if npm run build; then
    echo "✅ Frontend build funcionando!"
    cd ..
else
    echo "❌ Erro no build do frontend. Instalando dependências..."
    npm install
    cd ..
fi

# 4. Build completo
echo "🐳 Fazendo build completo..."
docker-compose build --no-cache

# 5. Iniciar serviços
echo "▶️ Iniciando serviços..."
docker-compose up -d

# 6. Aguardar containers subirem
echo "⏳ Aguardando containers iniciarem..."
sleep 30

# 7. Verificar status
echo "📊 Status dos containers:"
docker-compose ps

# 8. Executar migrações se backend estiver rodando
if docker-compose ps | grep -q "backend.*Up"; then
    echo "🔄 Executando migrações..."
    docker-compose exec backend python manage.py migrate
    
    echo "📁 Coletando arquivos estáticos..."
    docker-compose exec backend python manage.py collectstatic --noinput
    
    echo "✅ Deploy concluído!"
    echo "🌐 Testando aplicação..."
    
    # Testar se a aplicação responde
    sleep 10
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo "🎉 Aplicação funcionando! Acesse: http://localhost"
    else
        echo "⚠️ Aplicação pode não estar respondendo ainda. Aguarde mais um pouco."
        echo "📝 Para verificar logs: docker-compose logs -f"
    fi
else
    echo "❌ Backend não está rodando. Verificar logs:"
    docker-compose logs backend
fi

echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs: docker-compose logs -f"
echo "  Status: docker-compose ps"
echo "  Reiniciar: docker-compose restart"
echo "  Parar tudo: docker-compose down"
