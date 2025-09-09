/**
 * Configuração das APIs - Google Maps e OpenWeather
 * ================================================
 * 
 * Este arquivo centraliza as configurações das APIs externas
 * utilizadas para localização e dados climáticos.
 */

// Configurações do Google Maps API
export const GOOGLE_MAPS_CONFIG = {
  // Chave da API do Google Maps (deve ser configurada no .env.local)
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  
  // Bibliotecas do Google Maps necessárias
  LIBRARIES: ['places', 'geometry'],
  
  // Configurações de geolocalização
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,    // Usa GPS quando disponível
    timeout: 20000,              // 20 segundos de timeout (reduzido)
    maximumAge: 300000           // Cache por 5 minutos
  },
  
  // Configurações de fallback para geolocalização
  GEOLOCATION_FALLBACK_OPTIONS: {
    enableHighAccuracy: false,   // Precisão normal mais rápida
    timeout: 15000,              // 15 segundos
    maximumAge: 600000           // Cache por 10 minutos
  }
};

// Configurações do OpenWeather API
export const OPENWEATHER_CONFIG = {
  // Chave da API do OpenWeather (deve ser configurada no .env.local)
  API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
  
  // URL base da API
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  // Configurações padrão
  getDefaultParams: () => ({
    units: 'metric',      // Celsius, m/s, etc.
    lang: 'pt_br',        // Português brasileiro
    appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
  })
}


// URLs específicas do OpenWeather
export const OPENWEATHER_ENDPOINTS = {
  CURRENT: `${OPENWEATHER_CONFIG.BASE_URL}/weather`,
  FORECAST: `${OPENWEATHER_CONFIG.BASE_URL}/forecast`,
  ONE_CALL: `${OPENWEATHER_CONFIG.BASE_URL}/onecall`
};

// Validação das chaves de API
export const validateApiKeys = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!GOOGLE_MAPS_CONFIG.API_KEY) {
    errors.push('Chave do Google Maps API não configurada (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)');
  }
  
  if (!OPENWEATHER_CONFIG.API_KEY) {
    errors.push('Chave do OpenWeather API não configurada (NEXT_PUBLIC_OPENWEATHER_API_KEY)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
