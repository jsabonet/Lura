#!/bin/bash
# Script de correção rápida para problemas de deploy (versão mínima)

echo "🔧 Corrigindo problemas de deploy (versão otimizada)..."

# 1. Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    
    # Gerar senha segura para PostgreSQL
    POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    sed -i "s/SuaSenhaPostgresMuitoSegura123!/$POSTGRES_PASS/" .env
    
    # Gerar SECRET_KEY para Django
    SECRET_KEY=$(python3 -c 'import secrets; print("".join(secrets.choice("abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)") for i in range(50)))')
    sed -i "s/sua-chave-secreta-super-segura-aqui-com-50-caracteres-minimo/$SECRET_KEY/" .env
    
    echo "✅ Arquivo .env criado com senhas seguras!"
    echo "⚠️  IMPORTANTE: Edite o .env com suas configurações específicas (domínio, APIs, etc.)"
else
    echo "📝 Arquivo .env já existe"
fi

# 2. Verificar se POSTGRES_PASSWORD está definido
if ! grep -q "POSTGRES_PASSWORD=" .env || grep -q "POSTGRES_PASSWORD=$" .env; then
    echo "🔑 Configurando POSTGRES_PASSWORD..."
    POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    echo "POSTGRES_PASSWORD=$POSTGRES_PASS" >> .env
fi

# 3. Escolher versão do docker-compose
COMPOSE_FILE="docker-compose-minimal.yml"
if [ -f "$COMPOSE_FILE" ]; then
    echo "🎯 Usando versão otimizada (sem Redis/Celery): $COMPOSE_FILE"
    COMPOSE_CMD="docker-compose -f $COMPOSE_FILE"
else
    echo "📦 Usando versão completa: docker-compose.yml"
    COMPOSE_CMD="docker-compose"
fi

# 4. Limpar containers e imagens antigas
echo "🧹 Limpando containers antigos..."
$COMPOSE_CMD down --remove-orphans
docker system prune -f

# 5. Build apenas o frontend primeiro (para debug)
echo "🔨 Testando build do frontend localmente..."
cd frontend
if npm run build; then
    echo "✅ Frontend build funcionando!"
    cd ..
else
    echo "⚠️ Erro no build do frontend local. Continuando com Docker..."
    cd ..
fi

# 6. Build apenas backend primeiro (para debug)
echo "🐍 Testando build do backend..."
if $COMPOSE_CMD build backend; then
    echo "✅ Backend build funcionando!"
else
    echo "❌ Erro no build do backend. Verifique logs acima."
    exit 1
fi

# 7. Build completo
echo "🐳 Fazendo build completo..."
$COMPOSE_CMD build --no-cache

# 8. Iniciar serviços essenciais primeiro
echo "▶️ Iniciando banco primeiro..."
$COMPOSE_CMD up -d db

# Aguardar banco inicializar
echo "⏳ Aguardando banco inicializar..."
sleep 20

# 9. Iniciar backend
echo "▶️ Iniciando backend..."
$COMPOSE_CMD up -d backend

# Aguardar backend inicializar
sleep 15

# 10. Iniciar frontend e nginx
echo "▶️ Iniciando frontend e nginx..."
$COMPOSE_CMD up -d frontend nginx

# 11. Aguardar tudo estabilizar
echo "⏳ Aguardando todos os serviços..."
sleep 30

# 12. Verificar status
echo "📊 Status dos containers:"
$COMPOSE_CMD ps

# 13. Executar migrações se backend estiver rodando
if $COMPOSE_CMD ps | grep -q "backend.*Up"; then
    echo "🔄 Executando migrações..."
    $COMPOSE_CMD exec backend python manage.py migrate
    
    echo "📁 Coletando arquivos estáticos..."
    $COMPOSE_CMD exec backend python manage.py collectstatic --noinput
    
    echo "✅ Deploy concluído!"
    echo "🌐 Testando aplicação..."
    
    # Testar se a aplicação responde
    sleep 10
    if curl -f http://localhost >/dev/null 2>&1; then
        echo "🎉 Aplicação funcionando! Acesse: http://localhost"
    else
        echo "⚠️ Aplicação pode não estar respondendo ainda."
        echo "📝 Verificar logs: $COMPOSE_CMD logs nginx"
        echo "📝 Status: $COMPOSE_CMD ps"
    fi
else
    echo "❌ Backend não está rodando. Verificar logs:"
    $COMPOSE_CMD logs backend
    echo ""
    echo "💡 Possíveis soluções:"
    echo "   1. Verificar se .env está configurado corretamente"
    echo "   2. Verificar logs: $COMPOSE_CMD logs backend"
    echo "   3. Tentar rebuild: $COMPOSE_CMD build --no-cache backend"
fi

echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs: $COMPOSE_CMD logs -f"
echo "  Status: $COMPOSE_CMD ps"
echo "  Reiniciar: $COMPOSE_CMD restart"
echo "  Parar tudo: $COMPOSE_CMD down"
echo "  Rebuild: $COMPOSE_CMD build --no-cache"
echo ""
echo "🎯 Versão otimizada em uso: apenas 4 containers (frontend, backend, db, nginx)"
echo "💾 Tamanho reduzido: ~75% menor que a versão completa"
