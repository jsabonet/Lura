from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from .services.openweather import openweather_service

@api_view(['GET'])
@permission_classes([AllowAny])
def clima_atual_view(request):
    """
    View para obter clima atual usando OpenWeather API
    """
    localizacao = request.GET.get('localizacao', 'Maputo')
    
    try:
        print(f"🔍 Buscando clima para: {localizacao}")
        
        # Obter coordenadas da cidade
        coords = openweather_service.get_coordinates(localizacao)
        print(f"🌍 Coordenadas obtidas: {coords}")
        
        if coords:
            # Obter dados climáticos reais
            weather_data = openweather_service.get_current_weather(
                coords['lat'], coords['lon']
            )
            print(f"🌤️ Dados climáticos: {weather_data}")
            
            if weather_data:
                weather_data['localizacao'] = localizacao
                weather_data['fonte'] = 'openweather_api'
                print(f"✅ Retornando dados reais da API")
                return Response(weather_data)
        
        print("⚠️ Usando fallback - coordenadas ou dados não encontrados")
        # Fallback para dados mock se API não disponível
        data = {
            'localizacao': localizacao,
            'temperatura': 27,
            'temperatura_min': 22,
            'temperatura_max': 32,
            'descricao': 'Parcialmente nublado',
            'umidade': 68,
            'velocidade_vento': 12,
            'pressao': 1013,
            'data_atualizacao': datetime.now().isoformat(),
            'fonte': 'dados_simulados'
        }
        
        return Response(data)
        
    except Exception as e:
        print(f"❌ Erro capturado: {e}")
        # Em caso de erro, retornar dados mock
        data = {
            'localizacao': localizacao,
            'temperatura': 25,
            'temperatura_min': 20,
            'temperatura_max': 30,
            'descricao': 'Dados indisponíveis',
            'umidade': 65,
            'velocidade_vento': 10,
            'pressao': 1013,
            'data_atualizacao': datetime.now().isoformat(),
            'erro': str(e),
            'fonte': 'dados_simulados'
        }
        
        return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def alertas_climaticos_view(request):
    """
    View para obter alertas climáticos usando OpenWeather API
    """
    localizacao = request.GET.get('localizacao', 'Maputo')
    
    try:
        # Obter coordenadas da cidade
        coords = openweather_service.get_coordinates(localizacao)
        
        if coords:
            # Obter alertas reais
            alertas_reais = openweather_service.get_weather_alerts(
                coords['lat'], coords['lon']
            )
            
            if alertas_reais:
                # Adicionar IDs e localização aos alertas
                for i, alerta in enumerate(alertas_reais):
                    alerta['id'] = i + 1
                    alerta['localizacao'] = localizacao
                    alerta['ativo'] = True
                
                return Response(alertas_reais)
        
        # Fallback para alertas mock
        alertas = [
            {
                'id': 1,
                'titulo': 'Alerta de Chuva Forte',
                'tipo_alerta': 'chuva_forte',
                'nivel': 'alto',
                'descricao': 'Previsão de chuvas intensas nas próximas 24 horas. Proteja suas culturas.',
                'data_inicio': datetime.now().isoformat(),
                'data_fim': (datetime.now() + timedelta(days=1)).isoformat(),
                'ativo': True,
                'localizacao': localizacao,
                'fonte': 'dados_simulados'
            },
            {
                'id': 2,
                'titulo': 'Condições Favoráveis para Plantio',
                'tipo_alerta': 'favoravel',
                'nivel': 'baixo',
                'descricao': 'Condições climáticas ideais para plantio de milho e feijão.',
                'data_inicio': datetime.now().isoformat(),
                'data_fim': (datetime.now() + timedelta(days=7)).isoformat(),
                'ativo': True,
                'localizacao': localizacao,
                'fonte': 'dados_simulados'
            }
        ]
        
        return Response(alertas)
        
    except Exception as e:
        # Em caso de erro, retornar alertas mock básicos
        alertas = [
            {
                'id': 1,
                'titulo': 'Serviço Indisponível',
                'tipo_alerta': 'info',
                'nivel': 'baixo',
                'descricao': 'Alertas climáticos temporariamente indisponíveis.',
                'data_inicio': datetime.now().isoformat(),
                'data_fim': datetime.now().isoformat(),
                'ativo': True,
                'localizacao': localizacao,
                'erro': str(e),
                'fonte': 'dados_simulados'
            }
        ]
        
        return Response(alertas)

@api_view(['GET'])
@permission_classes([AllowAny])
def previsao_tempo_view(request):
    """
    View para obter previsão do tempo
    """
    localizacao = request.GET.get('localizacao', 'Maputo')
    dias = int(request.GET.get('dias', 5))
    
    try:
        # Obter coordenadas da cidade
        coords = openweather_service.get_coordinates(localizacao)
        
        if coords:
            # Obter previsão real
            previsao_real = openweather_service.get_forecast(
                coords['lat'], coords['lon'], dias
            )
            
            if previsao_real:
                for previsao in previsao_real:
                    previsao['localizacao'] = localizacao
                
                return Response(previsao_real)
        
        # Fallback para previsão mock
        previsao = []
        for i in range(dias):
            data = datetime.now() + timedelta(days=i)
            previsao.append({
                'data_previsao': data.date().isoformat(),
                'temperatura_min': 20 + i,
                'temperatura_max': 30 + i,
                'umidade': 65 + i * 2,
                'precipitacao': 0 if i < 2 else 5 * i,
                'velocidade_vento': 10 + i,
                'descricao': 'Ensolarado' if i < 3 else 'Parcialmente nublado',
                'localizacao': localizacao,
                'fonte': 'dados_simulados'
            })
        
        return Response(previsao)
        
    except Exception as e:
        return Response(
            {'erro': 'Erro ao obter previsão', 'detalhes': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
