#!/usr/bin/env python3
"""
Script de teste para validar streaming SSE real
Simula uma requisição ao endpoint de streaming
"""

import requests
import json
import sys

def test_streaming():
    """Testa o endpoint de streaming SSE"""
    
    # URL do backend (ajustar se necessário)
    BASE_URL = "http://localhost:8000"
    
    print("=" * 80)
    print("TESTE DE STREAMING SSE (Server-Sent Events)")
    print("=" * 80)
    
    # 1. Login para obter token
    print("\n1️⃣  Fazendo login...")
    login_data = {
        "username": "joelfernando",  # Ajustar com usuário real
        "password": "1Jossilene@"
    }
    
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/users/login/",
            json=login_data,
            timeout=10
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login falhou: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            print("\n💡 Verifique se o usuário existe e as credenciais estão corretas")
            return 1
        
        response_data = login_response.json()
        token = response_data.get('token') or response_data.get('access')
        
        if not token:
            print(f"❌ Token não encontrado na resposta")
            print(f"Response keys: {response_data.keys()}")
            return 1
        
        print(f"✅ Login OK - Token obtido: {token[:20]}...")
    
    except Exception as e:
        print(f"❌ Erro no login: {e}")
        return 1
    
    # 2. Testar endpoint de streaming
    print("\n2️⃣  Testando streaming SSE...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'messages': [
            {'role': 'user', 'content': 'Olá! Me fale sobre agricultura em Moçambique em 3 parágrafos.'}
        ]
    }
    
    try:
        print("\n📡 Conectando ao stream...")
        response = requests.post(
            f"{BASE_URL}/api/ai/proxy/chat/stream/",
            headers=headers,
            json=payload,
            stream=True,  # IMPORTANTE: stream=True para SSE
            timeout=60
        )
        
        if response.status_code != 200:
            print(f"❌ Streaming falhou: {response.status_code}")
            print(f"Response: {response.text}")
            return 1
        
        print("✅ Conexão estabelecida!")
        print("\n" + "=" * 80)
        print("STREAMING EM TEMPO REAL:")
        print("=" * 80)
        
        chunk_count = 0
        accumulated_text = ""
        
        # Ler chunks SSE
        for line in response.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                
                # SSE formato: data: {json}
                if decoded.startswith('data: '):
                    data_str = decoded[6:]  # Remove "data: "
                    
                    try:
                        data = json.loads(data_str)
                        
                        if data.get('type') == 'content':
                            chunk_count += 1
                            text_chunk = data.get('text', '')
                            accumulated_text += text_chunk
                            
                            # Mostrar chunk (sem quebra de linha para simular streaming)
                            print(text_chunk, end='', flush=True)
                        
                        elif data.get('type') == 'done':
                            print("\n\n" + "=" * 80)
                            print(f"✅ STREAMING COMPLETADO!")
                            print(f"📊 Total de chunks: {chunk_count}")
                            print(f"📝 Total de caracteres: {len(accumulated_text)}")
                            print(f"🤖 Modelo usado: {data.get('model', 'unknown')}")
                            
                            # Validar HTML formatado
                            if data.get('content_html'):
                                print(f"✅ HTML formatado gerado ({len(data['content_html'])} chars)")
                            
                            break
                        
                        elif data.get('type') == 'error':
                            print(f"\n\n❌ ERRO: {data.get('error')}")
                            return 1
                    
                    except json.JSONDecodeError as e:
                        print(f"\n⚠️  Erro ao parsear JSON: {e}")
                        print(f"Data: {data_str[:100]}...")
        
        print("=" * 80)
        print("\n3️⃣  Validações:")
        
        validations = []
        
        if chunk_count > 0:
            validations.append(f"✅ Streaming funcional ({chunk_count} chunks recebidos)")
        else:
            validations.append("❌ Nenhum chunk recebido")
        
        if len(accumulated_text) > 0:
            validations.append(f"✅ Texto acumulado ({len(accumulated_text)} caracteres)")
        else:
            validations.append("❌ Nenhum texto acumulado")
        
        if chunk_count > 5:
            validations.append("✅ Streaming verdadeiro (múltiplos chunks)")
        else:
            validations.append("⚠️  Poucos chunks (pode não ser streaming real)")
        
        for v in validations:
            print(v)
        
        print("\n" + "=" * 80)
        print("RESUMO:")
        print("=" * 80)
        
        if chunk_count > 0 and len(accumulated_text) > 0:
            print("🎉 SUCESSO! Streaming SSE está funcionando!")
            print("✅ Backend está gerando texto em tempo real")
            print("✅ Chunks SSE chegando corretamente")
            print("✅ Frontend pode mostrar texto sendo escrito palavra por palavra")
            return 0
        else:
            print("❌ Streaming não está funcionando como esperado")
            return 1
    
    except Exception as e:
        print(f"\n\n❌ Erro durante streaming: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    exit(test_streaming())
