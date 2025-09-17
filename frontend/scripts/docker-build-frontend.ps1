# PowerShell helper to build frontend locally and then build the Docker image using the prebuilt .next
# Usage: ./scripts/docker-build-frontend.ps1

Set-StrictMode -Version Latest

Write-Host "1) Installing dependencies (npm ci)..."
npm ci --prefix .\frontend --no-audit --no-fund

Write-Host "2) Building Next.js locally (next build)..."
npm run --prefix .\frontend build

Write-Host "3) Building Docker images using prebuilt .next"
docker compose build --no-cache frontend

Write-Host "Done. You can now run: docker compose up -d --remove-orphans"