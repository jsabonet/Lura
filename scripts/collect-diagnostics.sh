#!/usr/bin/env bash
# Collects container and system logs to help diagnose runtime issues
# Run this on the server in the repo root, then share the generated diagnostics.tar.gz

OUTDIR=diagnostics-$(date +%Y%m%d_%H%M%S)
mkdir -p "$OUTDIR"

echo "Collecting docker compose ps..."
docker compose ps > "$OUTDIR/docker_compose_ps.txt" 2>&1

echo "Collecting docker compose logs (last 500 lines each)..."
docker compose logs --tail 500 > "$OUTDIR/docker_compose_logs.txt" 2>&1

for svc in frontend backend nginx db redis certbot portainer; do
  echo "Collecting logs for $svc..."
  docker logs --tail 500 "lurafarm-$svc-1" > "$OUTDIR/log_$svc.txt" 2>&1 || true
done

echo "Collecting systemctl status for nginx..."
sudo systemctl status nginx > "$OUTDIR/nginx_status.txt" 2>&1 || true

echo "Collecting journalctl for nginx..."
sudo journalctl -xeu nginx.service --no-pager --no-hostname | tail -n 1000 > "$OUTDIR/journal_nginx.txt" 2>&1 || true

if command -v docker >/dev/null 2>&1; then
  echo "Collecting docker system info..."
  docker info > "$OUTDIR/docker_info.txt" 2>&1 || true
fi

# small backend health check
echo "Checking backend health endpoint..."
curl -sS -m 5 http://localhost:8000/health -o "$OUTDIR/backend_health.txt" || true

# pack
tar -czf "$OUTDIR.tar.gz" "$OUTDIR"

echo "Diagnostics collected to $OUTDIR.tar.gz"
ls -lh "$OUTDIR.tar.gz"
