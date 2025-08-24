#!/usr/bin/env python3
"""
Teste das APIs externas com credenciais reais
"""
import os
import sys
import django
import requests

# Configurar Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

def test_openweather():
    print("🌤️  Testando OpenWeather API...")
    try:
        from clima.services.openweather_service import openweather_service
        
        # Teste 1: Obter coordenadas
        coords = openweather_service.get_coordinates("Maputo")
        print(f"✅ Coordenadas de Maputo: {coords}")
        
        # Teste 2: Clima atual
        if coords:
            weather = openweather_service.get_current_weather(coords['lat'], coords['lon'])
            print(f"✅ Clima atual: {weather['temperature']}°C, {weather['description']}")
        
        # Teste 3: Previsão
        forecast = openweather_service.get_forecast("Maputo")
        print(f"✅ Previsão (5 dias): {len(forecast)} períodos")
        
    except Exception as e:
        print(f"❌ Erro OpenWeather: {e}")

def test_twilio():
    print("\n📱 Testando Twilio API...")
    try:
        from notificacoes.services.twilio_service import twilio_service
        
        # Teste de validação de configuração
        if twilio_service.client:
            print("✅ Cliente Twilio configurado com sucesso")
        else:
            print("❌ Cliente Twilio não configurado")
        
    except Exception as e:
        print(f"❌ Erro Twilio: {e}")

def test_huggingface():
    print("\n🤖 Testando HuggingFace API...")
    try:
        from pragas.services.huggingface_service import huggingface_service
        
        # Teste de detecção de pragas
        result = huggingface_service.detect_pest_from_text(
            "Folhas amareladas com manchas marrons"
        )
        print(f"✅ Detecção de pragas: {result['pest_type']}")
        
        # Teste de recomendações
        recommendations = huggingface_service.get_farming_recommendations(
            "milho", "Maputo", {"temperature": 25, "humidity": 70}
        )
        print(f"✅ Recomendações: {len(recommendations)} sugestões")
        
    except Exception as e:
        print(f"❌ Erro HuggingFace: {e}")

def test_django_apis():
    print("\n🌐 Testando APIs Django...")
    try:
        # Teste clima atual
        response = requests.get('http://127.0.0.1:8000/api/clima/atual/?localizacao=Maputo')
        print(f"✅ API Clima Atual: Status {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Temperatura: {data.get('temperatura')}°C")
        
        # Teste alertas
        response = requests.get('http://127.0.0.1:8000/api/clima/alertas/')
        print(f"✅ API Alertas: Status {response.status_code}")
        
        # Teste pragas
        response = requests.get('http://127.0.0.1:8000/api/pragas/listar/')
        print(f"✅ API Pragas: Status {response.status_code}")
        
    except Exception as e:
        print(f"❌ Erro APIs Django: {e}")

if __name__ == "__main__":
    print("🚀 Testando APIs Externas com Credenciais Reais")
    print("=" * 50)
    
    test_openweather()
    test_twilio()
    test_huggingface()
    test_django_apis()
    
    print("\n✨ Teste concluído!")
