const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export interface WeatherData {
  temperatura: number;
  condicao: string;
  umidade: number;
  vento: number;
  chuva_probabilidade: number;
  sensacao_termica: number;
  localizacao: string;
  coordenadas: {
    lat: number;
    lon: number;
  };
}

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

/**
 * Obtém a localização atual do usuário via GPS do navegador
 */
export async function getCurrentLocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Erro ao obter localização';
        if (error.code === 1) {
          message = 'Permissão de localização negada. Ative nas configurações do navegador.';
        } else if (error.code === 2) {
          message = 'Localização indisponível. Verifique se o GPS está ativo.';
        } else if (error.code === 3) {
          message = 'Timeout ao buscar localização. Tentando método alternativo...';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: false, // Desabilitar alta precisão para ser mais rápido
        timeout: 30000, // Aumentar timeout para 30 segundos
        maximumAge: 300000, // Aceitar localização de até 5 minutos atrás
      }
    );
  });
}

/**
 * Obtém o nome da localização usando Google Maps Geocoding API
 */
export async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}&language=pt`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar localização');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Tentar encontrar a cidade e estado
      const result = data.results[0];
      const addressComponents = result.address_components;

      let cidade = '';
      let estado = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
          cidade = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          estado = component.short_name;
        }
      }

      return cidade && estado ? `${cidade}, ${estado}` : result.formatted_address;
    }

    return 'Localização não identificada';
  } catch (error) {
    console.error('Erro ao obter nome da localização:', error);
    return 'Localização não disponível';
  }
}

/**
 * Obtém dados climáticos usando OpenWeather API
 */
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar dados climáticos');
    }

    const data = await response.json();

    // Obter nome da localização
    const localizacao = await getLocationName(lat, lon);

    return {
      temperatura: Math.round(data.main.temp),
      condicao: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
      umidade: data.main.humidity,
      vento: Math.round(data.wind.speed * 3.6), // converter m/s para km/h
      chuva_probabilidade: data.clouds?.all || 0, // usar cobertura de nuvens como proxy
      sensacao_termica: Math.round(data.main.feels_like),
      localizacao,
      coordenadas: {
        lat,
        lon,
      },
    };
  } catch (error) {
    console.error('Erro ao obter dados climáticos:', error);
    throw error;
  }
}

/**
 * Função principal que obtém localização e clima
 */
export async function getWeatherByGPS(): Promise<WeatherData> {
  try {
    // 1. Obter localização GPS
    const location = await getCurrentLocation();

    // 2. Buscar dados climáticos
    const weatherData = await getWeatherData(location.latitude, location.longitude);

    return weatherData;
  } catch (error) {
    console.error('Erro ao obter clima por GPS:', error);
    
    // Fallback: usar localização padrão (Luanda, Angola)
    console.log('Usando localização padrão: Luanda, Angola');
    try {
      const fallbackData = await getWeatherData(-8.8383, 13.2344); // Coordenadas de Luanda
      return fallbackData;
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);
      throw new Error('Não foi possível obter dados climáticos');
    }
  }
}
