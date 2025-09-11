#!/usr/bin/env bash
set -euo pipefail

# Issue Let's Encrypt certificates for lurafarm.com via Certbot (webroot) and reload Nginx

if [ ! -f .env ]; then
  echo "[erro] .env não encontrado. Copie .env.example para .env e configure CERTBOT_EMAIL." >&2
  exit 1
fi

if ! grep -q '^CERTBOT_EMAIL=' .env; then
  echo "[erro] CERTBOT_EMAIL não definido no .env" >&2
  exit 1
fi

echo "[info] Subindo Nginx (porta 80) para servir ACME challenge..."
docker compose up -d nginx

echo "[info] Solicitando certificado para lurafarm.com e www.lurafarm.com..."
docker compose run --rm certbot

echo "[info] Recarga do Nginx com novos certificados..."
docker compose exec nginx nginx -s reload || true

echo "[ok] Certificados emitidos (se tudo correu bem). Verifique em: /etc/letsencrypt/live/lurafarm.com/"
