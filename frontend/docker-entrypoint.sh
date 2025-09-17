#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/app

# Prefer the top-level server.js, but fall back to any nested server.js (depth <=3)
if [ -f "$APP_DIR/server.js" ]; then
  SERVER_FILE="$APP_DIR/server.js"
else
  SERVER_FILE=$(find "$APP_DIR" -maxdepth 3 -type f -name server.js | head -n 1 || true)
fi

if [ -z "$SERVER_FILE" ]; then
  echo "ERROR: no server.js found under $APP_DIR. Listing /app contents:" >&2
  ls -la "$APP_DIR" >&2 || true
  echo "Contents of /app/.next (if present):" >&2
  ls -la "$APP_DIR/.next" >&2 || true
  exit 1
fi

echo "Starting Node server: $SERVER_FILE" >&2
exec node "$SERVER_FILE"
