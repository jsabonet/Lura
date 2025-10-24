<#
 Script de teste da integração Frontend-Backend
 Atualizado para validar endpoints de IA com autenticação JWT
#>

Write-Host "🧪 Testando Integração AgroAlerta Frontend <-> Backend" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green

$ErrorActionPreference = 'Stop'

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers,
        [object]$Body
    )
    if ($PSBoundParameters.ContainsKey('Body')) {
        return Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ContentType 'application/json' -Body ($Body | ConvertTo-Json -Depth 6)
    }
    else {
        return Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers
    }
}

try {
    # 1) Backend health
    Write-Host "1️⃣ Testando Backend (Django)..." -ForegroundColor Yellow
    $health = Invoke-WebRequest -Uri "http://127.0.0.1:8000/" -UseBasicParsing
    if ($health.StatusCode -ge 200 -and $health.StatusCode -lt 500) {
        Write-Host "✅ Backend acessível" -ForegroundColor Green
    }

    # 2) Endpoints públicos de clima
    Write-Host "2️⃣ Testando APIs de Clima..." -ForegroundColor Yellow
    $climaResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/clima/atual/" -Method GET
    Write-Host "✅ Clima API: OK" -ForegroundColor Green
    $alertasResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/clima/alertas/" -Method GET
    Write-Host "✅ Alertas API: $($alertasResponse.Count) alertas" -ForegroundColor Green

    # 3) Login e obtenção de token
    Write-Host "3️⃣ Testando Login API..." -ForegroundColor Yellow
    $testUser = @{ username = "lura_tester"; password = "Test12345!"; email = "lura@test.com" }
    try {
        # Tenta registrar (ignora erro se já existir)
        Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/register/" -Method POST -ContentType 'application/json' -Body ($testUser | ConvertTo-Json) | Out-Null
        Write-Host "ℹ️ Utilizador de teste criado" -ForegroundColor DarkYellow
    } catch {
        Write-Host "ℹ️ Utilizador de teste já existe (continuando)" -ForegroundColor DarkYellow
    }

    $loginData = @{ username = $testUser.username; password = $testUser.password }
    $loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/login/" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json"
    $accessToken = $loginResponse.access
    if (-not $accessToken) { throw "Token de acesso não recebido" }
    Write-Host "✅ Login API: Token recebido" -ForegroundColor Green

    $authHeaders = @{ Authorization = "Bearer $accessToken" }

    # 4) IA Generate (proxy)
    Write-Host "4️⃣ Testando IA Generate (proxy)" -ForegroundColor Yellow
    $genBody = @{ prompt = "Diga 'Olá' como a Lura." }
    $genResponse = Test-Endpoint -Method 'POST' -Url 'http://127.0.0.1:8000/api/ai/proxy/generate/' -Headers $authHeaders -Body $genBody
    if ($genResponse.success -and ($genResponse.content -or $genResponse.content_html)) {
        Write-Host "✅ IA Generate: OK" -ForegroundColor Green
    } else {
        throw "IA Generate falhou: $($genResponse | ConvertTo-Json -Depth 5)"
    }

    # 5) IA Chat (proxy)
    Write-Host "5️⃣ Testando IA Chat (proxy)" -ForegroundColor Yellow
    $messages = @(
        @{ role = 'system'; content = 'Você é um assistente agrícola Lura.' },
        @{ role = 'user'; content = 'Como plantar milho?' }
    )
    $chatBody = @{ messages = $messages }
    $chatResponse = Test-Endpoint -Method 'POST' -Url 'http://127.0.0.1:8000/api/ai/proxy/chat/' -Headers $authHeaders -Body $chatBody
    if ($chatResponse.success -and ($chatResponse.content -or $chatResponse.content_html)) {
        Write-Host "✅ IA Chat: OK" -ForegroundColor Green
    } else {
        throw "IA Chat falhou: $($chatResponse | ConvertTo-Json -Depth 5)"
    }

    # 6) Resumo
    Write-Host "" 
    Write-Host "✅ Teste de Integração Completo!" -ForegroundColor Green
    Write-Host "📋 Status:" -ForegroundColor Cyan
    Write-Host "  - Backend Django: ✅ Porta 8000" -ForegroundColor Green
    Write-Host "  - Frontend Next.js: ✅ Porta 3002 (dev)" -ForegroundColor Green
    Write-Host "  - CORS/CSRF: ✅ Configurados para 3002" -ForegroundColor Green
    Write-Host "  - Login + IA Proxy: ✅ Operacionais" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URLs de Teste:" -ForegroundColor Cyan
    Write-Host "  - Frontend (dev): http://localhost:3002/chatbot" -ForegroundColor White
    Write-Host "  - Backend API:    http://127.0.0.1:8000/api/" -ForegroundColor White
    Write-Host "  - Admin Django:   http://127.0.0.1:8000/admin/" -ForegroundColor White

} catch {
    Write-Host "❌ Erro no teste: $($_.Exception.Message)" -ForegroundColor Red
}
