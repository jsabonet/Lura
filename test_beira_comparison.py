#!/usr/bin/env python3
"""
Script para comparar dados do AgroAlerta com OpenWeather direto
"""
import os
import sys
import django
import requests

# Configurar Django
sys.path.append('./backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from clima.services.openweather import openweather_service
from django.conf import settings

def test_openweather_direct():
    """Teste direto na API OpenWeather"""
    api_key = settings.OPENWEATHER_API_KEY
    
    # Obter coordenadas de Beira
    print("🔍 Testando dados de Beira...")
    coords = openweather_service.get_coordinates("Beira")
    print(f"Coordenadas: {coords}")
    
    if coords:
        # Teste direto na API OpenWeather
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': coords['lat'],
            'lon': coords['lon'],
            'appid': api_key,
            'units': 'metric',
            'lang': 'pt'
        }
        
        print(f"\n🌐 Fazendo requisição direta para OpenWeather...")
        print(f"URL: {url}")
        print(f"Parâmetros: {params}")
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            print(f"\n📊 Resposta direta da OpenWeather API:")
            print(f"Temperatura: {data['main']['temp']}°C")
            print(f"Sensação térmica: {data['main']['feels_like']}°C")
            print(f"Umidade: {data['main']['humidity']}%")
            print(f"Pressão: {data['main']['pressure']} hPa")
            print(f"Vento: {data['wind']['speed']} m/s")
            print(f"Descrição: {data['weather'][0]['description']}")
            print(f"Data/Hora: {data['dt']}")
        else:
            print(f"❌ Erro na API: {response.status_code} - {response.text}")
        
        # Teste através do nosso serviço
        print(f"\n🔧 Teste através do nosso serviço...")
        weather_data = openweather_service.get_current_weather(coords['lat'], coords['lon'])
        print(f"Dados do nosso serviço: {weather_data}")
        
        # Teste da view do Django
        print(f"\n🖥️ Teste da view Django...")
        try:
            response = requests.get("http://127.0.0.1:8000/api/clima/atual/?cidade=Beira")
            if response.status_code == 200:
                django_data = response.json()
                print(f"Dados da view Django: {django_data}")
            else:
                print(f"❌ Erro na view Django: {response.status_code}")
        except Exception as e:
            print(f"❌ Erro ao testar view Django: {e}")

if __name__ == "__main__":
    test_openweather_direct()
