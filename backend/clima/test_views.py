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
    Suporta tanto busca por cidade quanto por coordenadas GPS
    """
    cidade = request.GET.get('cidade')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    
    try:
        # Priorizar coordenadas GPS se fornecidas
        if lat and lon:
            try:
                latitude = float(lat)
                longitude = float(lon)
                print(f"🎯 Usando coordenadas GPS: [{latitude}, {longitude}]")
                
                # Obter dados climáticos reais usando coordenadas GPS
                weather_data = openweather_service.get_current_weather(latitude, longitude)
                
                if weather_data:
                    # Mapear os dados para o formato esperado pelo frontend
                    response_data = {
                        'temperatura': weather_data['temperatura'],
                        'sensacao_termica': weather_data.get('sensacao_termica', weather_data['temperatura']),
                        'umidade': weather_data['umidade'],
                        'pressao': weather_data['pressao'],
                        'velocidade_vento': weather_data['velocidade_vento'],
                        'direcao_vento': weather_data.get('direcao_vento', 0),
                        'visibilidade': weather_data.get('visibilidade', 10),
                        'condicao': weather_data.get('condicao', 'clear'),
                        'descricao': weather_data['descricao'],
                        'icone': weather_data.get('icone', '01d'),
                        'cidade': f"GPS ({latitude:.4f}, {longitude:.4f})",
                        'pais': weather_data.get('pais', 'MZ'),
                        'data_hora': weather_data.get('data_atualizacao', datetime.now().isoformat()),
                        'fonte': 'openweather_api_gps',
                        'coordenadas': {'lat': latitude, 'lon': longitude}
                    }
                    print(f"✅ Retornando dados reais da API via GPS")
                    return Response(response_data)
                
            except (ValueError, TypeError):
                print(f"❌ Coordenadas GPS inválidas: lat={lat}, lon={lon}")
                # Continuar com busca por cidade se coordenadas são inválidas
        
        # Fallback para busca por cidade
        if not cidade:
            cidade = 'Maputo'  # Cidade padrão
            
        print(f"🔍 Buscando clima para cidade: {cidade}")
        
        # Obter coordenadas da cidade
        coords = openweather_service.get_coordinates(cidade)
        print(f"🌍 Coordenadas obtidas: {coords}")
        
        if coords:
            # Obter dados climáticos reais
            weather_data = openweather_service.get_current_weather(
                coords['lat'], coords['lon']
            )
            print(f"🌤️ Dados climáticos: {weather_data}")
            
            if weather_data:
                # Mapear os dados para o formato esperado pelo frontend
                response_data = {
                    'temperatura': weather_data['temperatura'],
                    'sensacao_termica': weather_data.get('sensacao_termica', weather_data['temperatura']),
                    'umidade': weather_data['umidade'],
                    'pressao': weather_data['pressao'],
                    'velocidade_vento': weather_data['velocidade_vento'],
                    'direcao_vento': weather_data.get('direcao_vento', 0),
                    'visibilidade': weather_data.get('visibilidade', 10),
                    'condicao': weather_data.get('condicao', 'clear'),
                    'descricao': weather_data['descricao'],
                    'icone': weather_data.get('icone', '01d'),
                    'cidade': cidade,
                    'pais': weather_data.get('pais', 'MZ'),
                    'data_hora': weather_data.get('data_atualizacao', datetime.now().isoformat()),
                    'fonte': 'openweather_api'
                }
                print(f"✅ Retornando dados reais da API")
                return Response(response_data)
        
        print("⚠️ Usando fallback - coordenadas ou dados não encontrados")
        # Fallback para dados mock se API não disponível
        data = {
            'temperatura': 27,
            'sensacao_termica': 29,
            'umidade': 68,
            'pressao': 1013,
            'velocidade_vento': 12,
            'direcao_vento': 180,
            'visibilidade': 10,
            'condicao': 'clouds',
            'descricao': 'Parcialmente nublado',
            'icone': '02d',
            'cidade': cidade,
            'pais': 'MZ',
            'data_hora': datetime.now().isoformat(),
            'fonte': 'dados_simulados'
        }
        
        return Response(data)
        
    except Exception as e:
        print(f"❌ Erro capturado: {e}")
        # Em caso de erro, retornar dados mock
        data = {
            'temperatura': 25,
            'sensacao_termica': 27,
            'umidade': 65,
            'pressao': 1013,
            'velocidade_vento': 10,
            'direcao_vento': 180,
            'visibilidade': 10,
            'condicao': 'clear',
            'descricao': 'Dados indisponíveis',
            'icone': '01d',
            'cidade': cidade,
            'pais': 'MZ',
            'data_hora': datetime.now().isoformat(),
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
    Suporta tanto busca por cidade quanto por coordenadas GPS
    """
    cidade = request.GET.get('cidade')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    dias = int(request.GET.get('dias', 5))
    
    try:
        # Priorizar coordenadas GPS se fornecidas
        if lat and lon:
            try:
                latitude = float(lat)
                longitude = float(lon)
                print(f"🎯 Usando coordenadas GPS para previsão: [{latitude}, {longitude}]")
                
                # Obter previsão real usando coordenadas GPS
                previsao_real = openweather_service.get_forecast(latitude, longitude, dias)
                
                if previsao_real:
                    for previsao in previsao_real:
                        previsao['cidade'] = f"GPS ({latitude:.4f}, {longitude:.4f})"
                        previsao['fonte'] = 'openweather_api_gps'
                    
                    return Response(previsao_real)
                
            except (ValueError, TypeError):
                print(f"❌ Coordenadas GPS inválidas para previsão: lat={lat}, lon={lon}")
        
        # Fallback para busca por cidade
        if not cidade:
            cidade = 'Maputo'  # Cidade padrão
            
        print(f"🔍 Buscando previsão para cidade: {cidade}")
        
        # Obter coordenadas da cidade
        coords = openweather_service.get_coordinates(cidade)
        
        if coords:
            # Obter previsão real
            previsao_real = openweather_service.get_forecast(
                coords['lat'], coords['lon'], dias
            )
            
            if previsao_real:
                for previsao in previsao_real:
                    previsao['cidade'] = cidade
                
                return Response(previsao_real)
        
        # Fallback para previsão mock
        previsao = []
        for i in range(dias):
            data = datetime.now() + timedelta(days=i)
            previsao.append({
                'data': data.date().isoformat(),
                'temperatura_min': 20 + i,
                'temperatura_max': 30 + i,
                'umidade': 65 + i * 2,
                'probabilidade_chuva': 0 if i < 2 else 5 * i,
                'velocidade_vento': 10 + i,
                'descricao': 'Ensolarado' if i < 3 else 'Parcialmente nublado',
                'condicao': 'clear' if i < 3 else 'clouds',
                'icone': '01d' if i < 3 else '03d',
                'cidade': cidade,
                'fonte': 'dados_simulados'
            })
        
        return Response(previsao)
        
    except Exception as e:
        return Response(
            {'erro': 'Erro ao obter previsão', 'detalhes': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
