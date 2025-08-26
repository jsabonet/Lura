#!/usr/bin/env python3
"""
Script para testar o endpoint de clima atual
"""
import requests
import json

def test_clima_endpoint():
    url = "http://127.0.0.1:8000/api/clima/atual/?cidade=Maputo"
    
    try:
        print(f"🔍 Testando endpoint: {url}")
        response = requests.get(url, timeout=10)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Resposta JSON:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Verificar se é dados reais ou mockados
            fonte = data.get('fonte', 'desconhecida')
            print(f"\n🎯 Fonte dos dados: {fonte}")
            
            if fonte == 'openweather_api':
                print("✅ Os dados são REAIS da OpenWeather API!")
            else:
                print("⚠️ Os dados são mockados/simulados")
                
        else:
            print(f"❌ Erro na resposta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar ao servidor Django")
        print("🔧 Certifique-se de que o servidor está rodando na porta 8001")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    test_clima_endpoint()
