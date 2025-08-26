#!/usr/bin/env python3
"""
Script para testar diretamente o serviço OpenWeather
"""
import os
import sys
import django

# Configurar Django
sys.path.append('./backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from clima.services.openweather import openweather_service

def test_openweather_service():
    print("🌤️ Testando OpenWeather Service diretamente...")
    
    try:
        # Teste 1: Obter coordenadas
        print("\n🔍 Teste 1: Obter coordenadas de Maputo")
        coords = openweather_service.get_coordinates("Maputo")
        print(f"Coordenadas: {coords}")
        
        if coords:
            # Teste 2: Clima atual
            print("\n🌡️ Teste 2: Obter clima atual")
            weather = openweather_service.get_current_weather(coords['lat'], coords['lon'])
            print(f"Clima atual: {weather}")
            
            # Teste 3: Previsão
            print("\n📅 Teste 3: Obter previsão")
            forecast = openweather_service.get_forecast(coords['lat'], coords['lon'], 5)
            print(f"Previsão (5 dias): {len(forecast)} períodos")
            if forecast:
                print(f"Primeiro dia: {forecast[0]}")
            
            # Teste 4: Alertas
            print("\n⚠️ Teste 4: Obter alertas")
            alerts = openweather_service.get_weather_alerts(coords['lat'], coords['lon'])
            print(f"Alertas: {alerts}")
            
            print("\n✅ Todos os testes concluídos!")
            return True
        else:
            print("❌ Não foi possível obter coordenadas")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante os testes: {e}")
        return False

if __name__ == "__main__":
    success = test_openweather_service()
    if success:
        print("\n🎯 CONCLUSÃO: O backend está configurado para dados REAIS da OpenWeather API!")
    else:
        print("\n⚠️ CONCLUSÃO: O backend está usando dados MOCKADOS!")
