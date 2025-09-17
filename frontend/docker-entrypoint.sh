#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/app
SERVER_FILE="$APP_DIR/server.js"

if [ ! -f "$SERVER_FILE" ]; then
  echo "ERROR: $SERVER_FILE not found. Listing /app contents:" >&2
  ls -la "$APP_DIR" >&2 || true
  echo "Contents of /app/.next (if present):" >&2
  ls -la "$APP_DIR/.next" >&2 || true
  exit 1
fi

# Start the node server as the unprivileged user (already set in image)
exec node "$SERVER_FILE"
