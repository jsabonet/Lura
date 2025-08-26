#!/usr/bin/env python3
"""
Script para garantir que os dados sejam EXATAMENTE iguais ao site OpenWeather
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

def check_exact_coordinates():
    """Verificar se estamos usando as coordenadas exatas do site OpenWeather"""
    
    # Coordenadas mostradas no site OpenWeather para Beira
    site_coords = {
        'lat': -19.8436,
        'lon': 34.8389
    }
    
    # Coordenadas obtidas pelo nosso serviço
    our_coords = openweather_service.get_coordinates("Beira")
    
    print("🔍 Comparação de coordenadas:")
    print(f"Site OpenWeather: {site_coords}")
    print(f"Nosso serviço: {our_coords}")
    
    # Calcular diferença
    lat_diff = abs(site_coords['lat'] - our_coords['lat'])
    lon_diff = abs(site_coords['lon'] - our_coords['lon'])
    
    print(f"\n📏 Diferenças:")
    print(f"Latitude: {lat_diff:.6f}")
    print(f"Longitude: {lon_diff:.6f}")
    
    if lat_diff > 0.01 or lon_diff > 0.01:
        print("⚠️ DIFERENÇA SIGNIFICATIVA NAS COORDENADAS!")
        print("Isso pode explicar as diferenças nos dados climáticos.")
        
        # Testar com as coordenadas exatas do site
        print(f"\n🎯 Testando com coordenadas EXATAS do site OpenWeather...")
        
        api_key = settings.OPENWEATHER_API_KEY
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': site_coords['lat'],
            'lon': site_coords['lon'],
            'appid': api_key,
            'units': 'metric',
            'lang': 'pt'
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            print(f"Temperatura com coordenadas do site: {data['main']['temp']}°C")
            print(f"Descrição: {data['weather'][0]['description']}")
            
            # Comparar com nossos dados
            our_data = openweather_service.get_current_weather(our_coords['lat'], our_coords['lon'])
            print(f"\nTemperatura com nossas coordenadas: {our_data['temperatura']}°C")
            print(f"Descrição: {our_data['descricao']}")
            
            temp_diff = abs(data['main']['temp'] - our_data['temperatura'])
            print(f"\n🌡️ Diferença de temperatura: {temp_diff}°C")
            
            if temp_diff > 0.5:
                print("❌ DIFERENÇA SIGNIFICATIVA DE TEMPERATURA!")
                return False
            else:
                print("✅ Temperaturas são praticamente iguais!")
                return True
        else:
            print(f"❌ Erro na API: {response.status_code}")
            return False
    else:
        print("✅ Coordenadas são praticamente iguais!")
        return True

def test_exact_match():
    """Testar se podemos obter dados EXATAMENTE iguais"""
    
    # Usar coordenadas exatas do site OpenWeather
    exact_lat = -19.8436
    exact_lon = 34.8389
    
    print(f"\n🎯 Usando coordenadas EXATAS: [{exact_lat}, {exact_lon}]")
    
    weather_data = openweather_service.get_current_weather(exact_lat, exact_lon)
    
    if weather_data:
        print(f"✅ Dados obtidos com coordenadas exatas:")
        print(f"Temperatura: {weather_data['temperatura']}°C")
        print(f"Sensação: {weather_data['sensacao_termica']}°C")
        print(f"Umidade: {weather_data['umidade']}%")
        print(f"Pressão: {weather_data['pressao']} hPa")
        print(f"Vento: {weather_data['velocidade_vento']} m/s")
        print(f"Descrição: {weather_data['descricao']}")
        
        return weather_data
    else:
        print("❌ Erro ao obter dados com coordenadas exatas")
        return None

if __name__ == "__main__":
    print("🌍 Verificando compatibilidade EXATA com OpenWeather...")
    
    coords_ok = check_exact_coordinates()
    exact_data = test_exact_match()
    
    if coords_ok and exact_data:
        print("\n🎉 SUCESSO: Dados podem ser obtidos de forma EXATA!")
    else:
        print("\n⚠️ Há diferenças que precisam ser ajustadas.")
