from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import requests
from django.conf import settings
from .models import PrevisaoClimatica, AlertaClimatico, HistoricoClima
from .serializers import PrevisaoClimaticaSerializer, AlertaClimaticoSerializer, HistoricoClimaSerializer

class PrevisaoClimaticaListView(generics.ListAPIView):
    serializer_class = PrevisaoClimaticaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = PrevisaoClimatica.objects.all()
        localizacao = self.request.query_params.get('localizacao')
        dias = self.request.query_params.get('dias', 7)
        
        if localizacao:
            queryset = queryset.filter(localizacao__icontains=localizacao)
        
        # Próximos X dias
        data_limite = timezone.now().date() + timedelta(days=int(dias))
        queryset = queryset.filter(
            data_previsao__gte=timezone.now().date(),
            data_previsao__lte=data_limite
        )
        
        return queryset.order_by('data_previsao')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def obter_clima_atual(request):
    """Obter clima atual de uma localização usando OpenWeather API"""
    localizacao = request.query_params.get('localizacao')
    if not localizacao:
        return Response({'error': 'Localização é obrigatória'}, status=400)
    
    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        return Response({'error': 'API key não configurada'}, status=500)
    
    url = f"http://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': localizacao,
        'appid': api_key,
        'units': 'metric',
        'lang': 'pt'
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if response.status_code == 200:
            return Response({
                'localizacao': data['name'],
                'temperatura': data['main']['temp'],
                'temperatura_min': data['main']['temp_min'],
                'temperatura_max': data['main']['temp_max'],
                'umidade': data['main']['humidity'],
                'descricao': data['weather'][0]['description'],
                'velocidade_vento': data['wind']['speed'],
                'coordenadas': {
                    'lat': data['coord']['lat'],
                    'lon': data['coord']['lon']
                }
            })
        else:
            return Response({'error': 'Localização não encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class AlertaClimaticoListView(generics.ListAPIView):
    serializer_class = AlertaClimaticoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AlertaClimatico.objects.filter(
            ativo=True,
            data_fim__gte=timezone.now()
        ).order_by('-nivel', 'data_inicio')

class HistoricoClimaListView(generics.ListAPIView):
    serializer_class = HistoricoClimaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = HistoricoClima.objects.all()
        localizacao = self.request.query_params.get('localizacao')
        dias = self.request.query_params.get('dias', 30)
        
        if localizacao:
            queryset = queryset.filter(localizacao__icontains=localizacao)
        
        # Últimos X dias
        data_limite = timezone.now().date() - timedelta(days=int(dias))
        queryset = queryset.filter(data__gte=data_limite)
        
        return queryset.order_by('-data')
