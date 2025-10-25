"""
Script para testar se o fix da duplicação de mensagens funcionou
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"
USERNAME = "joelantonio"
PASSWORD = "testpass123"

print("="*70)
print("🧪 TESTE: Verificar fix de duplicação de mensagens")
print("="*70)

# 1. Login
print("\n1️⃣  Fazendo login...")
response = requests.post(f"{BASE_URL}/users/login/", json={
    "username": USERNAME,
    "password": PASSWORD
})

if response.status_code == 200:
    tokens = response.json()
    access_token = tokens.get('access')
    print(f"✅ Login OK")
else:
    print(f"❌ Erro no login: {response.status_code}")
    exit(1)

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# 2. Criar nova conversa
print("\n2️⃣  Criando nova conversa...")
response = requests.post(
    f"{BASE_URL}/ai/conversations/",
    json={"title": "Teste Fix Duplicação", "conversation_type": "general"},
    headers=headers
)

if response.status_code == 201:
    conversation = response.json()
    conversation_id = conversation['id']
    print(f"✅ Conversa criada: ID {conversation_id}")
else:
    print(f"❌ Erro ao criar conversa: {response.status_code}")
    exit(1)

# 3. Testar streaming com mensagem simples
print("\n3️⃣  Testando streaming (simulando frontend)...")
print("   Mensagem: 'Como plantar milho?'")

test_messages = [
    {"role": "user", "content": "Como plantar milho?"}
]

print(f"\n📤 Payload enviado:")
print(f"   messages: {test_messages}")

response = requests.post(
    f"{BASE_URL}/ai/proxy/chat/stream/",
    json={"messages": test_messages},
    headers=headers,
    stream=True
)

if response.status_code == 200:
    print(f"\n✅ Stream iniciado (Status: 200)")
    print(f"\n📥 Resposta da IA:")
    print("-" * 70)
    
    accumulated_text = ""
    for line in response.iter_lines():
        if line:
            line_str = line.decode('utf-8')
            if line_str.startswith('data: '):
                data = line_str[6:]
                try:
                    parsed = json.loads(data)
                    if parsed.get('type') == 'content':
                        text = parsed.get('text', '')
                        accumulated_text += text
                        print(text, end='', flush=True)
                    elif parsed.get('type') == 'done':
                        print("\n" + "-" * 70)
                        print(f"\n✅ Stream completo!")
                        print(f"   Total de caracteres: {len(accumulated_text)}")
                        
                        # Verificar se a resposta está completa
                        if len(accumulated_text) > 100:
                            print(f"   ✅ Resposta parece completa (> 100 chars)")
                        else:
                            print(f"   ⚠️  Resposta muito curta, pode estar incompleta")
                        
                        break
                    elif parsed.get('type') == 'error':
                        print(f"\n❌ Erro: {parsed.get('error')}")
                        break
                except json.JSONDecodeError:
                    pass
else:
    print(f"❌ Erro no streaming: {response.status_code}")
    print(f"   Resposta: {response.text[:200]}")

# 4. Verificar conversa no banco
print("\n4️⃣  Verificando conversa no banco...")
response = requests.get(
    f"{BASE_URL}/ai/conversations/{conversation_id}/",
    headers=headers
)

if response.status_code == 200:
    conv = response.json()
    messages_count = len(conv.get('messages', []))
    print(f"✅ Conversa encontrada")
    print(f"   Total de mensagens no banco: {messages_count}")
    
    if messages_count > 0:
        print(f"\n   📝 Mensagens salvas:")
        for i, msg in enumerate(conv['messages'], 1):
            role_emoji = "👤" if msg['role'] == 'user' else "🤖"
            content_preview = msg['content'][:80] + "..." if len(msg['content']) > 80 else msg['content']
            print(f"      {i}. {role_emoji} [{msg['role']}] {content_preview}")
else:
    print(f"❌ Erro ao buscar conversa: {response.status_code}")

print("\n" + "="*70)
print("✅ TESTE CONCLUÍDO")
print("="*70)
print("\n💡 PRÓXIMO PASSO:")
print("   Teste no frontend:")
print("   1. Faça login em http://localhost:3000/login")
print("   2. Vá para o chatbot")
print("   3. Pergunte: 'Como plantar milho?'")
print("   4. Verifique se a resposta está completa")
print("="*70)
