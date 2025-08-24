"""
Serviço de integração com OpenWeather API
"""
import requests
from django.conf import settings
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class OpenWeatherService:
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.geocoding_url = "https://api.openweathermap.org/geo/1.0"
        
    def get_coordinates(self, city_name: str, country_code: str = "MZ") -> Optional[Dict]:
        """
        Obter coordenadas de uma cidade em Moçambique
        """
        try:
            url = f"{self.geocoding_url}/direct"
            params = {
                'q': f"{city_name},{country_code}",
                'limit': 1,
                'appid': self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if data:
                return {
                    'lat': data[0]['lat'],
                    'lon': data[0]['lon'],
                    'name': data[0]['name']
                }
            return None
            
        except Exception as e:
            logger.error(f"Erro ao obter coordenadas para {city_name}: {e}")
            return None
    
    def get_current_weather(self, lat: float, lon: float) -> Optional[Dict]:
        """
        Obter clima atual por coordenadas
        """
        try:
            url = f"{self.base_url}/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric',
                'lang': 'pt'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'temperatura': data['main']['temp'],
                'temperatura_min': data['main']['temp_min'],
                'temperatura_max': data['main']['temp_max'],
                'umidade': data['main']['humidity'],
                'pressao': data['main']['pressure'],
                'descricao': data['weather'][0]['description'],
                'velocidade_vento': data['wind']['speed'],
                'visibilidade': data.get('visibility', 0) / 1000,  # em km
                'data_atualizacao': datetime.fromtimestamp(data['dt']).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter clima atual: {e}")
            return None
    
    def get_forecast(self, lat: float, lon: float, days: int = 5) -> List[Dict]:
        """
        Obter previsão do tempo para os próximos dias
        """
        try:
            url = f"{self.base_url}/forecast"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric',
                'lang': 'pt'
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            forecasts = []
            
            # OpenWeather retorna previsões de 3 em 3 horas
            # Vamos agrupar por dia
            daily_forecasts = {}
            
            for item in data['list'][:days * 8]:  # 8 previsões por dia (3h cada)
                date = datetime.fromtimestamp(item['dt']).date()
                
                if date not in daily_forecasts:
                    daily_forecasts[date] = {
                        'data': date.isoformat(),
                        'temperaturas': [],
                        'umidades': [],
                        'precipitacoes': [],
                        'descricoes': [],
                        'ventos': []
                    }
                
                daily_forecasts[date]['temperaturas'].append(item['main']['temp'])
                daily_forecasts[date]['umidades'].append(item['main']['humidity'])
                daily_forecasts[date]['precipitacoes'].append(
                    item.get('rain', {}).get('3h', 0)
                )
                daily_forecasts[date]['descricoes'].append(
                    item['weather'][0]['description']
                )
                daily_forecasts[date]['ventos'].append(item['wind']['speed'])
            
            # Processar dados diários
            for date, data_day in daily_forecasts.items():
                forecasts.append({
                    'data_previsao': data_day['data'],
                    'temperatura_min': min(data_day['temperaturas']),
                    'temperatura_max': max(data_day['temperaturas']),
                    'umidade': sum(data_day['umidades']) / len(data_day['umidades']),
                    'precipitacao': sum(data_day['precipitacoes']),
                    'velocidade_vento': sum(data_day['ventos']) / len(data_day['ventos']),
                    'descricao': max(set(data_day['descricoes']), 
                                   key=data_day['descricoes'].count)
                })
            
            return forecasts
            
        except Exception as e:
            logger.error(f"Erro ao obter previsão: {e}")
            return []
    
    def get_weather_alerts(self, lat: float, lon: float) -> List[Dict]:
        """
        Verificar condições que podem gerar alertas climáticos
        """
        try:
            current = self.get_current_weather(lat, lon)
            forecast = self.get_forecast(lat, lon, 3)
            
            alerts = []
            
            if not current or not forecast:
                return alerts
            
            # Alerta de chuva forte
            for day in forecast:
                if day['precipitacao'] > 20:  # mais de 20mm
                    alerts.append({
                        'tipo_alerta': 'chuva_forte',
                        'nivel': 'alto' if day['precipitacao'] > 50 else 'medio',
                        'titulo': 'Alerta de Chuva Forte',
                        'descricao': f"Previsão de {day['precipitacao']:.1f}mm de chuva para {day['data_previsao']}",
                        'data_inicio': day['data_previsao'],
                        'data_fim': day['data_previsao']
                    })
            
            # Alerta de temperatura alta
            if current['temperatura'] > 35:
                alerts.append({
                    'tipo_alerta': 'calor_extremo',
                    'nivel': 'alto',
                    'titulo': 'Alerta de Calor Extremo',
                    'descricao': f"Temperatura atual de {current['temperatura']:.1f}°C. Proteja plantas e animais.",
                    'data_inicio': datetime.now().date().isoformat(),
                    'data_fim': datetime.now().date().isoformat()
                })
            
            # Alerta de vento forte
            if current['velocidade_vento'] > 15:  # > 15 m/s
                alerts.append({
                    'tipo_alerta': 'vento_forte',
                    'nivel': 'medio',
                    'titulo': 'Alerta de Vento Forte',
                    'descricao': f"Ventos de {current['velocidade_vento']:.1f} m/s. Cuidado com culturas altas.",
                    'data_inicio': datetime.now().date().isoformat(),
                    'data_fim': datetime.now().date().isoformat()
                })
            
            # Alerta de seca (baixa umidade + sem chuva)
            days_without_rain = sum(1 for day in forecast if day['precipitacao'] < 1)
            if days_without_rain >= 5 and current['umidade'] < 30:
                alerts.append({
                    'tipo_alerta': 'seca',
                    'nivel': 'medio',
                    'titulo': 'Condições de Seca',
                    'descricao': f"Umidade baixa ({current['umidade']}%) e sem previsão de chuva. Considere irrigação.",
                    'data_inicio': datetime.now().date().isoformat(),
                    'data_fim': (datetime.now() + timedelta(days=7)).date().isoformat()
                })
            
            return alerts
            
        except Exception as e:
            logger.error(f"Erro ao gerar alertas climáticos: {e}")
            return []

# Instância global do serviço
openweather_service = OpenWeatherService()
