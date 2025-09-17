#!/usr/bin/env python
"""
Teste da API Firebase AI
Script para testar todos os endpoints da API AI
"""

import requests
import json
import time
import os

# Configuração da API
BASE_URL = "http://127.0.0.1:8000"  # Ajustar conforme necessário
API_URL = f"{BASE_URL}/api"

# Credenciais de teste (substitua por usuário real)
TEST_USER = {
    "username": "testuser",  
    "password": "testpass123"  
}

def create_test_user():
    """Criar usuário de teste se não existir"""
    try:
        response = requests.post(f"{API_URL}/users/register/", json={
            "username": TEST_USER["username"],
            "password": TEST_USER["password"],
            "email": "test@lura.com"
        })
        if response.status_code in [200, 201]:
            print("✅ Usuário de teste criado com sucesso")
        elif response.status_code == 400:
            print("ℹ️  Usuário de teste já existe")
        else:
            print(f"⚠️  Erro ao criar usuário: {response.status_code}")
    except Exception as e:
        print(f"⚠️  Não foi possível criar usuário: {e}")

def get_auth_token():
    """Obter token de autenticação"""
    print("🔐 Obtendo token de autenticação...")
    
    # Tentar criar usuário primeiro
    create_test_user()
    
    response = requests.post(f"{API_URL}/users/login/", json=TEST_USER)
    
    if response.status_code == 200:
        token = response.json()['access']
        print(f"✅ Token obtido com sucesso")
        return token
    else:
        print(f"❌ Erro ao obter token: {response.status_code}")
        print(response.text)
        return None

def test_ai_status(token):
    """Testar status do serviço AI"""
    print("\n📊 Testando status do serviço AI...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_URL}/ai/status/", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Firebase configurado: {data['firebase_ai']['firebase_configured']}")
        print(f"📍 Project ID: {data['firebase_ai']['project_id']}")
        print(f"🌍 Location: {data['firebase_ai']['location']}")
        print(f"🤖 Modelos disponíveis: {data['firebase_ai']['available_models']}")
        return data['firebase_ai']['firebase_configured']
    else:
        print(f"❌ Erro no status: {response.text}")
        return False

def test_text_generation(token):
    """Testar geração de texto"""
    print("\n📝 Testando geração de texto...")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    test_prompt = "Explique em poucas palavras o que é agricultura sustentável."
    
    payload = {
        "prompt": test_prompt,
        "model": "gemini-pro",
        "temperature": 0.7
    }
    
    print(f"Prompt: {test_prompt}")
    
    start_time = time.time()
    response = requests.post(f"{API_URL}/ai/generate/", headers=headers, json=payload)
    end_time = time.time()
    
    print(f"Status Code: {response.status_code}")
    print(f"Tempo de resposta: {end_time - start_time:.2f}s")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Resposta gerada com sucesso!")
        print(f"📄 Conteúdo: {data['content']}")
        print(f"🤖 Modelo: {data['model']}")
        print(f"⚡ Tempo processamento: {data.get('processing_time', 0):.2f}s")
        if 'usage' in data:
            print(f"📊 Uso: {data['usage']}")
    else:
        print(f"❌ Erro na geração: {response.text}")

def test_agriculture_assistant(token):
    """Testar assistente agrícola"""
    print("\n🌱 Testando assistente agrícola...")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    payload = {
        "query": "Qual é a melhor época para plantar milho em Moçambique?",
        "context": {
            "location": "Maputo, Moçambique",
            "season": "Verão",
            "crop": "Milho"
        }
    }
    
    print(f"Query: {payload['query']}")
    print(f"Contexto: {payload['context']}")
    
    response = requests.post(f"{API_URL}/ai/agriculture/", headers=headers, json=payload)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Conselho agrícola gerado!")
        print(f"💡 Resposta: {data['advice']}")
        print(f"⚡ Tempo: {data.get('processing_time', 0):.2f}s")
    else:
        print(f"❌ Erro no assistente: {response.text}")

def test_pest_analysis(token):
    """Testar análise de pragas"""
    print("\n🐛 Testando análise de pragas...")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    payload = {
        "description": "Folhas amareladas com manchas marrons, presença de pequenos insetos verdes",
        "crop_type": "Tomate",
        "symptoms": ["folhas amareladas", "manchas marrons", "insetos verdes"]
    }
    
    print(f"Descrição: {payload['description']}")
    print(f"Cultura: {payload['crop_type']}")
    print(f"Sintomas: {payload['symptoms']}")
    
    response = requests.post(f"{API_URL}/ai/pest-analysis/", headers=headers, json=payload)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Análise de praga concluída!")
        print(f"🔍 Análise: {data['analysis']}")
        print(f"⚡ Tempo: {data.get('processing_time', 0):.2f}s")
    else:
        print(f"❌ Erro na análise: {response.text}")

def test_chat_conversation(token):
    """Testar chat com contexto"""
    print("\n💬 Testando chat com contexto...")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Primeira mensagem - criar conversa
    payload1 = {
        "message": "Olá! Sou um agricultor iniciante em Moçambique.",
        "type": "agriculture"
    }
    
    print(f"Primeira mensagem: {payload1['message']}")
    
    response1 = requests.post(f"{API_URL}/ai/chat/", headers=headers, json=payload1)
    
    if response1.status_code == 200:
        data1 = response1.json()
        conversation_id = data1['conversation_id']
        print(f"✅ Conversa criada (ID: {conversation_id})")
        print(f"🤖 Resposta: {data1['content']}")
        
        # Segunda mensagem - continuar conversa
        payload2 = {
            "message": "Que culturas você recomenda para iniciantes?",
            "conversation_id": conversation_id,
            "type": "agriculture"
        }
        
        print(f"\nSegunda mensagem: {payload2['message']}")
        
        response2 = requests.post(f"{API_URL}/ai/chat/", headers=headers, json=payload2)
        
        if response2.status_code == 200:
            data2 = response2.json()
            print(f"✅ Conversa continuada")
            print(f"🤖 Resposta: {data2['content']}")
            return conversation_id
        else:
            print(f"❌ Erro na segunda mensagem: {response2.text}")
    else:
        print(f"❌ Erro na primeira mensagem: {response1.text}")
    
    return None

def test_conversation_list(token):
    """Testar listagem de conversas"""
    print("\n📋 Testando listagem de conversas...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_URL}/ai/conversations/", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ {len(data['results'])} conversas encontradas")
        for conv in data['results'][:3]:  # Mostrar apenas 3 primeiras
            print(f"  📝 ID: {conv['id']} | Título: {conv['title']} | Tipo: {conv['conversation_type']}")
            print(f"     📅 Criado: {conv['created_at']} | Mensagens: {conv['message_count']}")
    else:
        print(f"❌ Erro na listagem: {response.text}")

def test_usage_stats(token):
    """Testar estatísticas de uso"""
    print("\n📈 Testando estatísticas de uso...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_URL}/ai/usage/", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Estatísticas obtidas")
        print(f"📊 Período: {data['period']['start_date']} a {data['period']['end_date']}")
        print(f"🔢 Total de requisições: {data['total']['total_requests']}")
        print(f"🎯 Total de tokens: {data['total']['total_tokens']}")
        print(f"⏱️  Tempo total: {data['total']['total_processing_time']:.2f}s")
        print(f"🌱 Agricultura: {data['total']['agriculture_requests']}")
        print(f"🐛 Análise pragas: {data['total']['pest_analysis_requests']}")
        print(f"💬 Geral: {data['total']['general_requests']}")
    else:
        print(f"❌ Erro nas estatísticas: {response.text}")

def main():
    """Função principal de teste"""
    print("🚀 Iniciando testes da API Firebase AI")
    print("=" * 50)
    
    # 1. Obter token
    token = get_auth_token()
    if not token:
        print("❌ Não foi possível obter token. Verifique as credenciais.")
        return
    
    # 2. Testar status
    firebase_configured = test_ai_status(token)
    
    if not firebase_configured:
        print("\n⚠️  Firebase não está configurado. Alguns testes podem falhar.")
        print("   Configure o Firebase conforme FIREBASE_AI_SETUP_GUIDE.md")
        
        # Perguntar se deseja continuar
        continue_test = input("\nDeseja continuar os testes mesmo assim? (s/N): ")
        if continue_test.lower() != 's':
            return
    
    # 3. Testes de funcionalidade
    test_text_generation(token)
    test_agriculture_assistant(token)
    test_pest_analysis(token)
    conversation_id = test_chat_conversation(token)
    test_conversation_list(token)
    test_usage_stats(token)
    
    print("\n" + "=" * 50)
    print("✅ Testes concluídos!")
    
    if conversation_id:
        print(f"💡 Você pode ver a conversa criada (ID: {conversation_id}) no Django Admin")
    
    print("\n📝 Próximos passos:")
    print("   1. Configure o Firebase conforme o guia")
    print("   2. Teste no frontend com os componentes React")
    print("   3. Configure as variáveis de ambiente de produção")

if __name__ == "__main__":
    main()