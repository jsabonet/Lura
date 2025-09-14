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
        
        # Coordenadas exatas do site OpenWeather para garantir dados idênticos
        # Capitais provinciais e cidades importantes de Moçambique
        self.exact_coordinates = {
            # Maputo (Província e Cidade)
            'maputo': {'lat': -25.966213, 'lon': 32.56745, 'name': 'Maputo'},
            'matola': {'lat': -25.962, 'lon': 32.459, 'name': 'Matola'},
            
            # Gaza
            'xai-xai': {'lat': -25.052, 'lon': 33.644, 'name': 'Xai-Xai'},
            'chokwe': {'lat': -24.533, 'lon': 33.017, 'name': 'Chokwe'},
            'chibuto': {'lat': -24.688, 'lon': 33.531, 'name': 'Chibuto'},
            
            # Inhambane
            'inhambane': {'lat': -23.865, 'lon': 35.383, 'name': 'Inhambane'},
            'maxixe': {'lat': -23.860, 'lon': 35.347, 'name': 'Maxixe'},
            'vilanculos': {'lat': -22.018, 'lon': 35.313, 'name': 'Vilanculos'},
            
            # Sofala
            'beira': {'lat': -19.8436, 'lon': 34.8389, 'name': 'Beira'},
            'dondo': {'lat': -19.611, 'lon': 34.743, 'name': 'Dondo'},
            'nhamatanda': {'lat': -19.672, 'lon': 34.457, 'name': 'Nhamatanda'},
            
            # Manica
            'chimoio': {'lat': -19.116, 'lon': 33.484, 'name': 'Chimoio'},
            'manica': {'lat': -18.936, 'lon': 32.873, 'name': 'Manica'},
            'catandica': {'lat': -18.975, 'lon': 33.712, 'name': 'Catandica'},
            
            # Tete
            'tete': {'lat': -16.1564, 'lon': 33.5867, 'name': 'Tete'},
            'moatize': {'lat': -16.104, 'lon': 33.393, 'name': 'Moatize'},
            'cahora-bassa': {'lat': -15.599, 'lon': 32.666, 'name': 'Cahora Bassa'},
            'angonia': {'lat': -14.747, 'lon': 34.735, 'name': 'Angonia'},
            
            # Zambézia
            'quelimane': {'lat': -17.8788, 'lon': 36.8883, 'name': 'Quelimane'},
            'mocuba': {'lat': -16.836, 'lon': 36.986, 'name': 'Mocuba'},
            'gurué': {'lat': -15.462, 'lon': 36.988, 'name': 'Gurué'},
            'milange': {'lat': -15.934, 'lon': 35.831, 'name': 'Milange'},
            
            # Nampula
            'nampula': {'lat': -15.1162, 'lon': 39.2666, 'name': 'Nampula'},
            'nacala': {'lat': -14.543, 'lon': 40.673, 'name': 'Nacala'},
            'ilha-de-mocambique': {'lat': -15.032, 'lon': 40.739, 'name': 'Ilha de Moçambique'},
            'angoche': {'lat': -16.231, 'lon': 39.908, 'name': 'Angoche'},
            
            # Cabo Delgado
            'pemba': {'lat': -12.974, 'lon': 40.517, 'name': 'Pemba'},
            'montepuez': {'lat': -13.126, 'lon': 38.999, 'name': 'Montepuez'},
            'mueda': {'lat': -11.674, 'lon': 39.563, 'name': 'Mueda'},
            'mocimboa-da-praia': {'lat': -11.359, 'lon': 40.351, 'name': 'Mocímboa da Praia'},
            
            # Niassa
            'lichinga': {'lat': -13.313, 'lon': 35.240, 'name': 'Lichinga'},
            'cuamba': {'lat': -14.801, 'lon': 36.536, 'name': 'Cuamba'},
            'mandimba': {'lat': -14.297, 'lon': 35.776, 'name': 'Mandimba'},
            
            # Variações de nomes (para facilitar buscas)
            'lourenco-marques': {'lat': -25.966213, 'lon': 32.56745, 'name': 'Maputo'},
            'beira-sofala': {'lat': -19.8436, 'lon': 34.8389, 'name': 'Beira'},
            'vila-de-tete': {'lat': -16.1564, 'lon': 33.5867, 'name': 'Tete'},
        }
        self.geocoding_url = "https://api.openweathermap.org/geo/1.0"
        
    def get_coordinates(self, city_name: str, country_code: str = "MZ") -> Optional[Dict]:
        """
        Obter coordenadas de uma cidade usando coordenadas exatas quando disponível
        """
        # Verificar se temos coordenadas exatas para esta cidade
        city_key = city_name.lower().strip()
        if city_key in self.exact_coordinates:
            logger.info(f"Usando coordenadas exatas para {city_name}")
            return self.exact_coordinates[city_key]
        
        # Fallback para geocoding API se não temos coordenadas exatas
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
                'sensacao_termica': data['main']['feels_like'],
                'temperatura_min': data['main']['temp_min'],
                'temperatura_max': data['main']['temp_max'],
                'umidade': data['main']['humidity'],
                'pressao': data['main']['pressure'],
                'descricao': data['weather'][0]['description'],
                'condicao': data['weather'][0]['main'].lower(),
                'icone': data['weather'][0]['icon'],
                'velocidade_vento': data['wind']['speed'],
                'direcao_vento': data['wind'].get('deg', 0),
                'visibilidade': data.get('visibility', 10000) / 1000,  # em km
                'pais': data['sys']['country'],
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
                    'data': data_day['data'],
                    'temperatura_min': min(data_day['temperaturas']),
                    'temperatura_max': max(data_day['temperaturas']),
                    'condicao': 'clear',
                    'descricao': max(set(data_day['descricoes']), 
                                   key=data_day['descricoes'].count),
                    'icone': '01d',
                    'probabilidade_chuva': min(100, sum(data_day['precipitacoes']) * 10),
                    'umidade': int(sum(data_day['umidades']) / len(data_day['umidades'])),
                    'velocidade_vento': sum(data_day['ventos']) / len(data_day['ventos'])
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
                    'descricao': f"Umidade baixa ({current['umidade']}%) e sem previsão de chuva. Considere rega.",
                    'data_inicio': datetime.now().date().isoformat(),
                    'data_fim': (datetime.now() + timedelta(days=7)).date().isoformat()
                })
            
            return alerts
            
        except Exception as e:
            logger.error(f"Erro ao gerar alertas climáticos: {e}")
            return []

# Instância global do serviço
openweather_service = OpenWeatherService()
