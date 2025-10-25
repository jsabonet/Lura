#!/usr/bin/env python
"""
Script de diagnóstico para testar persistência de conversas
"""

import requests
import json
import sys

# Configurações
BASE_URL = "http://localhost:8000/api"
TOKEN = None

def get_token():
    """Obter token de autenticação"""
    global TOKEN
    
    print("=" * 60)
    print("🔑 AUTENTICAÇÃO")
    print("=" * 60)
    
    username = input("Username: ").strip()
    password = input("Password: ").strip()
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "username": username,
            "password": password
        })
        
        if response.status_code == 200:
            data = response.json()
            TOKEN = data.get('access') or data.get('token')
            print(f"✅ Login bem-sucedido!")
            print(f"📝 Token: {TOKEN[:20]}...")
            return True
        else:
            print(f"❌ Erro no login: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_list_conversations():
    """Testar listagem de conversas"""
    print("\n" + "=" * 60)
    print("📋 TESTE 1: Listar Conversas")
    print("=" * 60)
    
    headers = {'Authorization': f'Bearer {TOKEN}'}
    
    try:
        response = requests.get(f"{BASE_URL}/ai/conversations/", headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            conversations = response.json()
            print(f"✅ Total de conversas: {len(conversations)}")
            
            if conversations:
                print("\n📚 Conversas encontradas:")
                for i, conv in enumerate(conversations[:5], 1):
                    print(f"  {i}. ID: {conv['id']}, Título: {conv['title']}, Mensagens: {len(conv.get('messages', []))}")
            else:
                print("⚠️  Nenhuma conversa encontrada")
            
            return True
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_create_conversation():
    """Testar criação de conversa"""
    print("\n" + "=" * 60)
    print("➕ TESTE 2: Criar Nova Conversa")
    print("=" * 60)
    
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "title": "Conversa de Teste",
        "conversation_type": "general"
    }
    
    print(f"📦 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/ai/conversations/",
            headers=headers,
            json=payload
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 201:
            conv = response.json()
            print(f"✅ Conversa criada com sucesso!")
            print(f"📝 ID: {conv['id']}")
            print(f"📝 Título: {conv['title']}")
            print(f"📝 Tipo: {conv.get('conversation_type')}")
            return conv['id']
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def test_add_message(conversation_id):
    """Testar adição de mensagem"""
    print("\n" + "=" * 60)
    print("💬 TESTE 3: Adicionar Mensagem")
    print("=" * 60)
    
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "role": "user",
        "content": "Olá! Esta é uma mensagem de teste.",
        "metadata": {}
    }
    
    print(f"📦 Payload: {json.dumps(payload, indent=2)}")
    print(f"🎯 Conversation ID: {conversation_id}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/ai/conversations/{conversation_id}/add_message/",
            headers=headers,
            json=payload
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 201:
            msg = response.json()
            print(f"✅ Mensagem adicionada com sucesso!")
            print(f"📝 ID: {msg['id']}")
            print(f"📝 Role: {msg['role']}")
            print(f"📝 Content: {msg['content'][:50]}...")
            return True
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_get_conversation(conversation_id):
    """Testar obtenção de conversa específica"""
    print("\n" + "=" * 60)
    print("🔍 TESTE 4: Obter Conversa Específica")
    print("=" * 60)
    
    headers = {'Authorization': f'Bearer {TOKEN}'}
    
    try:
        response = requests.get(
            f"{BASE_URL}/ai/conversations/{conversation_id}/",
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            conv = response.json()
            print(f"✅ Conversa obtida com sucesso!")
            print(f"📝 ID: {conv['id']}")
            print(f"📝 Título: {conv['title']}")
            print(f"📝 Mensagens: {len(conv.get('messages', []))}")
            
            if conv.get('messages'):
                print("\n💬 Mensagens:")
                for i, msg in enumerate(conv['messages'], 1):
                    print(f"  {i}. [{msg['role']}] {msg['content'][:50]}...")
            
            return True
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    """Executar todos os testes"""
    print("\n" + "=" * 60)
    print("🧪 DIAGNÓSTICO DE PERSISTÊNCIA DE CONVERSAS")
    print("=" * 60)
    
    # 1. Autenticação
    if not get_token():
        print("\n❌ Falha na autenticação. Abortando testes.")
        return
    
    # 2. Listar conversas existentes
    test_list_conversations()
    
    # 3. Criar nova conversa
    conv_id = test_create_conversation()
    
    if not conv_id:
        print("\n❌ Falha ao criar conversa. Abortando testes restantes.")
        return
    
    # 4. Adicionar mensagem
    if test_add_message(conv_id):
        # 5. Verificar se mensagem foi salva
        test_get_conversation(conv_id)
    
    print("\n" + "=" * 60)
    print("✅ DIAGNÓSTICO COMPLETO")
    print("=" * 60)
    print("\n📊 Resultados:")
    print("   - Se todos os testes passaram: Backend está funcionando")
    print("   - Se algum teste falhou: Verificar logs acima para detalhes")

if __name__ == '__main__':
    main()
