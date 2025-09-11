#!/bin/bash
set -euo pipefail

echo "🧹 Resetando banco (removendo volumes) e executando migrações"
echo "AVISO: Isso APAGA os dados do Postgres e Redis deste projeto. Use apenas em deploys novos."

read -p "Tem certeza? digite 'APAGAR' para continuar: " CONFIRM
if [ "$CONFIRM" != "APAGAR" ]; then
  echo "Cancelado."
  exit 1
fi

echo "⏹️ Parando stack e removendo volumes do projeto..."
docker-compose down -v

echo "🚀 Subindo somente o banco..."
docker-compose up -d db

echo "⏳ Aguardando Postgres ficar saudável..."
for i in {1..30}; do
  if docker-compose exec -T db pg_isready -U ${POSTGRES_USER:-postgres} >/dev/null 2>&1; then
    echo "✅ Postgres pronto"
    break
  fi
  sleep 2
done

echo "🚀 Subindo backend e demais serviços..."
docker-compose up -d backend redis frontend nginx

echo "⏳ Aguardando backend inicializar..."
sleep 15

echo "🔄 Rodando migrações..."
docker-compose exec backend python manage.py migrate --noinput

echo "📁 Coletando estáticos..."
docker-compose exec backend python manage.py collectstatic --noinput

echo "🩺 Healthcheck:"
curl -sS -I http://127.0.0.1/health/ || true

echo "✅ Concluído."
