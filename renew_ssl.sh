#!/usr/bin/env bash
set -euo pipefail

echo "[info] Renovando certificados Let's Encrypt (se necessário)..."
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d lurafarm.com -d www.lurafarm.com --keep-until-expiring --agree-tos -m "${CERTBOT_EMAIL:-admin@lurafarm.com}" --non-interactive || true

echo "[info] Recarga do Nginx..."
docker compose exec nginx nginx -s reload || true

echo "[ok] Renovação concluída."
