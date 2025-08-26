#!/usr/bin/env python3
"""
Script para testar todas as cidades de Moçambique
"""
import os
import sys
import django

# Configurar Django
sys.path.append('./backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from clima.services.openweather import openweather_service

def test_all_mozambique_cities():
    """Testar todas as cidades de Moçambique"""
    
    # Lista de cidades para testar
    cities = [
        # Maputo
        'Maputo', 'Matola',
        # Gaza
        'Xai-Xai', 'Chokwe', 'Chibuto',
        # Inhambane
        'Inhambane', 'Maxixe', 'Vilanculos',
        # Sofala
        'Beira', 'Dondo', 'Nhamatanda',
        # Manica
        'Chimoio', 'Manica', 'Catandica',
        # Tete
        'Tete', 'Moatize', 'Cahora-Bassa', 'Angonia',
        # Zambézia
        'Quelimane', 'Mocuba', 'Gurué', 'Milange',
        # Nampula
        'Nampula', 'Nacala', 'Ilha-de-Mocambique', 'Angoche',
        # Cabo Delgado
        'Pemba', 'Montepuez', 'Mueda', 'Mocimboa-da-Praia',
        # Niassa
        'Lichinga', 'Cuamba', 'Mandimba'
    ]
    
    print("🇲🇿 Testando todas as cidades de Moçambique...")
    print("=" * 60)
    
    success_count = 0
    failed_cities = []
    
    for city in cities:
        try:
            print(f"\n🔍 Testando {city}...")
            
            # Obter coordenadas
            coords = openweather_service.get_coordinates(city.lower())
            if not coords:
                print(f"❌ {city}: Coordenadas não encontradas")
                failed_cities.append(city)
                continue
            
            print(f"📍 Coordenadas: [{coords['lat']}, {coords['lon']}]")
            
            # Obter clima atual
            weather = openweather_service.get_current_weather(coords['lat'], coords['lon'])
            if weather:
                print(f"🌡️ Temperatura: {weather['temperatura']}°C")
                print(f"💧 Umidade: {weather['umidade']}%")
                print(f"📝 Descrição: {weather['descricao']}")
                print(f"✅ {city}: SUCESSO")
                success_count += 1
            else:
                print(f"❌ {city}: Erro ao obter dados climáticos")
                failed_cities.append(city)
                
        except Exception as e:
            print(f"❌ {city}: Erro - {e}")
            failed_cities.append(city)
    
    print("\n" + "=" * 60)
    print(f"📊 RESUMO DOS TESTES:")
    print(f"✅ Cidades com sucesso: {success_count}/{len(cities)}")
    print(f"❌ Cidades com falha: {len(failed_cities)}")
    
    if failed_cities:
        print(f"\n🚨 Cidades que falharam:")
        for city in failed_cities:
            print(f"   - {city}")
    else:
        print(f"\n🎉 TODAS AS CIDADES FUNCIONARAM PERFEITAMENTE!")
    
    return len(failed_cities) == 0

if __name__ == "__main__":
    all_success = test_all_mozambique_cities()
    if all_success:
        print("\n🌟 SISTEMA PRONTO PARA PRODUÇÃO!")
        print("🇲🇿 Todas as cidades de Moçambique estão disponíveis para consulta de clima!")
    else:
        print("\n⚠️ Algumas cidades precisam de ajustes.")
