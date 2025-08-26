/**
 * Serviço do OpenWeather API - Dados Climáticos
 * ============================================
 * 
 * Este serviço integra com a OpenWeather API para obter
 * dados climáticos precisos baseados na localização.
 */

import axios, { AxiosResponse } from 'axios';
import { OPENWEATHER_CONFIG, OPENWEATHER_ENDPOINTS } from '@/config/apis';
import { LocationCoordinates } from './location';

// Tipos para dados climáticos
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  // Informações básicas
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
  
  // Dados atuais
  current: {
    temperature: number;          // Temperatura em °C
    feels_like: number;          // Sensação térmica em °C
    humidity: number;            // Umidade em %
    pressure: number;            // Pressão em hPa
    visibility: number;          // Visibilidade em metros
    uv_index: number;           // Índice UV
    
    // Vento
    wind: {
      speed: number;             // Velocidade em m/s
      direction: number;         // Direção em graus
      gust?: number;            // Rajadas em m/s
    };
    
    // Condições
    condition: WeatherCondition;
    
    // Horários
    sunrise: number;             // Unix timestamp
    sunset: number;              // Unix timestamp
    timestamp: number;           // Unix timestamp
  };
  
  // Alertas (se houver)
  alerts?: WeatherAlert[];
}

export interface WeatherForecast {
  location: CurrentWeather['location'];
  forecast: WeatherForecastDay[];
}

export interface WeatherForecastDay {
  date: string;                 // YYYY-MM-DD
  temperature: {
    min: number;
    max: number;
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  humidity: number;
  wind: {
    speed: number;
    direction: number;
  };
  condition: WeatherCondition;
  precipitation: {
    probability: number;        // Probabilidade de chuva (0-100%)
    volume?: number;           // Volume de chuva em mm
  };
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;               // Unix timestamp
  end: number;                 // Unix timestamp
  description: string;
  tags: string[];
}

export interface WeatherError {
  code: 'API_KEY_MISSING' | 'API_ERROR' | 'NETWORK_ERROR' | 'LOCATION_INVALID' | 'RATE_LIMIT';
  message: string;
  details?: any;
}

class OpenWeatherService {
  private apiKey: string;
  private baseHeaders: Record<string, string>;

  constructor() {
    this.apiKey = OPENWEATHER_CONFIG.API_KEY;
    this.baseHeaders = {
      'Content-Type': 'application/json'
    };

    if (!this.apiKey) {
      console.warn('⚠️ OpenWeather API key não configurada');
    }
  }

  /**
   * Valida se a API está configurada corretamente
   */
  private validateApiKey(): void {
    if (!this.apiKey) {
      throw {
        code: 'API_KEY_MISSING',
        message: 'Chave da API OpenWeather não configurada. Configure NEXT_PUBLIC_OPENWEATHER_API_KEY no arquivo .env.local'
      } as WeatherError;
    }
  }

  /**
   * Faz uma chamada para a API do OpenWeather
   */
  private async makeApiCall<T>(url: string, params: Record<string, any>): Promise<T> {
    try {
      this.validateApiKey();

      const response: AxiosResponse<T> = await axios.get(url, {
        params: {
          ...OPENWEATHER_CONFIG.DEFAULT_PARAMS,
          ...params
        },
        headers: this.baseHeaders,
        timeout: 10000 // 10 segundos de timeout
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na chamada da API OpenWeather:', error);

      if (error.response) {
        // Erro da API
        const status = error.response.status;
        let errorCode: WeatherError['code'] = 'API_ERROR';
        let errorMessage = 'Erro na API do OpenWeather';

        switch (status) {
          case 401:
            errorCode = 'API_KEY_MISSING';
            errorMessage = 'Chave da API inválida ou não configurada';
            break;
          case 404:
            errorCode = 'LOCATION_INVALID';
            errorMessage = 'Localização não encontrada';
            break;
          case 429:
            errorCode = 'RATE_LIMIT';
            errorMessage = 'Limite de chamadas da API excedido';
            break;
          default:
            errorMessage = `Erro da API: ${status}`;
        }

        throw {
          code: errorCode,
          message: errorMessage,
          details: error.response.data
        } as WeatherError;
      } else if (error.request) {
        // Erro de rede
        throw {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com a API do OpenWeather',
          details: error.message
        } as WeatherError;
      } else {
        // Outro erro
        throw {
          code: 'API_ERROR',
          message: error.message || 'Erro desconhecido',
          details: error
        } as WeatherError;
      }
    }
  }

  /**
   * Converte dados da API para o formato interno
   */
  private transformCurrentWeatherData(data: any): CurrentWeather {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        latitude: data.coord.lat,
        longitude: data.coord.lon,
        timezone: data.timezone
      },
      current: {
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        uv_index: 0, // Não disponível no endpoint current
        
        wind: {
          speed: data.wind?.speed || 0,
          direction: data.wind?.deg || 0,
          gust: data.wind?.gust
        },
        
        condition: {
          id: data.weather[0].id,
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timestamp: data.dt
      }
    };
  }

  /**
   * Obtém dados climáticos atuais para coordenadas específicas
   */
  public async getCurrentWeather(coordinates: LocationCoordinates): Promise<CurrentWeather> {
    console.log(`🌤️ Obtendo clima atual para: ${coordinates.latitude}, ${coordinates.longitude}`);

    const data = await this.makeApiCall<any>(OPENWEATHER_ENDPOINTS.CURRENT, {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    });

    const weather = this.transformCurrentWeatherData(data);
    
    console.log(`✅ Clima obtido para ${weather.location.name}: ${weather.current.temperature}°C, ${weather.current.condition.description}`);
    
    return weather;
  }

  /**
   * Obtém previsão do tempo para os próximos 5 dias
   */
  public async getWeatherForecast(coordinates: LocationCoordinates): Promise<WeatherForecast> {
    console.log(`📅 Obtendo previsão para: ${coordinates.latitude}, ${coordinates.longitude}`);

    const data = await this.makeApiCall<any>(OPENWEATHER_ENDPOINTS.FORECAST, {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    });

    // Agrupa previsões por dia
    const dailyForecasts: { [date: string]: any[] } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Processa dados diários
    const forecast: WeatherForecastDay[] = Object.entries(dailyForecasts)
      .slice(0, 5) // Próximos 5 dias
      .map(([date, dayData]) => {
        const temps = dayData.map(item => item.main.temp);
        const conditions = dayData.map(item => item.weather[0]);
        const precipitations = dayData.map(item => item.pop || 0);

        return {
          date,
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps)),
            morning: Math.round(dayData.find(item => new Date(item.dt * 1000).getHours() === 6)?.main.temp || temps[0]),
            afternoon: Math.round(dayData.find(item => new Date(item.dt * 1000).getHours() === 15)?.main.temp || temps[Math.floor(temps.length/2)]),
            evening: Math.round(dayData.find(item => new Date(item.dt * 1000).getHours() === 18)?.main.temp || temps[temps.length-1]),
            night: Math.round(dayData.find(item => new Date(item.dt * 1000).getHours() === 21)?.main.temp || temps[temps.length-1])
          },
          humidity: Math.round(dayData.reduce((acc, item) => acc + item.main.humidity, 0) / dayData.length),
          wind: {
            speed: dayData.reduce((acc, item) => acc + (item.wind?.speed || 0), 0) / dayData.length,
            direction: dayData[Math.floor(dayData.length/2)].wind?.deg || 0
          },
          condition: conditions[Math.floor(conditions.length/2)], // Condição do meio-dia
          precipitation: {
            probability: Math.round(Math.max(...precipitations) * 100),
            volume: dayData.reduce((acc, item) => acc + (item.rain?.['3h'] || 0), 0)
          }
        };
      });

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
        timezone: data.city.timezone
      },
      forecast
    };
  }

  /**
   * Obtém dados climáticos completos (atual + previsão)
   */
  public async getCompleteWeatherData(coordinates: LocationCoordinates): Promise<{
    current: CurrentWeather;
    forecast: WeatherForecast;
  }> {
    console.log('🌍 Obtendo dados climáticos completos...');

    try {
      // Busca dados em paralelo para melhor performance
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(coordinates),
        this.getWeatherForecast(coordinates)
      ]);

      console.log('✅ Dados climáticos completos obtidos com sucesso');

      return {
        current: currentWeather,
        forecast
      };
    } catch (error) {
      console.error('❌ Erro ao obter dados climáticos completos:', error);
      throw error;
    }
  }

  /**
   * Verifica se a API está funcionando
   */
  public async testApiConnection(): Promise<boolean> {
    try {
      this.validateApiKey();
      
      // Testa com coordenadas de Maputo
      await this.makeApiCall<any>(OPENWEATHER_ENDPOINTS.CURRENT, {
        lat: -25.969,
        lon: 32.573
      });
      
      console.log('✅ Conexão com OpenWeather API funcionando');
      return true;
    } catch (error) {
      console.log('❌ Erro na conexão com OpenWeather API:', error);
      return false;
    }
  }
}

// Instância singleton do serviço
export const openWeatherService = new OpenWeatherService();

// Funções utilitárias para o clima
export const weatherUtils = {
  /**
   * Converte velocidade do vento de m/s para km/h
   */
  windSpeedToKmh: (mps: number): number => Math.round(mps * 3.6),

  /**
   * Obtém URL do ícone do OpenWeather
   */
  getWeatherIconUrl: (icon: string, size: '2x' | '4x' = '2x'): string => 
    `https://openweathermap.org/img/wn/${icon}@${size}.png`,

  /**
   * Obtém emoji do clima baseado no código do ícone
   */
  getWeatherEmoji: (icon: string): string => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[icon] || '🌤️';
  },

  /**
   * Formata temperatura com unidade
   */
  formatTemperature: (temp: number): string => `${temp}°C`,

  /**
   * Converte direção do vento em graus para texto
   */
  windDirectionToText: (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  },

  /**
   * Determina se é dia ou noite baseado no timestamp e horários do sol
   */
  isDayTime: (timestamp: number, sunrise: number, sunset: number): boolean => {
    return timestamp >= sunrise && timestamp <= sunset;
  }
};
