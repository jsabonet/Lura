"""
Script de teste para as integrações com APIs externas
"""
import os
import sys
import django
from datetime import datetime

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from clima.services.openweather import openweather_service
from notificacoes.services.twilio_service import twilio_service
from pragas.services.huggingface_service import huggingface_service

def test_openweather_api():
    """
    Testar integração com OpenWeather API
    """
    print("🌤️ Testando OpenWeather API...")
    
    try:
        # Testar obtenção de coordenadas
        coords = openweather_service.get_coordinates("Maputo")
        if coords:
            print(f"✅ Coordenadas de Maputo: {coords}")
            
            # Testar clima atual
            weather = openweather_service.get_current_weather(coords['lat'], coords['lon'])
            if weather:
                print(f"✅ Clima atual: {weather['temperatura']}°C, {weather['descricao']}")
            else:
                print("❌ Erro ao obter clima atual")
                
            # Testar previsão
            forecast = openweather_service.get_forecast(coords['lat'], coords['lon'], 3)
            if forecast:
                print(f"✅ Previsão: {len(forecast)} dias disponíveis")
            else:
                print("❌ Erro ao obter previsão")
                
            # Testar alertas
            alerts = openweather_service.get_weather_alerts(coords['lat'], coords['lon'])
            print(f"✅ Alertas climáticos: {len(alerts)} encontrados")
            
        else:
            print("❌ Erro ao obter coordenadas")
            
    except Exception as e:
        print(f"❌ Erro no teste OpenWeather: {e}")

def test_twilio_api():
    """
    Testar integração com Twilio API
    """
    print("\\n📱 Testando Twilio API...")
    
    try:
        if not twilio_service.client:
            print("⚠️ Twilio não configurado (credenciais faltando)")
            return
            
        # Testar envio de SMS (mock)
        print("✅ Cliente Twilio configurado")
        print("ℹ️ Para testar envio real, configure as credenciais no .env")
        
    except Exception as e:
        print(f"❌ Erro no teste Twilio: {e}")

def test_huggingface_api():
    """
    Testar integração com HuggingFace API
    """
    print("\\n🤖 Testando HuggingFace API...")
    
    try:
        # Testar geração de recomendação
        recommendation = huggingface_service.generate_recommendation(
            "preciso de ajuda para controlar pragas no milho"
        )
        
        if recommendation:
            print(f"✅ Recomendação gerada: {recommendation[:100]}...")
        else:
            print("❌ Erro ao gerar recomendação")
            
        # Testar dados mock para detecção de pragas
        mock_pest = huggingface_service._get_mock_pest_detection()
        print(f"✅ Mock pest detection: {mock_pest['total_detections']} pragas")
        
        # Testar análise mock de cultura
        mock_analysis = huggingface_service._get_mock_crop_analysis("milho")
        print(f"✅ Mock crop analysis: {mock_analysis['health_score']}% saúde")
        
    except Exception as e:
        print(f"❌ Erro no teste HuggingFace: {e}")

def test_integration_status():
    """
    Verificar status geral das integrações
    """
    print("\\n📊 Status das Integrações:")
    print("=" * 50)
    
    # OpenWeather
    openweather_status = "✅ Configurado" if openweather_service.api_key else "❌ Não configurado"
    print(f"OpenWeather API: {openweather_status}")
    
    # Twilio
    twilio_status = "✅ Configurado" if twilio_service.client else "❌ Não configurado"
    print(f"Twilio API: {twilio_status}")
    
    # HuggingFace
    huggingface_status = "✅ Configurado" if huggingface_service.api_key else "❌ Não configurado"
    print(f"HuggingFace API: {huggingface_status}")
    
    print("\\n📝 Instruções:")
    print("1. Configure as chaves de API no arquivo .env")
    print("2. OpenWeather: https://openweathermap.org/api (gratuito)")
    print("3. Twilio: https://www.twilio.com (trial gratuito)")
    print("4. HuggingFace: https://huggingface.co/settings/tokens (gratuito)")
    
    print("\\n🚀 Funcionalidades Disponíveis:")
    print("- ✅ Dados climáticos (com/sem API)")
    print("- ✅ Alertas climáticos inteligentes")
    print("- ✅ Detecção de pragas com IA")
    print("- ✅ Recomendações personalizadas")
    print("- ✅ Notificações SMS/WhatsApp")

if __name__ == '__main__':
    print("🧪 TESTE DAS INTEGRAÇÕES COM APIs EXTERNAS")
    print("=" * 60)
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_integration_status()
    test_openweather_api()
    test_twilio_api()
    test_huggingface_api()
    
    print("\\n✅ Teste das integrações concluído!")
    print("💡 As APIs funcionam com dados mock quando as chaves não estão configuradas.")
    print("🔧 Configure as chaves no .env para funcionalidade completa.")
