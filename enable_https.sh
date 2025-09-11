#!/usr/bin/env bash
set -euo pipefail

if [ ! -d "./ssl" ]; then mkdir -p ./ssl; fi

echo "[info] Alternando para configuração HTTPS..."
docker compose stop nginx
docker compose rm -f nginx

# Swap config file mount to nginx.https.conf by copying over nginx.conf
cp nginx.https.conf nginx.conf

docker compose up -d nginx

echo "[ok] Nginx com HTTPS ativo. Teste: curl -I https://lurafarm.com/health"
