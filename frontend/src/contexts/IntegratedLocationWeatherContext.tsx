/**
 * Contexto Integrado de Localização e Clima
 * ========================================
 * 
 * Este contexto substitui completamente os sistemas anteriores,
 * integrando Google Maps API + OpenWeather API para uma
 * experiência unificada de localização e clima.
 */

'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { getLocationService, LocationDetails, LocationError, LocationCoordinates } from '@/services/location';
import { openWeatherService, CurrentWeather, WeatherForecast, WeatherError, weatherUtils } from '@/services/weather';
import { validateApiKeys } from '@/config/apis';

// Estado completo do sistema
export interface IntegratedLocationWeatherState {
  // Estado da localização
  location: LocationDetails | null;
  locationError: LocationError | null;
  isLocationLoading: boolean;
  
  // Estado do clima
  currentWeather: CurrentWeather | null;
  weatherForecast: WeatherForecast | null;
  weatherError: WeatherError | null;
  isWeatherLoading: boolean;
  
  // Estado geral
  isInitialized: boolean;
  lastUpdated: number | null;
  apiStatus: {
    googleMaps: boolean;
    openWeather: boolean;
  };
}

// Ações disponíveis
interface IntegratedLocationWeatherActions {
  // Ações de localização
  requestLocation: () => Promise<void>;
  forceNativeGPS: () => Promise<void>;
  clearLocation: () => void;
  checkLocationPermissions: () => Promise<boolean>;
  
  // Ações de clima
  refreshWeather: () => Promise<void>;
  clearWeather: () => void;
  
  // Ações integradas
  initializeComplete: () => Promise<void>;
  clearAll: () => void;
  
  // Utilitários
  getLocationStatus: () => string;
  getWeatherStatus: () => string;
  isFullyLoaded: () => boolean;
}

// Tipo completo do contexto
interface IntegratedContextType extends IntegratedLocationWeatherState, IntegratedLocationWeatherActions {}

// Criação do contexto
const IntegratedLocationWeatherContext = createContext<IntegratedContextType | undefined>(undefined);

// Props do provider
interface IntegratedLocationWeatherProviderProps {
  children: ReactNode;
  autoInitialize?: boolean; // Se deve inicializar automaticamente
}

/**
 * Provider integrado que gerencia localização e clima
 */
export function IntegratedLocationWeatherProvider({ 
  children, 
  autoInitialize = true 
}: IntegratedLocationWeatherProviderProps) {
  
  // Estados da localização
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Estados do clima
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast | null>(null);
  const [weatherError, setWeatherError] = useState<WeatherError | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  
  // Estados gerais
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState({
    googleMaps: false,
    openWeather: false
  });

  /**
   * Verifica status das APIs
   */
  const checkApiStatus = useCallback(async () => {
    console.log('🔍 Verificando status das APIs...');
    
    const validation = validateApiKeys();
    
    const [googleMapsAvailable, openWeatherAvailable] = await Promise.all([
      getLocationService().checkLocationAvailability(),
      openWeatherService.testApiConnection()
    ]);

    const status = {
      googleMaps: validation.isValid && googleMapsAvailable.geolocation,
      openWeather: validation.isValid && openWeatherAvailable
    };

    setApiStatus(status);
    
    if (!validation.isValid) {
      console.warn('⚠️ Problemas de configuração:', validation.errors);
    }
    
    return status;
  }, []);

  /**
   * Solicita localização do usuário com sistema de retry inteligente
   */
  const requestLocation = useCallback(async (retryCount: number = 0): Promise<void> => {
    const maxRetries = 2;
    const retryDelay = [0, 2000, 5000]; // 0s, 2s, 5s
    
    console.log(`📍 Solicitando localização do usuário... (Tentativa ${retryCount + 1}/${maxRetries + 1})`);
    
    setIsLocationLoading(true);
    
    // Só limpa o erro na primeira tentativa
    if (retryCount === 0) {
      setLocationError(null);
    }

    try {
      const locationDetails = await getLocationService().getCurrentLocation();
      setLocation(locationDetails);
      setLocationError(null);
      
      console.log('✅ Localização obtida com sucesso:', locationDetails.address.formatted);
      
    } catch (error) {
      console.error(`❌ Erro ao obter localização (tentativa ${retryCount + 1}):`, error);
      
      // Se ainda tem tentativas disponíveis e o erro é de timeout
      const errorObj = error as LocationError;
      if (retryCount < maxRetries && errorObj.code === 'TIMEOUT') {
        console.log(`🔄 Tentando novamente em ${retryDelay[retryCount + 1] / 1000} segundos...`);
        
        setTimeout(() => {
          requestLocation(retryCount + 1);
        }, retryDelay[retryCount + 1]);
        
        return; // Não define fallback ainda, vai tentar novamente
      }
      
      // Fallback para localização padrão quando todas as tentativas falharam
      const fallbackLocation: LocationDetails = {
        coordinates: {
          latitude: -25.9692,  // Maputo, Moçambique
          longitude: 32.5732,
          accuracy: 1000,
          timestamp: Date.now(),
          source: 'fallback' as const
        },
        address: {
          formatted: 'Maputo, Moçambique (localização padrão)',
          city: 'Maputo',
          state: 'Maputo',
          country: 'Moçambique'
        }
      };
      
      console.log('🔄 Usando localização padrão após todas as tentativas:', fallbackLocation.address.formatted);
      setLocation(fallbackLocation);
      setLocationError(errorObj);
    } finally {
      // Só para o loading se não vai tentar novamente
      if (retryCount >= maxRetries || !isLocationLoading) {
        setIsLocationLoading(false);
      }
    }
  }, []);

  /**
   * Busca dados climáticos para a localização atual
   */
  const refreshWeather = useCallback(async (): Promise<void> => {
    if (!location) {
      console.log('⚠️ Localização necessária para obter clima');
      return;
    }

    console.log('🌤️ Atualizando dados climáticos...');
    
    setIsWeatherLoading(true);
    setWeatherError(null);

    try {
      const weatherData = await openWeatherService.getCompleteWeatherData(location.coordinates);
      
      setCurrentWeather(weatherData.current);
      setWeatherForecast(weatherData.forecast);
      setWeatherError(null);
      setLastUpdated(Date.now());
      
      console.log('✅ Dados climáticos atualizados:', weatherData.current.location.name);
      
    } catch (error) {
      console.error('❌ Erro ao obter clima:', error);
      setWeatherError(error as WeatherError);
    } finally {
      setIsWeatherLoading(false);
    }
  }, [location]);

  /**
   * Força obtenção de localização usando GPS nativo
   */
  const forceNativeGPS = useCallback(async (): Promise<void> => {
    if (isLocationLoading) return;
    
    setIsLocationLoading(true);
    setLocationError(null);
    
    try {
      console.log('🎯 Forçando GPS nativo para localização precisa...');
      
      // Usa apenas o GPS nativo com alta precisão
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalização não suportada'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0 // Força nova leitura
          }
        );
      });
      
      // Obter localização completa usando o serviço
      const locationService = getLocationService();
      const locationDetails = await locationService.getCurrentLocation();
      
      // Sobrescrever com dados precisos do GPS
      locationDetails.coordinates.latitude = position.coords.latitude;
      locationDetails.coordinates.longitude = position.coords.longitude;
      locationDetails.coordinates.accuracy = position.coords.accuracy;
      locationDetails.coordinates.timestamp = position.timestamp;
      locationDetails.coordinates.source = 'gps';
      
      console.log(`✅ GPS nativo obtido: ${locationDetails.address.formatted}`);
      setLocation(locationDetails);
      setLocationError(null);
      
      // Atualizar clima automaticamente no próximo tick
      setTimeout(() => refreshWeather(), 100);
      
    } catch (error) {
      console.error('❌ Erro ao obter GPS nativo:', error);
      setLocationError(error as LocationError);
    } finally {
      setIsLocationLoading(false);
    }
  }, [isLocationLoading, refreshWeather]);

  /**
   * Inicialização completa do sistema
   */
  const initializeComplete = useCallback(async (): Promise<void> => {
    console.log('🚀 Inicializando sistema integrado de localização e clima...');
    
    try {
      // 1. Verificar APIs
      const status = await checkApiStatus();
      
      if (!status.googleMaps && !status.openWeather) {
        throw new Error('Nenhuma API configurada corretamente');
      }

      // 2. Obter localização
      await requestLocation();
      
      // Aguardar um pouco para garantir que a localização foi definida
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Obter clima (apenas se localização foi obtida)
      if (location) {
        await refreshWeather();
      }
      
      setIsInitialized(true);
      console.log('✅ Sistema integrado inicializado com sucesso');
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      setIsInitialized(true); // Marca como inicializado mesmo com erro
    }
  }, [checkApiStatus, requestLocation, refreshWeather, location]);

  /**
   * Verifica permissões de localização
   */
  const checkLocationPermissions = useCallback(async (): Promise<boolean> => {
    return await getLocationService().requestLocationPermission();
  }, []);

  /**
   * Limpa dados de localização
   */
  const clearLocation = useCallback(() => {
    setLocation(null);
    setLocationError(null);
    setIsLocationLoading(false);
  }, []);

  /**
   * Limpa dados climáticos
   */
  const clearWeather = useCallback(() => {
    setCurrentWeather(null);
    setWeatherForecast(null);
    setWeatherError(null);
    setIsWeatherLoading(false);
    setLastUpdated(null);
  }, []);

  /**
   * Limpa todos os dados
   */
  const clearAll = useCallback(() => {
    clearLocation();
    clearWeather();
    setIsInitialized(false);
  }, [clearLocation, clearWeather]);

  /**
   * Obtém status da localização
   */
  const getLocationStatus = useCallback((): string => {
    if (isLocationLoading) return 'Obtendo localização...';
    if (locationError) return `Erro: ${locationError.message}`;
    if (location) return `📍 ${location.address.city}, ${location.address.state}`;
    return 'Localização não disponível';
  }, [isLocationLoading, locationError, location]);

  /**
   * Obtém status do clima
   */
  const getWeatherStatus = useCallback((): string => {
    if (isWeatherLoading) return 'Carregando clima...';
    if (weatherError) return `Erro: ${weatherError.message}`;
    if (currentWeather) {
      return `🌤️ ${currentWeather.current.temperature}°C, ${currentWeather.current.condition.description}`;
    }
    return 'Dados climáticos não disponíveis';
  }, [isWeatherLoading, weatherError, currentWeather]);

  /**
   * Verifica se todos os dados foram carregados
   */
  const isFullyLoaded = useCallback((): boolean => {
    return !!(location && currentWeather && weatherForecast && !isLocationLoading && !isWeatherLoading);
  }, [location, currentWeather, weatherForecast, isLocationLoading, isWeatherLoading]);

  /**
   * Efeito para garantir inicialização do Google Maps no cliente
   */
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await getLocationService().ensureGoogleMapsLoaded();
        console.log('🗺️ Google Maps inicializado no cliente');
      } catch (error) {
        console.warn('⚠️ Erro ao inicializar Google Maps:', error);
      }
    };

    initializeGoogleMaps();
  }, []);

  /**
   * Efeito para inicialização automática
   */
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initializeComplete();
    }
  }, [autoInitialize, isInitialized, initializeComplete]);

  /**
   * Efeito para atualizar clima quando localização muda
   */
  useEffect(() => {
    if (location && !currentWeather && !isWeatherLoading) {
      refreshWeather();
    }
  }, [location, currentWeather, isWeatherLoading, refreshWeather]);

  // Valor do contexto
  const contextValue: IntegratedContextType = {
    // Estado
    location,
    locationError,
    isLocationLoading,
    currentWeather,
    weatherForecast,
    weatherError,
    isWeatherLoading,
    isInitialized,
    lastUpdated,
    apiStatus,
    
    // Ações
    requestLocation,
    forceNativeGPS,
    clearLocation,
    checkLocationPermissions,
    refreshWeather,
    clearWeather,
    initializeComplete,
    clearAll,
    getLocationStatus,
    getWeatherStatus,
    isFullyLoaded
  };

  return (
    <IntegratedLocationWeatherContext.Provider value={contextValue}>
      {children}
    </IntegratedLocationWeatherContext.Provider>
  );
}

/**
 * Hook para usar o contexto integrado
 */
export function useIntegratedLocationWeather(): IntegratedContextType {
  const context = useContext(IntegratedLocationWeatherContext);
  if (context === undefined) {
    throw new Error('useIntegratedLocationWeather deve ser usado dentro de um IntegratedLocationWeatherProvider');
  }
  return context;
}

// Hooks especializados para casos específicos
export function useLocationOnly() {
  const { location, locationError, isLocationLoading, requestLocation, clearLocation, getLocationStatus } = useIntegratedLocationWeather();
  return { location, locationError, isLocationLoading, requestLocation, clearLocation, getLocationStatus };
}

export function useWeatherOnly() {
  const { currentWeather, weatherForecast, weatherError, isWeatherLoading, refreshWeather, clearWeather, getWeatherStatus } = useIntegratedLocationWeather();
  return { currentWeather, weatherForecast, weatherError, isWeatherLoading, refreshWeather, clearWeather, getWeatherStatus };
}

export function useLocationWeatherStatus() {
  const { isInitialized, isFullyLoaded, apiStatus, getLocationStatus, getWeatherStatus } = useIntegratedLocationWeather();
  return { isInitialized, isFullyLoaded, apiStatus, getLocationStatus, getWeatherStatus };
}

// Re-exportar utilitários do clima
export { weatherUtils };
