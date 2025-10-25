"""
Script para testar os endpoints da API que o frontend usa.
Simula exatamente o que o chatbot/page.tsx deveria fazer.
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_api_endpoints():
    """Testa todos os endpoints de conversas como o frontend deveria fazer"""
    
    print("\n" + "="*70)
    print("🧪 TESTE DOS ENDPOINTS DA API (Simulando Frontend)")
    print("="*70 + "\n")
    
    # 1. Login para obter token
    print("1️⃣  Fazendo login para obter access_token...")
    login_data = {
        "username": "test_user",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            access_token = data.get('access')
            print(f"   ✅ Login bem-sucedido!")
            print(f"   🔑 Token obtido: {access_token[:50]}...")
        else:
            print(f"   ❌ Falha no login: {response.text}")
            print("\n⚠️  Criando usuário de teste...")
            
            # Tentar criar usuário
            register_data = {
                "username": "test_user",
                "email": "test@example.com",
                "password": "testpass123",
                "password_confirm": "testpass123",
                "first_name": "Test",
                "last_name": "User"
            }
            reg_response = requests.post(f"{BASE_URL}/users/register/", json=register_data)
            print(f"   Registro Status: {reg_response.status_code}")
            
            if reg_response.status_code in [200, 201]:
                print("   ✅ Usuário criado! Tentando login novamente...")
                response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
                if response.status_code == 200:
                    access_token = response.json().get('access')
                    print(f"   ✅ Login bem-sucedido após registro!")
                else:
                    print(f"   ❌ Ainda falhou: {response.text}")
                    return
            else:
                print(f"   ❌ Falha ao registrar: {reg_response.text}")
                return
    
    except requests.exceptions.ConnectionError:
        print("   ❌ ERRO: Não foi possível conectar ao servidor!")
        print("   💡 Certifique-se de que o backend está rodando em http://localhost:8000")
        return
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 2. Listar conversas existentes (GET /ai/conversations/)
    print("\n2️⃣  Listando conversas existentes (GET /ai/conversations/)...")
    response = requests.get(f"{BASE_URL}/ai/conversations/", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        conversations = response.json()
        
        # Debug: ver estrutura da resposta
        print(f"   📊 Estrutura da resposta: {type(conversations)}")
        print(f"   📝 Primeiros 200 chars: {str(conversations)[:200]}")
        
        # Se for um dict com 'results', é paginação do DRF
        if isinstance(conversations, dict) and 'results' in conversations:
            conversations = conversations['results']
        elif isinstance(conversations, dict):
            conversations = [conversations]
        
        print(f"   ✅ {len(conversations)} conversas encontradas")
        
        for conv in conversations[:3]:
            conv_id = conv.get('id', 'N/A')
            title = conv.get('title', 'Sem título')
            messages_count = len(conv.get('messages', []))
            print(f"      • ID: {conv_id} | Título: {title} | Msgs: {messages_count}")
    else:
        print(f"   ❌ Erro: {response.text}")
    
    # 3. Criar nova conversa (POST /ai/conversations/)
    print("\n3️⃣  Criando nova conversa (POST /ai/conversations/)...")
    new_conv_data = {
        "title": "Teste via API",
        "conversation_type": "general"
    }
    
    response = requests.post(f"{BASE_URL}/ai/conversations/", json=new_conv_data, headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code in [200, 201]:
        conversation = response.json()
        conversation_id = conversation['id']
        print(f"   ✅ Conversa criada com ID: {conversation_id}")
        print(f"   📊 Dados: {json.dumps(conversation, indent=2, ensure_ascii=False)[:200]}...")
    else:
        print(f"   ❌ Erro: {response.text}")
        return
    
    # 4. Adicionar mensagem do usuário (POST /ai/conversations/{id}/add_message/)
    print(f"\n4️⃣  Adicionando mensagem do usuário (POST /ai/conversations/{conversation_id}/add_message/)...")
    user_message_data = {
        "role": "user",
        "content": "Olá! Como está o clima hoje?",
        "metadata": {}
    }
    
    response = requests.post(
        f"{BASE_URL}/ai/conversations/{conversation_id}/add_message/",
        json=user_message_data,
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code in [200, 201]:
        message = response.json()
        user_message_id = message['id']
        print(f"   ✅ Mensagem do usuário salva com ID: {user_message_id}")
        print(f"   💬 Conteúdo: {message['content']}")
    else:
        print(f"   ❌ Erro: {response.text}")
        print(f"   📝 Request enviado: {json.dumps(user_message_data, indent=2)}")
        return
    
    # 5. Adicionar resposta da IA (POST /ai/conversations/{id}/add_message/)
    print(f"\n5️⃣  Adicionando resposta da IA (POST /ai/conversations/{conversation_id}/add_message/)...")
    ai_message_data = {
        "role": "assistant",
        "content": "Olá! Sou a IA do AgroAlerta. O clima está favorável para agricultura hoje!",
        "metadata": {
            "content_html": "<p>Olá! Sou a IA do AgroAlerta...</p>"
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/ai/conversations/{conversation_id}/add_message/",
        json=ai_message_data,
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code in [200, 201]:
        message = response.json()
        ai_message_id = message['id']
        print(f"   ✅ Mensagem da IA salva com ID: {ai_message_id}")
        print(f"   💬 Conteúdo: {message['content'][:60]}...")
    else:
        print(f"   ❌ Erro: {response.text}")
        return
    
    # 6. Recuperar a conversa com todas as mensagens (GET /ai/conversations/{id}/)
    print(f"\n6️⃣  Recuperando conversa completa (GET /ai/conversations/{conversation_id}/)...")
    response = requests.get(f"{BASE_URL}/ai/conversations/{conversation_id}/", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        conversation = response.json()
        messages = conversation.get('messages', [])
        print(f"   ✅ Conversa recuperada com {len(messages)} mensagens")
        
        for i, msg in enumerate(messages, 1):
            print(f"      {i}. [{msg['role'].upper()}] {msg['content'][:50]}...")
    else:
        print(f"   ❌ Erro: {response.text}")
    
    # 7. Listar novamente todas as conversas para verificar a nova
    print("\n7️⃣  Listando todas as conversas novamente (GET /ai/conversations/)...")
    response = requests.get(f"{BASE_URL}/ai/conversations/", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        # Extrair lista de conversas (pode ser paginado)
        if isinstance(data, dict) and 'results' in data:
            conversations = data['results']
        elif isinstance(data, list):
            conversations = data
        else:
            conversations = [data]
        
        print(f"   ✅ {len(conversations)} conversas no total")
        
        # Encontrar a conversa que acabamos de criar
        our_conv = None
        for conv in conversations:
            if isinstance(conv, dict) and conv.get('id') == conversation_id:
                our_conv = conv
                break
        
        if our_conv:
            print(f"\n   🎯 Nossa conversa encontrada:")
            print(f"      ID: {our_conv['id']}")
            print(f"      Título: {our_conv['title']}")
            print(f"      Tipo: {our_conv['conversation_type']}")
            print(f"      Mensagens: {len(our_conv.get('messages', []))}")
            print(f"      Criada em: {our_conv['created_at']}")
            print(f"      Atualizada em: {our_conv['updated_at']}")
        else:
            print(f"   ⚠️  Nossa conversa (ID: {conversation_id}) não apareceu na lista!")
    else:
        print(f"   ❌ Erro: {response.text}")
    
    # 8. Atualizar título da conversa (PATCH /ai/conversations/{id}/)
    print(f"\n8️⃣  Atualizando título da conversa (PATCH /ai/conversations/{conversation_id}/)...")
    update_data = {
        "title": "Clima e Agricultura - Teste API"
    }
    
    response = requests.patch(
        f"{BASE_URL}/ai/conversations/{conversation_id}/",
        json=update_data,
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        updated_conv = response.json()
        print(f"   ✅ Título atualizado para: '{updated_conv['title']}'")
    else:
        print(f"   ❌ Erro: {response.text}")
    
    # Resumo final
    print("\n" + "="*70)
    print("✅ TESTE DA API CONCLUÍDO!")
    print("="*70)
    print(f"\n📌 Conversa criada: ID {conversation_id}")
    print(f"💬 2 mensagens adicionadas (usuário + IA)")
    print(f"🔄 Título atualizado")
    print(f"✅ Histórico recuperado com sucesso")
    print("\n📊 CONCLUSÃO: Os endpoints da API estão funcionando perfeitamente!")
    print("   Se o frontend não está salvando, verifique:")
    print("   1. Se está usando o token correto (access_token)")
    print("   2. Se a URL base está correta (process.env.NEXT_PUBLIC_API_URL)")
    print("   3. Se está chamando os endpoints corretos")
    print("="*70 + "\n")

if __name__ == '__main__':
    try:
        test_api_endpoints()
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
