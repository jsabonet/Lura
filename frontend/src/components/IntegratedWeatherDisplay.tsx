/**
 * Componente Integrado de Localização e Clima
 * ==========================================
 * 
 * Este componente substitui completamente os componentes anteriores,
 * oferecendo uma interface moderna e completa para localização e clima.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useIntegratedLocationWeather, weatherUtils } from '@/contexts/IntegratedLocationWeatherContext';
import Image from 'next/image';

interface IntegratedWeatherDisplayProps {
  showDetailedForecast?: boolean;
  showLocationDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // em minutos
  className?: string;
}

export function IntegratedWeatherDisplay({ 
  showDetailedForecast = true,
  showLocationDetails = true,
  autoRefresh = true,
  refreshInterval = 30,
  className = ''
}: IntegratedWeatherDisplayProps) {
  
  const {
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
    refreshWeather,
    initializeComplete,
    clearAll,
    getLocationStatus,
    getWeatherStatus,
    isFullyLoaded
  } = useIntegratedLocationWeather();

  const [showAdvancedData, setShowAdvancedData] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<number>(0);

  /**
   * Atualização automática do clima
   */
  useEffect(() => {
    if (!autoRefresh || !isFullyLoaded()) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = lastUpdated ? now - lastUpdated : Infinity;
      const timeSinceLastAutoRefresh = now - lastAutoRefresh;
      
      // Atualiza se passou o intervalo e não houve atualização manual recente
      if (timeSinceLastUpdate > refreshInterval * 60 * 1000 && 
          timeSinceLastAutoRefresh > refreshInterval * 60 * 1000) {
        refreshWeather();
        setLastAutoRefresh(now);
      }
    }, 60000); // Verifica a cada minuto

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isFullyLoaded, lastUpdated, lastAutoRefresh, refreshWeather]);

  /**
   * Formata tempo desde a última atualização
   */
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `${minutes}min atrás`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  /**
   * Obtém cor baseada na temperatura
   */
  const getTemperatureColor = (temp: number): string => {
    if (temp < 10) return 'text-blue-600';
    if (temp < 20) return 'text-blue-400';
    if (temp < 25) return 'text-green-600';
    if (temp < 30) return 'text-yellow-600';
    if (temp < 35) return 'text-orange-600';
    return 'text-red-600';
  };

  /**
   * Obtém ícone de status
   */
  const getStatusIcon = (): string => {
    if (isLocationLoading || isWeatherLoading) return '⏳';
    if (locationError || weatherError) return '⚠️';
    if (isFullyLoaded()) return '✅';
    if (location && !currentWeather) return '🌐';
    return '📍';
  };

  // Estado de carregamento inicial
  if (!isInitialized) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600">Inicializando sistema...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header com status */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getStatusIcon()}</span>
            <div>
              <h3 className="text-lg font-semibold">AgroAlerta Clima</h3>
              <p className="text-blue-100 text-sm">Localização e clima integrados</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={refreshWeather}
              disabled={isWeatherLoading || !location}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
              title="Atualizar clima"
            >
              <span className={`text-lg ${isWeatherLoading ? 'animate-spin' : ''}`}>🔄</span>
            </button>
            
            <button
              onClick={clearAll}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Limpar dados"
            >
              <span className="text-lg">🗑️</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Localização */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              📍 Localização
            </h4>
            
            {!location && (
              <button
                onClick={requestLocation}
                disabled={isLocationLoading}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isLocationLoading ? 'Obtendo...' : 'Obter Localização'}
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Status:</p>
            <p className="font-medium">{getLocationStatus()}</p>
            
            {location && showLocationDetails && (
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Coordenadas:</span>
                  <div className="font-mono">{location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Precisão:</span>
                  <div>±{Math.round(location.coordinates.accuracy)}m</div>
                </div>
              </div>
            )}
          </div>

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <div>
                  <h5 className="font-medium text-red-800">Erro de Localização</h5>
                  <p className="text-sm text-red-700">{locationError.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clima Atual */}
        {currentWeather && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              🌤️ Clima Atual
            </h4>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="text-xl font-bold text-gray-800">
                    {currentWeather.location.name}
                  </h5>
                  <p className="text-gray-600 capitalize">
                    {currentWeather.current.condition.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getTemperatureColor(currentWeather.current.temperature)}`}>
                    {weatherUtils.formatTemperature(currentWeather.current.temperature)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Sensação: {weatherUtils.formatTemperature(currentWeather.current.feels_like)}
                  </div>
                </div>
              </div>

              {/* Ícone do clima */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <Image
                    src={weatherUtils.getWeatherIconUrl(currentWeather.current.condition.icon, '4x')}
                    alt={currentWeather.current.condition.description}
                    width={100}
                    height={100}
                    className="drop-shadow-md"
                    onError={(e) => {
                      // Fallback para emoji quando a imagem falha
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.weather-emoji')) {
                        const emoji = document.createElement('div');
                        emoji.className = 'weather-emoji text-8xl';
                        emoji.textContent = weatherUtils.getWeatherEmoji(currentWeather.current.condition.icon);
                        parent.appendChild(emoji);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Dados principais */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-sm text-gray-600">Umidade</div>
                  <div className="font-semibold">{currentWeather.current.humidity}%</div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl mb-1">💨</div>
                  <div className="text-sm text-gray-600">Vento</div>
                  <div className="font-semibold">
                    {weatherUtils.windSpeedToKmh(currentWeather.current.wind.speed)} km/h
                  </div>
                  <div className="text-xs text-gray-500">
                    {weatherUtils.windDirectionToText(currentWeather.current.wind.direction)}
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl mb-1">🧭</div>
                  <div className="text-sm text-gray-600">Pressão</div>
                  <div className="font-semibold">{currentWeather.current.pressure} hPa</div>
                </div>
              </div>

              {/* Dados avançados */}
              {showAdvancedData && (
                <div className="mt-4 pt-4 border-t border-white/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Visibilidade:</span>
                      <span className="ml-2 font-medium">{(currentWeather.current.visibility / 1000).toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Nascer do sol:</span>
                      <span className="ml-2 font-medium">
                        {new Date(currentWeather.current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pôr do sol:</span>
                      <span className="ml-2 font-medium">
                        {new Date(currentWeather.current.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Atualizado:</span>
                      <span className="ml-2 font-medium">
                        {lastUpdated ? formatTimeAgo(lastUpdated) : 'Nunca'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowAdvancedData(!showAdvancedData)}
                className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showAdvancedData ? 'Ocultar detalhes' : 'Mostrar detalhes'}
              </button>
            </div>
          </div>
        )}

        {/* Previsão */}
        {weatherForecast && showDetailedForecast && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              📅 Previsão 5 Dias
            </h4>

            <div className="space-y-3">
              {weatherForecast.forecast.slice(0, 5).map((day, index) => (
                <div key={day.date} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={weatherUtils.getWeatherIconUrl(day.condition.icon)}
                        alt={day.condition.description}
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="font-medium">
                          {index === 0 ? 'Hoje' : 
                           index === 1 ? 'Amanhã' : 
                           new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {day.condition.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">
                        <span className={getTemperatureColor(day.temperature.max)}>
                          {day.temperature.max}°
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-600">
                          {day.temperature.min}°
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        💧 {day.precipitation.probability}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Erro do clima */}
        {weatherError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <div>
                <h5 className="font-medium text-red-800">Erro nos Dados Climáticos</h5>
                <p className="text-sm text-red-700">{weatherError.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status das APIs */}
        <div className="border-t pt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Status do Sistema</h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${apiStatus.googleMaps ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Google Maps
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${apiStatus.openWeather ? 'bg-green-500' : 'bg-red-500'}`}></span>
              OpenWeather
            </div>
          </div>
        </div>

        {/* Link para Google Maps */}
        {location && (
          <div className="border-t pt-4">
            <a
              href={`https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              🗺️ Ver no Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
