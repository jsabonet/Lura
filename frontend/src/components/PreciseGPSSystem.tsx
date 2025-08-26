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
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          🛰️ Sistema GPS Preciso
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Obtenha sua localização exata usando GPS de alta precisão
        </p>
      </div>

      {/* Botão para obter localização */}
      <div className="mb-6">
        <button
          onClick={getCurrentLocationPrecise}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isLoading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Obtendo localização precisa...
            </div>
          ) : (
            '📍 Obter Localização GPS Precisa'
          )}
        </button>
      </div>

      {/* Status da permissão */}
      {permissionStatus !== 'unknown' && (
        <div className={`mb-4 p-3 rounded-lg ${
          permissionStatus === 'granted' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : permissionStatus === 'denied'
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className="flex items-center">
            <span className="text-lg mr-2">
              {permissionStatus === 'granted' ? '✅' : permissionStatus === 'denied' ? '❌' : '⚠️'}
            </span>
            <span className={`font-medium ${
              permissionStatus === 'granted' 
                ? 'text-green-700 dark:text-green-300' 
                : permissionStatus === 'denied'
                ? 'text-red-700 dark:text-red-300'
                : 'text-yellow-700 dark:text-yellow-300'
            }`}>
              Permissão de localização: {
                permissionStatus === 'granted' ? 'Concedida' :
                permissionStatus === 'denied' ? 'Negada' : 'Pendente'
              }
            </span>
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

      {/* Dicas */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Dicas para Melhor Precisão:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ative o GPS e dados móveis/WiFi</li>
          <li>• Vá para um local aberto (evite locais fechados)</li>
          <li>• Aguarde alguns segundos para calibração</li>
          <li>• Permita acesso à localização quando solicitado</li>
        </ul>
      </div>
    </div>
  );
}
