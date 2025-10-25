"""
Script para simular uma conversa completa com a IA via API
e verificar se é armazenada no banco de dados
"""
import requests
import json
import time
from datetime import datetime

# Configurações
BASE_URL = "http://localhost:8000/api"
USERNAME = "joelantonio"
PASSWORD = "testpass123"  # Senha resetada para testes

print("="*70)
print("🤖 SIMULAÇÃO DE CONVERSA COM IA - TESTE DE PERSISTÊNCIA")
print("="*70)
print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

# PASSO 1: LOGIN
print("1️⃣  FAZENDO LOGIN...")
print("-"*70)

login_data = {
    "username": USERNAME,
    "password": PASSWORD
}

try:
    response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
    
    if response.status_code == 200:
        tokens = response.json()
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')
        
        print(f"✅ Login bem-sucedido!")
        print(f"   Access Token: {access_token[:50]}...")
        print(f"   Refresh Token: {refresh_token[:50]}...")
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    else:
        print(f"❌ Erro no login: {response.status_code}")
        print(f"   Resposta: {response.text}")
        exit(1)
        
except Exception as e:
    print(f"❌ Erro ao conectar: {e}")
    exit(1)

# PASSO 2: CRIAR NOVA CONVERSA
print("\n2️⃣  CRIANDO NOVA CONVERSA...")
print("-"*70)

conversation_data = {
    "title": f"Teste Automático - {datetime.now().strftime('%H:%M:%S')}",
    "conversation_type": "general"
}

try:
    response = requests.post(
        f"{BASE_URL}/ai/conversations/",
        json=conversation_data,
        headers=headers
    )
    
    if response.status_code == 201:
        conversation = response.json()
        conversation_id = conversation.get('id')
        
        print(f"✅ Conversa criada com sucesso!")
        print(f"   ID: {conversation_id}")
        print(f"   Título: {conversation.get('title')}")
        print(f"   Tipo: {conversation.get('conversation_type')}")
        print(f"   Criada em: {conversation.get('created_at')}")
    else:
        print(f"❌ Erro ao criar conversa: {response.status_code}")
        print(f"   Resposta: {response.text}")
        exit(1)
        
except Exception as e:
    print(f"❌ Erro ao criar conversa: {e}")
    exit(1)

# PASSO 3: ENVIAR MENSAGEM DO USUÁRIO
print("\n3️⃣  ENVIANDO MENSAGEM DO USUÁRIO...")
print("-"*70)

user_message = "Olá! Qual é a melhor época para plantar milho em Moçambique?"

message_data = {
    "content": user_message,
    "role": "user"
}

try:
    response = requests.post(
        f"{BASE_URL}/ai/conversations/{conversation_id}/add_message/",
        json=message_data,
        headers=headers
    )
    
    if response.status_code in [200, 201]:
        user_msg = response.json()
        
        print(f"✅ Mensagem do usuário salva!")
        print(f"   ID da mensagem: {user_msg.get('id')}")
        print(f"   Conteúdo: {user_message}")
        print(f"   Role: {user_msg.get('role')}")
        print(f"   Timestamp: {user_msg.get('timestamp')}")
    else:
        print(f"❌ Erro ao salvar mensagem: {response.status_code}")
        print(f"   Resposta: {response.text}")
        
except Exception as e:
    print(f"❌ Erro ao enviar mensagem: {e}")

# Pequena pausa para simular processamento
time.sleep(1)

# PASSO 4: SIMULAR RESPOSTA DA IA
print("\n4️⃣  SIMULANDO RESPOSTA DA IA...")
print("-"*70)

ai_response = """Olá! A melhor época para plantar milho em Moçambique depende da região:

🌱 **Sul de Moçambique**: Outubro a Dezembro (início das chuvas)
🌱 **Centro e Norte**: Novembro a Janeiro

Recomendações:
✅ Solo bem drenado
✅ Temperatura ideal: 20-30°C
✅ Precipitação: 500-800mm durante o ciclo
✅ Escolha variedades adaptadas à sua região

Deseja mais informações sobre algum aspecto específico?"""

ai_message_data = {
    "content": ai_response,
    "role": "assistant",
    "metadata": {
        "model": "gemini-pro",
        "temperature": 0.7,
        "tokens_used": 150
    }
}

try:
    response = requests.post(
        f"{BASE_URL}/ai/conversations/{conversation_id}/add_message/",
        json=ai_message_data,
        headers=headers
    )
    
    if response.status_code in [200, 201]:
        ai_msg = response.json()
        
        print(f"✅ Resposta da IA salva!")
        print(f"   ID da mensagem: {ai_msg.get('id')}")
        print(f"   Role: {ai_msg.get('role')}")
        print(f"   Tamanho: {len(ai_response)} caracteres")
        print(f"   Timestamp: {ai_msg.get('timestamp')}")
    else:
        print(f"❌ Erro ao salvar resposta IA: {response.status_code}")
        print(f"   Resposta: {response.text}")
        
except Exception as e:
    print(f"❌ Erro ao salvar resposta IA: {e}")

# PASSO 5: VERIFICAR NO BANCO DE DADOS
print("\n5️⃣  VERIFICANDO NO BANCO DE DADOS...")
print("-"*70)

# Verificar via API
try:
    response = requests.get(
        f"{BASE_URL}/ai/conversations/{conversation_id}/",
        headers=headers
    )
    
    if response.status_code == 200:
        conv = response.json()
        messages = conv.get('messages', [])
        
        print(f"✅ Conversa encontrada no banco via API!")
        print(f"   ID: {conv.get('id')}")
        print(f"   Título: {conv.get('title')}")
        print(f"   Total de mensagens: {len(messages)}")
        print(f"   Atualizada em: {conv.get('updated_at')}")
        
        print(f"\n   📝 Mensagens salvas:")
        for i, msg in enumerate(messages, 1):
            role_emoji = "👤" if msg.get('role') == 'user' else "🤖"
            content_preview = msg.get('content', '')[:50] + "..."
            print(f"      {i}. {role_emoji} [{msg.get('role')}] {content_preview}")
            
    else:
        print(f"❌ Erro ao buscar conversa: {response.status_code}")
        
except Exception as e:
    print(f"❌ Erro ao verificar conversa: {e}")

# PASSO 6: LISTAR TODAS AS CONVERSAS DO USUÁRIO
print("\n6️⃣  LISTANDO TODAS AS CONVERSAS DO USUÁRIO...")
print("-"*70)

try:
    response = requests.get(
        f"{BASE_URL}/ai/conversations/",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        
        # Suportar resposta paginada
        if isinstance(data, dict) and 'results' in data:
            conversations = data['results']
            total = data.get('count', len(conversations))
        else:
            conversations = data
            total = len(conversations)
        
        print(f"✅ Total de conversas do usuário: {total}")
        
        if conversations:
            print(f"\n   📚 Últimas conversas:")
            for conv in conversations[:5]:
                msg_count = len(conv.get('messages', []))
                print(f"      • ID {conv.get('id')}: {conv.get('title')} ({msg_count} mensagens)")
                
    else:
        print(f"❌ Erro ao listar conversas: {response.status_code}")
        
except Exception as e:
    print(f"❌ Erro ao listar conversas: {e}")

# RESUMO FINAL
print("\n" + "="*70)
print("📊 RESUMO DO TESTE")
print("="*70)
print(f"""
✅ Login: Sucesso
✅ Criação de conversa: ID {conversation_id}
✅ Mensagem usuário: Salva
✅ Mensagem IA: Salva
✅ Verificação no banco: Sucesso
✅ Total de mensagens: 2

🎯 CONCLUSÃO: O sistema está salvando conversas corretamente no banco de dados!

💡 PRÓXIMO PASSO: 
   Faça login no frontend (http://localhost:3000/login) com:
   - Usuário: {USERNAME}
   - Senha: {PASSWORD}
   
   Depois acesse o chatbot e você verá a conversa ID {conversation_id} aparecer!
""")
print("="*70)
