/**
 * Dashboard Profissional de Dados Climáticos
 * =========================================
 * 
 * Componente com design moderno, responsivo e profissional
 * para exibição completa de dados climáticos.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useIntegratedLocationWeather, weatherUtils } from '@/contexts/IntegratedLocationWeatherContext';
import { useWeatherData } from '@/contexts/WeatherDataContext';
import Image from 'next/image';
import '@/styles/weather-dashboard.css';
import { 
  MapPinIcon, 
  CloudIcon, 
  SunIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

interface WeatherDashboardProps {
  className?: string;
}

export function WeatherDashboard({ className = '' }: WeatherDashboardProps) {
  const [showAdvancedData, setShowAdvancedData] = useState(false);
  
  const {
    location,
    locationError,
    isLocationLoading,
    currentWeather,
    weatherForecast,
    weatherError,
    isWeatherLoading,
    isInitialized,
    lastUpdated,
    requestLocation,
    forceNativeGPS,
    refreshWeather,
    getLocationStatus,
    getWeatherStatus,
  } = useIntegratedLocationWeather();

  // Context para dados externos (GPS/Regional)
  const { 
    weatherData: externalWeatherData, 
    isLoading: externalLoading, 
    error: externalError,
    dataSource 
  } = useWeatherData();

  // Usar dados externos se disponíveis, senão usar dados do contexto original
  const displayWeather = externalWeatherData || currentWeather;
  const displayForecast = externalWeatherData?.forecast || weatherForecast;
  const displayLocation = externalWeatherData?.location || location;
  const displayError = externalError || weatherError;
  const displayLoading = externalLoading || isWeatherLoading;

  const getTemperatureColor = (temp: number): string => {
    if (temp <= 10) return 'text-blue-600';
    if (temp <= 20) return 'text-green-600';
    if (temp <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isInitialized && !externalWeatherData) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-blue-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
            <div className="h-3 bg-blue-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Se houver erro e não tiver dados externos
  if (displayError && !displayWeather) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-red-800 dark:text-red-300">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span className="font-medium">Erro ao carregar dados climáticos</span>
          </div>
          <p className="text-red-600 dark:text-red-400 mt-2 text-sm">{displayError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`weather-dashboard ${className} space-y-6`}>
      {/* Header com Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animated-gradient p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 mb-2">
                <CloudIcon className="w-8 h-8 lg:w-10 lg:h-10" />
                Dados Climáticos Completos
              </h2>
              <p className="text-blue-100 text-sm lg:text-base">Sistema integrado Google Maps + OpenWeather</p>
            </div>
            
            {/* Controles */}
            <div className="flex items-center gap-2">
              <button
                onClick={refreshWeather}
                disabled={isWeatherLoading}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 disabled:opacity-50 status-indicator"
                title="Atualizar dados"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowAdvancedData(!showAdvancedData)}
                className={`p-3 rounded-xl transition-all duration-200 status-indicator ${
                  showAdvancedData 
                    ? 'bg-white/30 text-white' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title="Dados avançados"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Status das APIs */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-slow"></div>
              <span>Google Maps</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse-slow"></div>
              <span>OpenWeather API</span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-blue-200">
                Atualizado: {new Date(lastUpdated).toLocaleTimeString('pt-BR')}
              </div>
            )}
          </div>
        </div>

        {/* Aviso de Localização IP */}
        {(location as any)?.source === 'ip' && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
                  Localização aproximada detectada
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
                  Estamos usando sua localização IP ({(location as any)?.source === 'ip' ? '🌐 IP Location' : 'aproximada'}). 
                  Para dados climáticos mais precisos para sua região, use o GPS do seu dispositivo.
                </p>
                <button
                  onClick={() => forceNativeGPS()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  disabled={isLocationLoading}
                >
                  <MapPinIcon className="w-4 h-4" />
                  {isLocationLoading ? 'Obtendo GPS...' : 'Obter Localização Precisa'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="p-6">
          {/* Localização */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Localização
                {dataSource && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {dataSource === 'gps' ? '📍 GPS' : dataSource === 'regional' ? '🗺️ Regional' : '🌐 Padrão'}
                  </span>
                )}
              </h3>
              
              <div className="flex items-center gap-2">
                {(displayLocation ? false : (location as any)?.source === 'ip') && (
                  <button
                    onClick={() => forceNativeGPS()}
                    className="px-3 py-1 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
                    disabled={isLocationLoading}
                  >
                    <MapPinIcon className="w-3 h-3" />
                    Usar GPS Preciso
                  </button>
                )}
                
                {!displayLocation && !location && (
                  <button
                    onClick={requestLocation}
                    disabled={isLocationLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLocationLoading ? (
                      <div className="flex items-center gap-2">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Obtendo...
                      </div>
                    ) : (
                      'Obter Localização'
                    )}
                  </button>
                )}
                
                {(displayLocation || location) && !isLocationLoading && (
                  <button
                    onClick={() => requestLocation()}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <ArrowPathIcon className="w-3 h-3" />
                    Atualizar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <div className="flex items-center gap-2">
                  {(displayLoading || isLocationLoading) && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <ArrowPathIcon className="w-3 h-3 animate-spin" />
                      <span>{displayLoading ? 'Carregando dados climáticos...' : 'Obtendo localização...'}</span>
                    </div>
                  )}
                  <span className={`text-sm font-semibold ${
                    displayLocation || location ? 'text-green-600 dark:text-green-400' :
                    displayError || locationError ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {displayLocation ? 'Localização Ativa' : getLocationStatus()}
                  </span>
                </div>
              </div>
              
              {(displayLocation || location) && (
                <div className="space-y-3">
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {displayLocation ? displayLocation.name : location?.address?.formatted}
                  </div>
                  
                  {displayLocation && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataSource === 'gps' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        dataSource === 'regional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {dataSource === 'gps' ? '📍 Localização GPS Precisa' :
                         dataSource === 'regional' ? '🗺️ Região Selecionada' :
                         '🌐 Localização Padrão'}
                      </div>
                    </div>
                  )}

                  {!displayLocation && (location as any)?.source && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (location as any).source === 'google_geolocation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        (location as any).source === 'google_places' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        (location as any).source === 'ip' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {(location as any).source === 'google_geolocation' ? '📡 Google Geolocation' :
                         (location as any).source === 'google_places' ? '🌍 Google Places' :
                         (location as any).source === 'ip' ? '🌐 IP Location' :
                         '📍 Browser GPS'}
                      </div>
                      
                      {!displayLocation && (location as any)?.confidence && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (location as any).confidence >= 0.8 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' :
                          (location as any).confidence >= 0.6 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          (location as any).confidence >= 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          🎯 {Math.round((location as any).confidence * 100)}% precisão
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Latitude</div>
                      <div className="font-mono font-semibold">
                        {displayLocation ? displayLocation.lat.toFixed(6) : location?.coordinates.latitude.toFixed(6)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Longitude</div>
                      <div className="font-mono font-semibold">
                        {displayLocation ? displayLocation.lng.toFixed(6) : location?.coordinates.longitude.toFixed(6)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">País</div>
                      <div className="font-semibold">
                        {displayLocation ? displayLocation.country : 'Moçambique'}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Fonte</div>
                      <div className="font-semibold">
                        {displayLocation ? (dataSource === 'gps' ? 'GPS' : 'Regional') : 'Browser'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(displayError || locationError) && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300">
                      {displayError ? 'Erro nos Dados Climáticos' : 'Erro de Localização'}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      {displayError || locationError?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clima Atual */}
          {displayWeather && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <SunIcon className="w-5 h-5" />
                Condições Atuais
                {dataSource && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {dataSource === 'gps' ? '📍 GPS' : dataSource === 'regional' ? '🗺️ Regional' : '🌐 Padrão'}
                  </span>
                )}
              </h3>

              {/* Card Principal do Clima */}
              <div className="glass-card weather-card rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-6">
                  {/* Info Principal */}
                  <div className="text-center xl:text-left flex-1">
                    <h4 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {displayWeather.location.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 capitalize text-lg lg:text-xl mb-4">
                      {(displayWeather.current as any).description || (displayWeather.current as any).condition?.description || 'Condições atuais'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 lg:gap-6">
                      <div className={`text-5xl lg:text-6xl font-bold ${getTemperatureColor(displayWeather.current.temperature)}`}>
                        {Math.round(displayWeather.current.temperature)}°C
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        <div className="text-sm font-medium">Umidade</div>
                        <div className="text-lg lg:text-xl font-semibold">
                          {displayWeather.current.humidity}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ícone do Clima */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center">
                      <div className="weather-emoji text-8xl lg:text-9xl">
                        {(() => {
                          const description = (displayWeather.current as any).description || (displayWeather.current as any).condition?.description || '';
                          if (description.includes('chuva') || description.includes('rain')) return '🌧️';
                          if (description.includes('nuvem') || description.includes('cloud')) return '☁️';
                          if (description.includes('sol') || description.includes('clear')) return '☀️';
                          if (description.includes('névoa') || description.includes('mist')) return '🌫️';
                          return '🌤️';
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl lg:text-4xl mb-2">💧</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Umidade</div>
                    <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {displayWeather.current.humidity}%
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl lg:text-4xl mb-2">💨</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Vento</div>
                    <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(displayWeather.current.wind.speed * 3.6)} km/h
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {displayWeather.current.wind.direction}
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl lg:text-4xl mb-2">🧭</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Pressão</div>
                    <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {displayWeather.current.pressure} hPa
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl lg:text-4xl mb-2">☀️</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Índice UV</div>
                    <div className="text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {(displayWeather.current as any).uvIndex || (displayWeather.current as any).uv_index || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Dados Avançados */}
                {showAdvancedData && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Dados Avançados
                    </h5>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-3">
                        <span className="text-gray-600 dark:text-gray-400">Visibilidade:</span>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {displayWeather.current.visibility ? `${displayWeather.current.visibility / 1000} km` : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-3">
                        <span className="text-gray-600 dark:text-gray-400">Ponto de Orvalho:</span>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {/* currentWeather.current.dew_point ? weatherUtils.formatTemperature(currentWeather.current.dew_point) : */ 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-3">
                        <span className="text-gray-600 dark:text-gray-400">Nebulosidade:</span>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {/* currentWeather.current.clouds */ 'N/A'}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previsão do Tempo */}
          {displayForecast && displayForecast.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5" />
                Previsão dos Próximos Dias
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayForecast.slice(0, 5).map((forecast: any, index: number) => (
                  <div key={index} className="weather-card bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center shadow-md">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg py-1 px-2">
                      {new Date(forecast.date || forecast.datetime).toLocaleDateString('pt-BR', { 
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-full">
                      <div className="text-4xl">
                        {forecast.description?.includes('chuva') || forecast.description?.includes('rain') ? '🌧️' :
                         forecast.description?.includes('nuvem') || forecast.description?.includes('cloud') ? '☁️' :
                         forecast.description?.includes('sol') || forecast.description?.includes('clear') ? '☀️' :
                         '🌤️'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-2">
                        {forecast.description || 'Sem descrição'}
                      </div>
                      
                      <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-1">
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">Máx:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {Math.round(forecast.temperature?.max || forecast.temp_max || 0)}°C
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Mín:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {Math.round(forecast.temperature?.min || forecast.temp_min || 0)}°C
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-1">
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Chuva:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {Math.round(forecast.precipitation || 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Agrícolas */}
          {displayWeather && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🌾 Insights Agrícolas Personalizados
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Condições de Plantio */}
                <div className="weather-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                    🌱 Condições de Plantio
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">Umidade do Solo:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        currentWeather.current.humidity > 70 
                          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' 
                          : currentWeather.current.humidity > 40 
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                      }`}>
                        {currentWeather.current.humidity > 70 ? 'Ideal' : 
                         currentWeather.current.humidity > 40 ? 'Moderada' : 'Baixa'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">Temperatura:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        currentWeather.current.temperature >= 20 && currentWeather.current.temperature <= 30
                          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' 
                          : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                      }`}>
                        {currentWeather.current.temperature >= 20 && currentWeather.current.temperature <= 30 
                          ? 'Ideal' : 'Atenção'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">Vento:</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        currentWeather.current.wind.speed < 15
                          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' 
                          : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                      }`}>
                        {currentWeather.current.wind.speed < 15 ? 'Favorável' : 'Forte'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recomendações */}
                <div className="weather-card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                    💡 Recomendações
                  </h4>
                  
                  <div className="space-y-3">
                    {currentWeather.current.humidity < 40 && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <span className="text-yellow-600">⚠️</span>
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Irrigação Necessária</p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-400">Umidade baixa detectada. Considere irrigação.</p>
                        </div>
                      </div>
                    )}
                    
                    {currentWeather.current.wind.speed > 20 && (
                      <div className="flex items-start gap-2 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <span className="text-orange-600">🌪️</span>
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Vento Forte</p>
                          <p className="text-xs text-orange-700 dark:text-orange-400">Evite pulverizações. Proteja culturas sensíveis.</p>
                        </div>
                      </div>
                    )}
                    
                    {currentWeather.current.temperature > 35 && (
                      <div className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <span className="text-red-600">🌡️</span>
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">Temperatura Elevada</p>
                          <p className="text-xs text-red-700 dark:text-red-400">Monitore estresse hídrico nas plantas.</p>
                        </div>
                      </div>
                    )}
                    
                    {currentWeather.current.humidity > 70 && 
                     currentWeather.current.temperature >= 20 && 
                     currentWeather.current.temperature <= 30 && 
                     currentWeather.current.wind.speed < 15 && (
                      <div className="flex items-start gap-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <span className="text-green-600">✅</span>
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">Condições Ideais</p>
                          <p className="text-xs text-green-700 dark:text-green-400">Excelente momento para atividades agrícolas.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erro de Clima */}
          {weatherError && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-300">Erro nos Dados Climáticos</h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">{weatherError.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
