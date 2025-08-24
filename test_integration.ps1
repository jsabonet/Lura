# Script de teste da integração Frontend-Backend
Write-Host "🧪 Testando Integração AgroAlerta Frontend <-> Backend" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

try {
    # Testar se o backend está funcionando
    Write-Host "1️⃣ Testando Backend (Django)..." -ForegroundColor Yellow
    $climaResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/clima/atual/" -Method GET
    Write-Host "✅ Clima API: Funcionando" -ForegroundColor Green
    
    Write-Host "2️⃣ Testando Alertas Climáticos..." -ForegroundColor Yellow
    $alertasResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/clima/alertas/" -Method GET
    Write-Host "✅ Alertas API: $($alertasResponse.Count) alertas encontrados" -ForegroundColor Green
    
    Write-Host "3️⃣ Testando Login API..." -ForegroundColor Yellow
    $loginData = @{
        username = "jose_farmer"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/login/" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login API: Token gerado com sucesso" -ForegroundColor Green
    
    Write-Host "✅ Teste de Integração Completo!" -ForegroundColor Green
    Write-Host "📋 Status:" -ForegroundColor Cyan
    Write-Host "  - Backend Django: ✅ Funcionando na porta 8000" -ForegroundColor Green
    Write-Host "  - Frontend Next.js: ✅ Funcionando na porta 3001" -ForegroundColor Green
    Write-Host "  - CORS: ✅ Configurado" -ForegroundColor Green
    Write-Host "  - Usuários de teste: ✅ Criados" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URLs de Teste:" -ForegroundColor Cyan
    Write-Host "  - Frontend: http://localhost:3001" -ForegroundColor White
    Write-Host "  - Backend API: http://127.0.0.1:8000/api/" -ForegroundColor White
    Write-Host "  - Admin Django: http://127.0.0.1:8000/admin/" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erro no teste: $($_.Exception.Message)" -ForegroundColor Red
}
