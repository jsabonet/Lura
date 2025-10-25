#!/usr/bin/env python
"""
Script simples para testar endpoint de conversas
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("🧪 TESTE RÁPIDO DE ENDPOINTS")
print("=" * 60)

# Teste 1: Verificar se endpoint existe
print("\n1. Testando GET /ai/conversations/ (sem auth)")
try:
    response = requests.get(f"{BASE_URL}/ai/conversations/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:200]}")
    
    if response.status_code == 401:
        print("   ✅ Endpoint existe (requer autenticação)")
    elif response.status_code == 404:
        print("   ❌ Endpoint não encontrado!")
    else:
        print(f"   ⚠️  Status inesperado: {response.status_code}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Teste 2: Verificar endpoint de POST
print("\n2. Testando POST /ai/conversations/ (sem auth)")
try:
    response = requests.post(
        f"{BASE_URL}/ai/conversations/",
        json={"title": "Test"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:200]}")
    
    if response.status_code == 401:
        print("   ✅ Endpoint existe (requer autenticação)")
    elif response.status_code == 404:
        print("   ❌ Endpoint não encontrado!")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Teste 3: Verificar add_message endpoint
print("\n3. Testando POST /ai/conversations/1/add_message/ (sem auth)")
try:
    response = requests.post(
        f"{BASE_URL}/ai/conversations/1/add_message/",
        json={"role": "user", "content": "test"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:200]}")
    
    if response.status_code == 401:
        print("   ✅ Endpoint existe (requer autenticação)")
    elif response.status_code == 404:
        print("   ❌ Endpoint não encontrado!")
except Exception as e:
    print(f"   ❌ Erro: {e}")

print("\n" + "=" * 60)
print("📝 CONCLUSÃO:")
print("   - Status 401: Endpoint OK, precisa de token")
print("   - Status 404: Endpoint não configurado")
print("=" * 60)
