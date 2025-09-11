'use client';

import React, { useState, useCallback } from 'react';
import { useWeatherData } from '@/contexts/WeatherDataContext';

interface GPSLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface PreciseGPSSystemProps {
  onLocationUpdate: (location: GPSLocationData) => void;
  onError: (error: string) => void;
}

export default function PreciseGPSSystem({ onLocationUpdate, onError }: PreciseGPSSystemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastLocation, setLastLocation] = useState<GPSLocationData | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');

  // Context para enviar dados para o dashboard principal
  const { 
    setWeatherData: setContextWeatherData, 
    setIsLoading: setContextLoading, 
    setError: setContextError,
    setDataSource 
  } = useWeatherData();

  // Função para buscar dados climáticos com base na localização GPS
  const fetchWeatherForLocation = async (location: GPSLocationData) => {
    setContextLoading(true);
    setContextError(null);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('API key não configurada');
      }

      // Obter clima atual
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric&lang=pt`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Erro ao obter dados climáticos');
      }
      
      const currentData = await currentResponse.json();
      
      // Obter previsão
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric&lang=pt`
      );
      
      const forecastData = await forecastResponse.json();
      
      // Processar previsão (próximos 5 dias)
      const dailyForecast = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString('pt-BR');
        if (!processedDates.has(date) && dailyForecast.length < 5) {
          dailyForecast.push({
            date,
            temperature: {
              max: Math.round(item.main.temp_max),
              min: Math.round(item.main.temp_min)
            },
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            precipitation: item.rain?.['3h'] || 0
          });
          processedDates.add(date);
        }
      }

      // Formato para o contexto global
      const contextWeatherData = {
        location: {
          name: location.address || 'Localização GPS',
          country: 'Moçambique',
          lat: location.latitude,
          lng: location.longitude
        },
        current: {
          temperature: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          wind: {
            speed: currentData.wind.speed,
            direction: currentData.wind.deg ? `${currentData.wind.deg}°` : 'N/A'
          },
          pressure: currentData.main.pressure,
          visibility: currentData.visibility || 10000,
          uvIndex: 0 // API básica não tem UV
        },
        forecast: dailyForecast
      };
      
      setContextWeatherData(contextWeatherData);
      setDataSource('gps');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados climáticos';
      setContextError(errorMessage);
    } finally {
      setContextLoading(false);
    }
  };

  // Função para obter localização com alta precisão usando apenas GPS nativo
  const getCurrentLocationPrecise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Verifica se geolocation está disponível
      if (!navigator.geolocation) {
        throw new Error('Geolocalização não suportada pelo navegador');
      }

      // Solicita permissão explicitamente
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        if (permission.state === 'denied') {
          throw new Error('Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador.');
        }
      }

      // Configurações para máxima precisão
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 30000, // 30 segundos
        maximumAge: 0 // Sempre obter nova localização
      };

      // Usar Promise para converter callback em async/await
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          options
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      const timestamp = position.timestamp;

      // Obter endereço usando Google Maps Geocoding API
      let address = '';
      try {
        const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (GOOGLE_MAPS_API_KEY) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR`
          );
          
          if (response.ok) {
            const geocodeData = await response.json();
            if (geocodeData.results && geocodeData.results.length > 0) {
              address = geocodeData.results[0].formatted_address;
            }
          }
        }
        
        if (!address) {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
      } catch (geoError) {
        console.warn('Não foi possível obter endereço via Google Maps:', geoError);
        address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      const locationData: GPSLocationData = {
        latitude,
        longitude,
        accuracy,
        timestamp,
        address
      };

      setLastLocation(locationData);
      onLocationUpdate(locationData);
      
      // Buscar dados climáticos para esta localização
      await fetchWeatherForLocation(locationData);
      
    } catch (error) {
      let errorMessage = 'Erro desconhecido ao obter localização';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível. Verifique se o GPS está ativado.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido ao obter localização. Tente novamente.';
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationUpdate, onError]);

  // Função para monitorar localização continuamente
  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      onError('Geolocalização não suportada');
      return null;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000 // Atualizar a cada 5 segundos
    };

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = position.timestamp;

        // Só atualiza se a precisão melhorou significativamente
        if (!lastLocation || accuracy < lastLocation.accuracy - 10) {
          // Obter endereço usando Google Maps Geocoding API
          let address = '';
          try {
            const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (GOOGLE_MAPS_API_KEY) {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR`
              );
              
              if (response.ok) {
                const geocodeData = await response.json();
                if (geocodeData.results && geocodeData.results.length > 0) {
                  address = geocodeData.results[0].formatted_address;
                }
              }
            }
            
            if (!address) {
              address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            }
          } catch (geoError) {
            console.warn('Não foi possível obter endereço via Google Maps:', geoError);
            address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          }

          const locationData: GPSLocationData = {
            latitude,
            longitude,
            accuracy,
            timestamp,
            address
          };

          setLastLocation(locationData);
          onLocationUpdate(locationData);
          
          // Buscar dados climáticos para esta localização
          await fetchWeatherForLocation(locationData);
        }
      },
      (error) => {
        console.error('Erro no monitoramento de localização:', error);
      },
      options
    );

    return watchId;
  }, [lastLocation, onLocationUpdate, onError]);

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return { text: 'Muito Alta', color: 'text-green-600', emoji: '🎯' };
    if (accuracy <= 10) return { text: 'Alta', color: 'text-green-500', emoji: '✅' };
    if (accuracy <= 50) return { text: 'Boa', color: 'text-yellow-500', emoji: '📍' };
    if (accuracy <= 100) return { text: 'Moderada', color: 'text-orange-500', emoji: '⚠️' };
    return { text: 'Baixa', color: 'text-red-500', emoji: '❌' };
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header com gradiente - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-xl sm:text-2xl">🛰️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 leading-tight">
              Sistema GPS Preciso
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base line-clamp-2">
              Localização de alta precisão com tecnologia GPS avançada
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              permissionStatus === 'granted' ? 'bg-green-300 animate-pulse' : 
              permissionStatus === 'denied' ? 'bg-red-300' : 'bg-yellow-300'
            }`}></div>
            <span className="text-xs text-blue-200">
              {permissionStatus === 'granted' ? 'GPS Autorizado' : 
               permissionStatus === 'denied' ? 'GPS Negado' : 'GPS Pendente'}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal - Mobile Optimized */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

        {/* Botão principal com design melhorado - Mobile Optimized */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
          <button
            onClick={getCurrentLocationPrecise}
            disabled={isLoading}
            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform text-sm sm:text-base ${
              isLoading
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed scale-95'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-3 border-gray-300 border-t-white"></div>
                  <div className="absolute inset-0 rounded-full h-4 w-4 sm:h-6 sm:w-6 border-3 border-transparent border-t-gray-100 animate-ping"></div>
                </div>
                <span className="hidden sm:inline">Obtendo localização precisa...</span>
                <span className="sm:hidden">Obtendo GPS...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-base sm:text-lg">📍</span>
                <span className="hidden sm:inline">Obter Localização GPS Precisa</span>
                <span className="sm:hidden">GPS Preciso</span>
              </div>
            )}
          </button>
        </div>

        {/* Status da permissão com design melhorado */}
        {permissionStatus !== 'unknown' && (
          <div className={`rounded-xl p-6 border ${
            permissionStatus === 'granted' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
              : permissionStatus === 'denied'
              ? 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'
              : 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                permissionStatus === 'granted' ? 'bg-green-100 dark:bg-green-800/50' :
                permissionStatus === 'denied' ? 'bg-red-100 dark:bg-red-800/50' :
                'bg-yellow-100 dark:bg-yellow-800/50'
              }`}>
                <span className="text-xl">
                  {permissionStatus === 'granted' ? '✅' : permissionStatus === 'denied' ? '❌' : '⚠️'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  permissionStatus === 'granted' 
                    ? 'text-green-900 dark:text-green-300' 
                    : permissionStatus === 'denied'
                    ? 'text-red-900 dark:text-red-300'
                    : 'text-yellow-900 dark:text-yellow-300'
                }`}>
                  Permissão de Localização: {
                    permissionStatus === 'granted' ? 'Concedida' :
                    permissionStatus === 'denied' ? 'Negada' : 'Pendente'
                  }
                </h4>
                <p className={`text-sm ${
                  permissionStatus === 'granted' 
                    ? 'text-green-700 dark:text-green-400' 
                    : permissionStatus === 'denied'
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-yellow-700 dark:text-yellow-400'
                }`}>
                  {permissionStatus === 'granted' 
                    ? 'GPS autorizado. Sistema pronto para obter localização precisa.'
                    : permissionStatus === 'denied'
                    ? 'Acesso negado. Verifique as configurações do navegador.'
                    : 'Aguardando permissão. Clique no botão acima para autorizar.'}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Informações da última localização */}
      {lastLocation && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800 dark:text-white">📊 Última Localização Obtida:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coordenadas */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">🌍 Coordenadas</div>
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200">
                <div>Lat: {lastLocation.latitude.toFixed(6)}</div>
                <div>Lng: {lastLocation.longitude.toFixed(6)}</div>
              </div>
            </div>

            {/* Precisão */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">🎯 Precisão</div>
              <div className="flex items-center">
                <span className="text-lg mr-1">
                  {getAccuracyText(lastLocation.accuracy).emoji}
                </span>
                <span className={`font-medium ${getAccuracyText(lastLocation.accuracy).color}`}>
                  ±{lastLocation.accuracy.toFixed(0)}m
                </span>
              </div>
              <div className={`text-xs ${getAccuracyText(lastLocation.accuracy).color}`}>
                {getAccuracyText(lastLocation.accuracy).text}
              </div>
            </div>

            {/* Endereço */}
            {lastLocation.address && (
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <div className="text-sm text-gray-600 mb-1">📍 Endereço</div>
                <div className="text-sm font-medium">{lastLocation.address}</div>
              </div>
            )}

            {/* Timestamp */}
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <div className="text-sm text-gray-600 mb-1">🕐 Última Atualização</div>
              <div className="text-sm">{formatTimestamp(lastLocation.timestamp)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Dicas com design melhorado */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-400 text-xl">💡</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
              Dicas para Melhor Precisão GPS
            </h4>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Ative o GPS e dados móveis/WiFi
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Vá para um local aberto (evite locais fechados)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Aguarde alguns segundos para calibração
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Permita acesso à localização quando solicitado
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
