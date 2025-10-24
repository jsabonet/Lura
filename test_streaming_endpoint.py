#!/usr/bin/env python
"""
Teste do endpoint de streaming SSE
Valida que o endpoint /api/ai/proxy/chat/stream/ está funcionando
"""

import requests
import json
import sys

def test_streaming_endpoint():
    """Testa endpoint de streaming com mensagem simples"""
    
    url = "http://localhost:8000/api/ai/proxy/chat/stream/"
    
    # Token de teste (você precisa substituir por um token válido)
    token = input("Cole o token JWT (ou pressione Enter para testar sem auth): ").strip()
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    payload = {
        "messages": [
            {"role": "user", "content": "Olá! Qual é o seu nome?"}
        ]
    }
    
    print("\n🔄 Enviando requisição para:", url)
    print("📦 Payload:", json.dumps(payload, indent=2))
    print("\n⏳ Aguardando streaming...\n")
    
    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            stream=True,
            timeout=30
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Headers: {dict(response.headers)}\n")
        
        if response.status_code != 200:
            print(f"❌ Erro: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return False
        
        # Ler stream SSE
        chunk_count = 0
        total_chars = 0
        
        print("📨 Chunks recebidos:")
        print("-" * 60)
        
        for line in response.iter_lines():
            if line:
                line_text = line.decode('utf-8')
                
                # SSE format: "data: {json}"
                if line_text.startswith('data: '):
                    chunk_count += 1
                    json_str = line_text[6:]  # Remove "data: "
                    
                    try:
                        data = json.loads(json_str)
                        chunk = data.get('chunk', '')
                        total_chars += len(chunk)
                        
                        print(f"Chunk {chunk_count}: {chunk!r} ({len(chunk)} chars)")
                        
                    except json.JSONDecodeError:
                        print(f"⚠️  Chunk {chunk_count}: Não é JSON válido: {json_str!r}")
        
        print("-" * 60)
        print(f"\n✅ Teste concluído!")
        print(f"📊 Total de chunks: {chunk_count}")
        print(f"📏 Total de caracteres: {total_chars}")
        
        return chunk_count > 0
        
    except requests.exceptions.Timeout:
        print("❌ Timeout na requisição (30s)")
        return False
        
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão. Backend rodando?")
        return False
        
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🧪 Teste do Endpoint de Streaming SSE")
    print("=" * 60)
    
    success = test_streaming_endpoint()
    
    sys.exit(0 if success else 1)
