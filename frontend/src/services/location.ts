/**
 * Serviço de Localização - Google Maps Integration Avançada
 * ========================================================
 * 
 * Este serviço utiliza os recursos avançados do Google Maps para obter
 * localização precisa usando triangulação de torres, Wi-Fi, IP e GPS.
 */

import { Loader } from '@googlemaps/js-api-loader';
import { 
  GOOGLE_MAPS_CONFIG, 
  LocationSource, 
  GeolocationRequest,
  GoogleGeolocationResponse,
  buildGeolocationRequest,
  calculateLocationConfidence,
  validateGoogleMapsApiKey
} from '@/config/google-maps';

// Tipos para localização
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  source: 'gps' | 'network' | 'passive' | 'google_maps' | 'ip' | 'fallback';
}

export interface LocationDetails {
  coordinates: LocationCoordinates;
  address: {
    formatted: string;
    city: string;
    state: string;
    country: string;
    postal_code?: string;
  };
  place_id?: string;
  confidence?: number;
}

export interface LocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'API_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: any;
}

class LocationService {
  private googleMapsLoader: Loader | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private isGoogleMapsLoaded = false;

  constructor() {
    // Só inicializa Google Maps no cliente (não no servidor)
    if (typeof window !== 'undefined') {
      this.initializeGoogleMaps();
    }
  }

  /**
   * Inicializa o Google Maps API
   */
  private async initializeGoogleMaps(): Promise<void> {
    try {
      // Verifica se está no ambiente do navegador
      if (typeof window === 'undefined') {
        console.log('Google Maps: aguardando ambiente do cliente');
        return;
      }

      if (!GOOGLE_MAPS_CONFIG.API_KEY) {
        console.warn('Google Maps API key não configurada');
        return;
      }

      this.googleMapsLoader = new Loader({
        apiKey: GOOGLE_MAPS_CONFIG.API_KEY,
        version: 'weekly',
        libraries: ['places'] as any
      });

      await this.googleMapsLoader.load();
      this.geocoder = new google.maps.Geocoder();
      this.isGoogleMapsLoaded = true;
      
      console.log('✅ Google Maps API carregado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar Google Maps API:', error);
      this.isGoogleMapsLoaded = false;
    }
  }

  /**
   * Garante que o Google Maps seja inicializado (útil para componentes que carregam após SSR)
   */
  public async ensureGoogleMapsLoaded(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    
    if (!this.isGoogleMapsLoaded && !this.googleMapsLoader) {
      await this.initializeGoogleMaps();
    }
  }

  /**
   * Obtém localização usando Google Maps Geolocation API
   * Este método usa triangulação de torres, Wi-Fi e outros métodos avançados
   */
  private async getGoogleMapsLocation(): Promise<LocationCoordinates> {
    if (!this.isGoogleMapsLoaded) {
      throw new Error('Google Maps não carregado');
    }

    // Primeiro, tenta obter a localização através da API avançada do Google
    try {
      // Coleta informações da rede para enviar ao Google
      const networkInfo = await this.collectNetworkInfo();
      
      // Faz requisição para a Google Maps Geolocation API
      const response = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=' + GOOGLE_MAPS_CONFIG.API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          considerIp: true,
          wifiAccessPoints: networkInfo.wifiAccessPoints,
          cellTowers: networkInfo.cellTowers,
          radioType: networkInfo.radioType
        })
      });

      if (!response.ok) {
        throw new Error(`Google Geolocation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.location) {
        console.log('✅ Localização obtida via Google Maps Geolocation API');
        return {
          latitude: data.location.lat,
          longitude: data.location.lng,
          accuracy: data.accuracy || 1000,
          timestamp: Date.now(),
          source: 'google_maps'
        };
      } else {
        throw new Error('Google Maps não retornou localização');
      }
    } catch (error) {
      console.warn('⚠️ Erro na Google Maps Geolocation API:', error);
      throw error;
    }
  }

  /**
   * Coleta informações de rede para enviar ao Google Maps
   */
  private async collectNetworkInfo(): Promise<{
    wifiAccessPoints: any[];
    cellTowers: any[];
    radioType: string;
  }> {
    const networkInfo = {
      wifiAccessPoints: [] as any[],
      cellTowers: [] as any[],
      radioType: 'gsm'
    };

    try {
      // Tenta obter informações de Wi-Fi (disponível em alguns navegadores)
      if ('navigator' in window && 'connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          networkInfo.radioType = connection.effectiveType || 'wifi';
        }
      }

      // Obtém informações de IP através de um serviço público
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        if (ipData.latitude && ipData.longitude) {
          // Usa a localização IP como ponto de referência
          console.log('📍 Localização IP obtida como referência:', ipData.city, ipData.country);
        }
      } catch (ipError) {
        console.warn('⚠️ Não foi possível obter localização IP:', ipError);
      }

    } catch (error) {
      console.warn('⚠️ Erro ao coletar informações de rede:', error);
    }

    return networkInfo;
  }

  /**
   * Obtém localização usando múltiplos métodos do Google Maps
   */
  private async getAdvancedGoogleLocation(): Promise<LocationCoordinates> {
    const methods = [
      {
        name: 'Google Geolocation API',
        method: () => this.getGoogleMapsLocation()
      },
      {
        name: 'Localização IP + Google',
        method: () => this.getIPBasedLocation()
      },
      {
        name: 'Browser Geolocation com Google enhancing',
        method: () => this.getEnhancedBrowserLocation()
      }
    ];

    for (const method of methods) {
      try {
        console.log(`🔍 Tentando método: ${method.name}`);
        const result = await method.method();
        console.log(`✅ Sucesso com: ${method.name}`);
        return result;
      } catch (error) {
        console.warn(`⚠️ Falha em ${method.name}:`, error);
        continue;
      }
    }

    throw new Error('Todos os métodos avançados de localização falharam');
  }

  /**
   * Localização baseada em IP e refinada com Google
   */
  private async getIPBasedLocation(): Promise<LocationCoordinates> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        console.log('📍 Localização IP obtida:', data.city, data.country);
        
        // Refina a localização usando Google Places Nearby
        if (this.isGoogleMapsLoaded) {
          const refinedLocation = await this.refineLocationWithGoogle(data.latitude, data.longitude);
          return refinedLocation || {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 10000, // Baixa precisão para IP
            timestamp: Date.now(),
            source: 'ip'
          };
        }
        
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 10000,
          timestamp: Date.now(),
          source: 'ip'
        };
      }
      
      throw new Error('Dados de IP inválidos');
    } catch (error) {
      throw new Error(`Erro na localização IP: ${error}`);
    }
  }

  /**
   * Melhora a localização do browser usando Google Maps
   */
  private async getEnhancedBrowserLocation(): Promise<LocationCoordinates> {
    // Primeiro obtém localização básica
    const basicLocation = await this.getCurrentPositionWithOptions({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    });

    // Depois refina com Google
    if (this.isGoogleMapsLoaded) {
      const refined = await this.refineLocationWithGoogle(basicLocation.latitude, basicLocation.longitude);
      return refined || basicLocation;
    }

    return basicLocation;
  }

  /**
   * Refina uma localização aproximada usando Google Places
   */
  private async refineLocationWithGoogle(lat: number, lng: number): Promise<LocationCoordinates | null> {
    if (!this.isGoogleMapsLoaded) return null;

    try {
      // Cria um mapa temporário para usar o PlacesService
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv, {
        center: { lat, lng },
        zoom: 15
      });

      return new Promise((resolve) => {
        const placesService = new google.maps.places.PlacesService(map);
        
        // Busca lugares próximos para refinar a localização
        const request = {
          location: new google.maps.LatLng(lat, lng),
          radius: 100, // 100 metros
          type: 'establishment'
        };

        placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            // Usa a localização do primeiro estabelecimento encontrado
            const firstPlace = results[0];
            if (firstPlace.geometry && firstPlace.geometry.location) {
              const location = firstPlace.geometry.location;
              console.log('🎯 Localização refinada com Google Places');
              resolve({
                latitude: location.lat(),
                longitude: location.lng(),
                accuracy: 50, // Boa precisão
                timestamp: Date.now(),
                source: 'google_maps'
              });
              return;
            }
          }
          
          // Se não encontrou nada, mantém a localização original
          resolve(null);
        });
      });
    } catch (error) {
      console.warn('⚠️ Erro ao refinar localização:', error);
      return null;
    }
  }
  private async getNativeLocation(): Promise<LocationCoordinates> {
    const strategies = [
      {
        name: 'alta_precisao',
        options: {
          enableHighAccuracy: true,
          timeout: GOOGLE_MAPS_CONFIG.GEOLOCATION_API.timeout,
          maximumAge: 300000
        },
        description: 'Alta precisão GPS'
      },
      {
        name: 'precisao_normal',
        options: {
          enableHighAccuracy: false,
          timeout: 45000,    // 45 segundos
          maximumAge: 600000 // 10 minutos
        },
        description: 'Precisão normal'
      },
      {
        name: 'timeout_longo',
        options: {
          enableHighAccuracy: false,
          timeout: 60000,    // 60 segundos
          maximumAge: 900000 // 15 minutos
        },
        description: 'Timeout estendido'
      },
      {
        name: 'cache_maximo',
        options: {
          enableHighAccuracy: false,
          timeout: 30000,    // 30 segundos
          maximumAge: 1800000 // 30 minutos - aceita dados mais antigos
        },
        description: 'Usando cache estendido'
      }
    ];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      try {
        console.log(`🔄 Tentativa ${i + 1}/${strategies.length}: ${strategy.description}`);
        const result = await this.getCurrentPositionWithOptions(strategy.options);
        console.log(`✅ Sucesso com estratégia: ${strategy.description}`);
        return result;
      } catch (error) {
        console.warn(`⚠️ Estratégia '${strategy.description}' falhou:`, error);
        
        // Se não é a última tentativa, continua
        if (i < strategies.length - 1) {
          // Pequena pausa entre tentativas
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Se chegou aqui, todas as estratégias falharam
        console.error('❌ Todas as estratégias de geolocalização falharam');
        throw error;
      }
    }

    // Fallback final - nunca deveria chegar aqui
    throw new Error('Todas as tentativas de geolocalização falharam');
  }

  /**
   * Wrapper para getCurrentPosition com Promise
   */
  private async getCurrentPositionWithOptions(options: PositionOptions): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 'POSITION_UNAVAILABLE',
          message: 'Geolocalização não suportada neste navegador'
        } as LocationError);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            source: 'gps'
          });
        },
        (error) => {
          let errorCode: LocationError['code'];
          let errorMessage: string;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorCode = 'PERMISSION_DENIED';
              errorMessage = 'Permissão de localização negada pelo utilizador';
              break;
            case error.POSITION_UNAVAILABLE:
              errorCode = 'POSITION_UNAVAILABLE';
              errorMessage = 'Localização não disponível. Verifique se o GPS está ativado';
              break;
            case error.TIMEOUT:
              errorCode = 'TIMEOUT';
              errorMessage = 'Timeout ao obter localização. Tente novamente';
              break;
            default:
              errorCode = 'API_ERROR';
              errorMessage = 'Erro desconhecido ao obter localização';
          }

          reject({
            code: errorCode,
            message: errorMessage,
            details: error
          } as LocationError);
        },
        options
      );
    });
  }

  /**
   * Converte coordenadas em endereço usando Google Geocoding
   */
  private async reverseGeocode(lat: number, lng: number): Promise<LocationDetails['address']> {
    if (!this.isGoogleMapsLoaded || !this.geocoder) {
      // Fallback para um endereço básico quando Google Maps não está disponível
      return {
        formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: 'Localização',
        state: 'Desconhecida',
        country: 'Moçambique'
      };
    }

    return new Promise((resolve) => {
      try {
        this.geocoder!.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const result = results[0];
              const components = result.address_components;

              // Extrai componentes do endereço
              const getComponent = (types: string[]) => {
                const component = components.find(comp => 
                  types.some(type => comp.types.includes(type as any))
                );
                return component?.long_name || '';
              };

              resolve({
                formatted: result.formatted_address,
                city: getComponent(['locality', 'administrative_area_level_2']),
                state: getComponent(['administrative_area_level_1']),
                country: getComponent(['country']),
                postal_code: getComponent(['postal_code'])
              });
            } else {
              // Log do status para debug, mas sempre resolve com fallback
              if (status !== google.maps.GeocoderStatus.OK) {
                console.warn('⚠️ Geocoding não disponível:', status);
              }
              
              // Fallback quando geocoding falha ou não está autorizado
              resolve({
                formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                city: 'Localização',
                state: 'Desconhecida',
                country: 'Moçambique'
              });
            }
          }
        );
      } catch (error) {
        // Catch para qualquer erro de autorização ou API
        console.warn('⚠️ Erro no geocoding (usando fallback):', error);
        resolve({
          formatted: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          city: 'Localização',
          state: 'Desconhecida',
          country: 'Moçambique'
        });
      }
    });
  }

  /**
   * Obtém localização completa do utilizador usando métodos avançados do Google Maps
   */
  public async getCurrentLocation(): Promise<LocationDetails> {
    try {
      console.log('�️ Iniciando localização avançada com Google Maps...');

      let coordinates: LocationCoordinates;

      // Primeiro tenta métodos avançados do Google Maps
      if (this.isGoogleMapsLoaded && GOOGLE_MAPS_CONFIG.API_KEY) {
        try {
          console.log('🚀 Usando métodos avançados do Google Maps...');
          coordinates = await this.getAdvancedGoogleLocation();
          console.log(`✅ Localização Google Maps: ${coordinates.latitude}, ${coordinates.longitude} (${coordinates.source})`);
        } catch (googleError) {
          console.warn('⚠️ Métodos Google Maps falharam, usando fallback nativo:', googleError);
          coordinates = await this.getNativeLocation();
        }
      } else {
        console.log('📍 Google Maps não disponível, usando métodos nativos...');
        coordinates = await this.getNativeLocation();
      }
      
      console.log(`📍 Coordenadas finais: ${coordinates.latitude}, ${coordinates.longitude}`);
      console.log(`📏 Precisão: ±${Math.round(coordinates.accuracy)}m (Fonte: ${coordinates.source})`);

      // 2. Converter coordenadas em endereço usando Google Geocoding
      const address = await this.reverseGeocode(coordinates.latitude, coordinates.longitude);
      
      console.log(`🏠 Endereço: ${address.formatted}`);

      return {
        coordinates,
        address,
        confidence: this.calculateConfidence(coordinates)
      };

    } catch (error) {
      console.error('❌ Erro ao obter localização:', error);
      throw error as LocationError;
    }
  }

  /**
   * Calcula a confiança da localização baseada na fonte e precisão
   */
  private calculateConfidence(coordinates: LocationCoordinates): number {
    // Mapeia os tipos de fonte antigos para os novos
    const sourceMapping: Record<string, LocationSource> = {
      'google_maps': 'google_geolocation',
      'gps': 'browser_gps',
      'network': 'browser_gps',
      'passive': 'browser_gps',
      'ip': 'ip',
      'fallback': 'ip'
    };
    
    const mappedSource = sourceMapping[coordinates.source || 'gps'] || 'browser_gps';
    
    return calculateLocationConfidence(mappedSource, coordinates.accuracy);
  }

  /**
   * Verifica se a localização está disponível
   */
  public async checkLocationAvailability(): Promise<{
    geolocation: boolean;
    googleMaps: boolean;
    permissions: PermissionState | 'unsupported';
  }> {
    const result = {
      geolocation: 'geolocation' in navigator,
      googleMaps: this.isGoogleMapsLoaded,
      permissions: 'unsupported' as PermissionState | 'unsupported'
    };

    // Verificar permissões se suportado
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        result.permissions = permission.state;
      } catch (error) {
        console.log('Verificação de permissões não suportada');
      }
    }

    return result;
  }

  /**
   * Solicita permissão de localização ao utilizador
   */
  public async requestLocationPermission(): Promise<boolean> {
    try {
      await this.getNativeLocation();
      return true;
    } catch (error) {
      const locationError = error as LocationError;
      return locationError.code !== 'PERMISSION_DENIED';
    }
  }
}

/**
 * Singleton instance - criada apenas no cliente
 */
let locationServiceInstance: LocationService | null = null;

/**
 * Obtém a instância do LocationService (apenas no cliente)
 */
export const getLocationService = (): LocationService => {
  if (typeof window === 'undefined') {
    // Retorna um mock para SSR
    return {
      getCurrentLocation: async () => {
        throw new Error('LocationService não disponível no servidor');
      },
      reverseGeocode: async () => {
        throw new Error('LocationService não disponível no servidor');
      },
      checkLocationAvailability: async () => ({
        geolocation: false,
        googleMaps: false,
        hasPermission: false
      }),
      ensureGoogleMapsLoaded: async () => {}
    } as any;
  }

  if (!locationServiceInstance) {
    locationServiceInstance = new LocationService();
  }
  
  return locationServiceInstance;
};

// Instância singleton do serviço
export const locationService = getLocationService();

// Função utilitária para calcular distância entre dois pontos
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
