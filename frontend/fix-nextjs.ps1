Write-Host "Resolvendo problemas do Next.js..." -ForegroundColor Yellow

# Limpar cache completamente
Write-Host "Limpando cache..." -ForegroundColor Blue
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }
if (Test-Path ".turbo") { Remove-Item -Recurse -Force ".turbo" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

Write-Host "Reinstalando dependencias..." -ForegroundColor Blue
npm install

Write-Host "Configuracao concluida!" -ForegroundColor Green
Write-Host "Para iniciar o servidor, use: npm run dev" -ForegroundColor Cyan
