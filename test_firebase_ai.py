#!/usr/bin/env python
"""
Script de teste para Firebase AI Integration no Lura Farm
Testa todos os endpoints de AI implementados
"""
import requests
import json
import time
import os
import sys

# Configurações
API_URL = "http://localhost:8000/api"
TEST_USER = {
    "username": "test_user",
    "email": "test@example.com",
    "password": "test123456"
}

def print_banner():
    print("=" * 60)
    print("🚀 TESTE FIREBASE AI INTEGRATION - LURA FARM")
    print("=" * 60)

def create_test_user():
    """Cria usuário de teste"""
    print("\n📝 Criando usuário de teste...")
    
    # Primeiro tenta fazer login para ver se já existe
    try:
        response = requests.post(f"{API_URL}/users/login/", {
            "username": TEST_USER["username"],
            "password": TEST_USER["password"]
        })
        if response.status_code == 200:
            print("✅ Usuário de teste já existe")
            return response.json()
    except:
        pass
    
    # Se não existe, cria
    try:
        response = requests.post(f"{API_URL}/users/register/", TEST_USER)
        if response.status_code in [200, 201]:
            print("✅ Usuário de teste criado com sucesso")
        else:
            print(f"❌ Erro ao criar usuário: {response.status_code}")
            print(f"Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
    
    return None

def authenticate():
    """Faz login e obtém token de autenticação"""
    print("\n🔐 Fazendo autenticação...")
    
    try:
        response = requests.post(f"{API_URL}/users/login/", {
            "username": TEST_USER["username"],
            "password": TEST_USER["password"]
        })
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access') or data.get('token') or data.get('access_token')
            if token:
                print("✅ Autenticação bem-sucedida")
                return token
            else:
                print(f"❌ Token não encontrado na resposta: {data}")
        else:
            print(f"❌ Erro na autenticação: {response.status_code}")
            print(f"Resposta: {response.text}")
            
    except Exception as e:
        print(f"❌ Erro na autenticação: {e}")
    
    return None

def test_ai_status(headers):
    """Testa endpoint de status da AI"""
    print("\n🔍 Testando AI Status...")
    
    try:
        response = requests.get(f"{API_URL}/ai/status/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ AI Status OK")
            print(f"   Firebase: {data.get('firebase', 'N/A')}")
            print(f"   VertexAI: {data.get('vertex_ai', 'N/A')}")
            return True
        else:
            print(f"❌ Erro no status: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste de status: {e}")
    
    return False

def test_ai_generate(headers):
    """Testa geração de texto básica"""
    print("\n📝 Testando geração de texto...")
    
    payload = {
        "prompt": "Explique brevemente o que é agricultura sustentável.",
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    try:
        response = requests.post(f"{API_URL}/ai/generate/", 
                               json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Geração de texto OK")
            print(f"   Resposta: {data.get('response', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Erro na geração: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste de geração: {e}")
    
    return False

def test_agriculture_assistant(headers):
    """Testa assistente de agricultura"""
    print("\n🌱 Testando assistente de agricultura...")
    
    payload = {
        "query": "Como posso melhorar a produtividade do meu milho?",
        "context": {
            "crop_type": "milho",
            "season": "verão",
            "location": "Beira, Moçambique"
        }
    }
    
    try:
        response = requests.post(f"{API_URL}/ai/agriculture/", 
                               json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Assistente de agricultura OK")
            print(f"   Resposta: {data.get('response', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Erro no assistente: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste do assistente: {e}")
    
    return False

def test_pest_analysis(headers):
    """Testa análise de pragas"""
    print("\n🐛 Testando análise de pragas...")
    
    payload = {
        "description": "Folhas amareladas e pequenos furos nas folhas do tomate",
        "crop_type": "tomate",
        "symptoms": ["folhas amareladas", "pequenos furos nas folhas"]
    }
    
    try:
        response = requests.post(f"{API_URL}/ai/pest-analysis/", 
                               json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Análise de pragas OK")
            print(f"   Diagnóstico: {data.get('diagnosis', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Erro na análise: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste de análise: {e}")
    
    return False

def test_chat(headers):
    """Testa sistema de chat"""
    print("\n💬 Testando sistema de chat...")
    
    payload = {
        "message": "Olá! Preciso de ajuda com minha plantação.",
        "conversation_id": None
    }
    
    try:
        response = requests.post(f"{API_URL}/ai/chat/", 
                               json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Sistema de chat OK")
            print(f"   Resposta: {data.get('response', 'N/A')[:100]}...")
            print(f"   Conversa ID: {data.get('conversation_id', 'N/A')}")
            return True, data.get('conversation_id')
        else:
            print(f"❌ Erro no chat: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste de chat: {e}")
    
    return False, None

def test_chat_continuation(headers, conversation_id):
    """Testa continuação de conversa"""
    if not conversation_id:
        print("\n⚠️ Pulando teste de continuação - sem ID de conversa")
        return False
    
    print("\n🔄 Testando continuação de conversa...")
    
    payload = {
        "message": "Quais são os melhores fertilizantes para usar?",
        "conversation_id": conversation_id
    }
    
    try:
        response = requests.post(f"{API_URL}/ai/chat/", 
                               json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Continuação de conversa OK")
            print(f"   Resposta: {data.get('response', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Erro na continuação: {response.status_code}")
            print(f"   Resposta: {response.text}")
    except Exception as e:
        print(f"❌ Erro no teste de continuação: {e}")
    
    return False

def main():
    print_banner()
    
    # Estatísticas dos testes
    tests_passed = 0
    tests_total = 6
    
    # 1. Criar usuário de teste
    create_test_user()
    
    # 2. Autenticar
    token = authenticate()
    if not token:
        print("\n❌ Falha na autenticação. Parando testes.")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Testar endpoints
    if test_ai_status(headers):
        tests_passed += 1
    
    if test_ai_generate(headers):
        tests_passed += 1
    
    if test_agriculture_assistant(headers):
        tests_passed += 1
    
    if test_pest_analysis(headers):
        tests_passed += 1
    
    chat_success, conversation_id = test_chat(headers)
    if chat_success:
        tests_passed += 1
    
    if test_chat_continuation(headers, conversation_id):
        tests_passed += 1
    
    # Resultados finais
    print("\n" + "=" * 60)
    print("📊 RESULTADOS DOS TESTES")
    print("=" * 60)
    print(f"✅ Testes aprovados: {tests_passed}/{tests_total}")
    print(f"📈 Taxa de sucesso: {(tests_passed/tests_total)*100:.1f}%")
    
    if tests_passed == tests_total:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("Firebase AI Integration está funcionando perfeitamente!")
    else:
        print(f"\n⚠️ {tests_total - tests_passed} testes falharam.")
        print("Verifique as configurações do Firebase e credenciais.")
    
    print("\n💡 PRÓXIMOS PASSOS:")
    print("1. Configure suas credenciais do Firebase")
    print("2. Teste com o frontend em desenvolvimento")
    print("3. Implemente funcionalidades personalizadas")

if __name__ == "__main__":
    main()