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
  generateWeatherInsights,
  getInsightTheme,
  type AgricultureInsight
} from '@/utils/agriculturalInsights';
import { 
  generateSeasonalWeatherInsights as generateProfessionalInsights,
  generateAdvancedCropRecommendations
} from '@/utils/advancedAgriculturalInsights';
import CropSelector from './CropSelectorNew';
import { alertsService } from '@/services/alerts';
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
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertContext, setAlertContext] = useState<{ cultura: string; regiao: string; lat?: number; lng?: number } | null>(null);
  const [activationMsg, setActivationMsg] = useState<string | null>(null);
  
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
  const displayError = externalError || (weatherError ? weatherError.message : null);
  const displayLoading = externalLoading || isWeatherLoading;

  const getTemperatureColor = (temp: number): string => {
    if (temp <= 10) return 'text-blue-600';
    if (temp <= 20) return 'text-green-600';
    if (temp <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleActivateAlert = async (cultura: string, regiao: string, lat?: number, lng?: number) => {
    try {
      // Verificar se já existe assinatura para cultura/região
      const subs = await alertsService.list().catch(() => []);
      const exists = Array.isArray(subs) && subs.find((s: any) => s.cultura === cultura && s.regiao === regiao);
      if (exists) {
        await alertsService.createOrUpdate({
          cultura,
          regiao,
          latitude: lat,
          longitude: lng,
          canal: exists.canal,
          ativo: true,
          metadados: { origem: 'weather-dashboard', reativado: true },
        } as any);
        setActivationMsg('✅ Alerta já configurado foi reativado.');
        setTimeout(() => setActivationMsg(null), 2500);
        return;
      }

      // Abrir modal para configurar pela primeira vez
      setAlertContext({ cultura, regiao, lat, lng });
      setAlertModalOpen(true);
    } catch (e) {
      console.error('Falha ao ativar alerta:', e);
      setAlertContext({ cultura, regiao, lat, lng });
      setAlertModalOpen(true);
    }
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
      {activationMsg && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-lg p-3 text-sm">
            {activationMsg}
          </div>
        </div>
      )}
      {/* Header com Status - Mobile Optimized */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animated-gradient p-4 sm:p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3 mb-2">
                <CloudIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                <span className="leading-tight">Dados Climáticos Completos</span>
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm lg:text-base">Sistema integrado Google Maps + OpenWeather</p>
            </div>
            
            {/* Controles - Mobile Optimized */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={refreshWeather}
                disabled={isWeatherLoading}
                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 status-indicator"
                title="Atualizar dados"
              >
                <ArrowPathIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowAdvancedData(!showAdvancedData)}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 status-indicator ${
                  showAdvancedData 
                    ? 'bg-white/30 text-white' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title="Dados avançados"
              >
                <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {/* Status das APIs - Mobile Optimized */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 mt-3 sm:mt-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-slow"></div>
              <span>Google Maps</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse-slow"></div>
              <span>OpenWeather API</span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-blue-200 w-full sm:w-auto mt-1 sm:mt-0">
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

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                <div className="flex items-center gap-2">
                  {(displayLoading || isLocationLoading) && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <ArrowPathIcon className="w-3 h-3 animate-spin" />
                      <span className="hidden sm:inline">{displayLoading ? 'Carregando dados climáticos...' : 'Obtendo localização...'}</span>
                      <span className="sm:hidden">{displayLoading ? 'Carregando...' : 'GPS...'}</span>
                    </div>
                  )}
                  <span className={`text-xs sm:text-sm font-semibold ${
                    displayLocation || location ? 'text-green-600 dark:text-green-400' :
                    displayError || locationError ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {displayLocation ? 'Localização Ativa' : getLocationStatus()}
                  </span>
                </div>
              </div>
              
              {(displayLocation || location) && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                    {displayLocation ? 
                      ('name' in displayLocation ? displayLocation.name : (displayLocation as any).address?.formatted) : 
                      'Localização disponível'
                    }
                  </div>
                  
                  {displayLocation && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataSource === 'gps' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        dataSource === 'regional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        <span className="hidden sm:inline">
                          {dataSource === 'gps' ? '📍 Localização GPS Precisa' :
                           dataSource === 'regional' ? '🗺️ Região Selecionada' :
                           '🌐 Localização Padrão'}
                        </span>
                        <span className="sm:hidden">
                          {dataSource === 'gps' ? '📍 GPS' :
                           dataSource === 'regional' ? '🗺️ Região' :
                           '🌐 Padrão'}
                        </span>
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs">
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-2 sm:p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Latitude</div>
                      <div className="font-mono font-semibold text-xs sm:text-sm">
                        {displayLocation ? 
                          ('lat' in displayLocation ? displayLocation.lat.toFixed(6) : (displayLocation as any).coordinates?.latitude?.toFixed(6)) : 
                          (location as any)?.coordinates?.latitude?.toFixed(6)
                        }
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-2 sm:p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Longitude</div>
                      <div className="font-mono font-semibold text-xs sm:text-sm">
                        {displayLocation ? 
                          ('lng' in displayLocation ? displayLocation.lng.toFixed(6) : (displayLocation as any).coordinates?.longitude?.toFixed(6)) : 
                          (location as any)?.coordinates?.longitude?.toFixed(6)
                        }
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-2 sm:p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">País</div>
                      <div className="font-semibold text-xs sm:text-sm">
                        {displayLocation ? 
                          ('country' in displayLocation ? displayLocation.country : 'Moçambique') : 
                          'Moçambique'
                        }
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-2 sm:p-3">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Fonte</div>
                      <div className="font-semibold text-xs sm:text-sm">
                        {displayLocation ? (dataSource === 'gps' ? 'GPS' : 'Regional') : 'Browser'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(displayError || locationError) && (
              <div className="mt-3 sm:mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300 text-sm sm:text-base">
                      {displayError ? 'Erro nos Dados Climáticos' : 'Erro de Localização'}
                    </h4>
                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 mt-1">
                      {displayError || locationError?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clima Atual - Mobile Optimized */}
          {displayWeather && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Condições Atuais</span>
                </div>
                {dataSource && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {dataSource === 'gps' ? '📍 GPS' : dataSource === 'regional' ? '🗺️ Regional' : '🌐 Padrão'}
                  </span>
                )}
              </h3>

              {/* Card Principal do Clima - Mobile Optimized */}
              <div className="glass-card weather-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-4 sm:gap-6">
                  {/* Info Principal - Mobile Optimized */}
                  <div className="text-center xl:text-left flex-1">
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {displayWeather.location.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 capitalize text-base sm:text-lg lg:text-xl mb-3 sm:mb-4">
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

                {/* Métricas Principais - Mobile Optimized */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">💧</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Umidade</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {displayWeather.current.humidity}%
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">💨</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Vento</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(displayWeather.current.wind.speed * 3.6)} km/h
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                      {displayWeather.current.wind.direction}
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">🧭</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Pressão</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {displayWeather.current.pressure} hPa
                    </div>
                  </div>
                  
                  <div className="weather-card bg-white/70 dark:bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">☀️</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Índice UV</div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {(displayWeather.current as any).uvIndex || (displayWeather.current as any).uv_index || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Dados Avançados - Mobile Optimized */}
                {showAdvancedData && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
                      Dados Avançados
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-2 sm:p-3">
                        <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Visibilidade:</span>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {displayWeather.current.visibility ? `${displayWeather.current.visibility / 1000} km` : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-2 sm:p-3">
                        <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Ponto de Orvalho:</span>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {/* currentWeather?.current?.dew_point ? weatherUtils.formatTemperature(currentWeather?.current?.dew_point) : */ 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-gray-600/30 rounded-lg p-2 sm:p-3">
                        <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Nebulosidade:</span>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {/* currentWeather?.current?.clouds */ 'N/A'}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previsão do Tempo - Mobile Optimized */}
          {displayForecast && Array.isArray(displayForecast) && displayForecast.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <CloudArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Previsão dos Próximos 7 Dias</span>
                </div>
                {dataSource === 'regional' && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                    <span className="hidden sm:inline">📍 Dados Regionais Específicos</span>
                    <span className="sm:hidden">📍 Regional</span>
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
                {Array.isArray(displayForecast) ? displayForecast.slice(0, 7).map((forecast: any, index: number) => (
                  <div key={index} className="weather-card bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 text-center shadow-md">
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg py-1 px-1 sm:px-2">
                      {forecast.datetime ? 
                        new Date(forecast.datetime).toLocaleDateString('pt-BR', { 
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        }) : 
                        forecast.date || 'Data inválida'
                      }
                    </div>
                    
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-full">
                      <div className="text-3xl sm:text-4xl">
                        {(() => {
                          const description = forecast.description?.toLowerCase() || '';
                          const icon = forecast.icon || '';
                          
                          // Mapear baseado no código do ícone do OpenWeather e descrição
                          if (icon.includes('01d')) return '☀️';  // clear sky day
                          if (icon.includes('01n')) return '🌙';  // clear sky night
                          if (icon.includes('02d')) return '⛅';  // few clouds day
                          if (icon.includes('02n')) return '☁️';  // few clouds night
                          if (icon.includes('03') || icon.includes('04')) return '☁️';  // scattered/broken clouds
                          if (icon.includes('09')) return '🌦️';  // shower rain
                          if (icon.includes('10d')) return '🌦️';  // rain day
                          if (icon.includes('10n')) return '🌧️';  // rain night
                          if (icon.includes('11')) return '⛈️';  // thunderstorm
                          if (icon.includes('13')) return '🌨️';  // snow
                          if (icon.includes('50')) return '🌫️';  // mist/fog
                          
                          // Fallback baseado na descrição
                          if (description.includes('trovoada') || description.includes('thunder')) return '⛈️';
                          if (description.includes('chuva forte') || description.includes('heavy rain')) return '🌧️';
                          if (description.includes('chuva') || description.includes('rain') || description.includes('chuvisco')) return '🌦️';
                          if (description.includes('neve') || description.includes('snow')) return '🌨️';
                          if (description.includes('névoa') || description.includes('mist') || description.includes('fog')) return '🌫️';
                          if (description.includes('nublado') || description.includes('nuvem') || description.includes('cloud')) return '☁️';
                          if (description.includes('parcialmente nublado') || description.includes('partly cloudy')) return '⛅';
                          if (description.includes('limpo') || description.includes('clear') || description.includes('sol')) return '☀️';
                          
                          return '🌤️'; // default partly sunny
                        })()}
                      </div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1 sm:mb-2 line-clamp-1">
                        {forecast.description || 'Sem descrição'}
                      </div>
                      
                      <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">Máx:</span>
                        <span className="font-bold text-red-600 dark:text-red-400 text-xs sm:text-sm">
                          {Math.round(forecast.temperature?.max || forecast.temp_max || 0)}°C
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Mín:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                          {Math.round(forecast.temperature?.min || forecast.temp_min || 0)}°C
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                        <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Chuva:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                          {Math.round(forecast.precipitation || 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )) : null}
              </div>
            </div>
          )}

          {/* Seletor de Culturas */}
          {displayWeather && (
            <div className="mt-8">
              <CropSelector
                selectedCrops={selectedCrops}
                onCropSelect={setSelectedCrops}
                currentRegion={(displayLocation as any)?.name}
                className="mb-8"
                userProfile="beginner"
              />
            </div>
          )}

          {/* Insights Agrícolas Personalizados - Mobile Optimized */}
          {displayWeather && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="flex items-center gap-2">
                  🌾 Insights Agrícolas Personalizados
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCrops.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                      🎯 {selectedCrops.length} cultura{selectedCrops.length > 1 ? 's' : ''} selecionada{selectedCrops.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {dataSource === 'regional' && (
                    <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full">
                      <span className="hidden sm:inline">📍 Específico para {(displayLocation as any)?.name || 'Região'}</span>
                      <span className="sm:hidden">📍 Região</span>
                    </span>
                  )}
                  {dataSource === 'gps' && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                      <span className="hidden sm:inline">🛰️ Baseado em localização GPS</span>
                      <span className="sm:hidden">🛰️ GPS</span>
                    </span>
                  )}
                </div>
              </h3>
              {(() => {
                // Usar o sistema profissional de análise se há culturas selecionadas
                if (selectedCrops.length > 0) {
                  const professionalInsights = generateProfessionalInsights(
                    {
                      temperature: displayWeather.current.temperature,
                      humidity: displayWeather.current.humidity,
                      precipitation: 0, // Será expandido com dados reais de precipitação
                      windSpeed: displayWeather.current.wind.speed,
                      region: (displayLocation as any)?.name
                    },
                    selectedCrops
                  );

                  if (professionalInsights.length === 0) {
                    return (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">✅</span>
                        </div>
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                          Condições Ideais Detectadas
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          As condições climáticas atuais estão excelentes para suas culturas selecionadas. Continue com o manejo planejado!
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {/* Análise Profissional Multidimensional */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                            <span className="text-blue-600 dark:text-blue-400 text-xl">🎯</span>
                          </div>
                          <h4 className="font-bold text-blue-900 dark:text-blue-300">
                            Análise Profissional Multidimensional
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {professionalInsights.map((insight: string, index: number) => {
                            const isHighPriority = insight.includes('🔴') || insight.includes('⚠️');
                            const isPositive = insight.includes('✅') || insight.includes('✨');
                            
                            return (
                              <div
                                key={index}
                                className={`p-3 sm:p-4 rounded-lg border ${
                                  isHighPriority 
                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                    : isPositive 
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                              >
                                <p className={`text-xs sm:text-sm font-medium ${
                                  isHighPriority 
                                    ? 'text-red-800 dark:text-red-300'
                                    : isPositive 
                                    ? 'text-green-800 dark:text-green-300'
                                    : 'text-gray-800 dark:text-gray-300'
                                }`}>
                                  {insight}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recomendações Detalhadas */}
                      {(() => {
                        const recommendations = generateAdvancedCropRecommendations(
                          selectedCrops,
                          {
                            temperature: displayWeather.current.temperature,
                            humidity: displayWeather.current.humidity,
                            precipitation: 0, // Será expandido com dados reais de precipitação
                            windSpeed: displayWeather.current.wind.speed,
                            region: (displayLocation as any)?.name
                          }
                        );

                        return (
                          <div className="space-y-4">
                            {recommendations.map((rec) => (
                              <div
                                key={rec.cropId}
                                className={`border rounded-lg sm:rounded-xl p-4 sm:p-6 ${
                                  rec.viabilityLevel === 'alta' 
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                    : rec.viabilityLevel === 'média'
                                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                                    : rec.viabilityLevel === 'baixa'
                                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                                  <h5 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <span>🌱</span>
                                    {rec.cropName}
                                  </h5>
                                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                      rec.viabilityLevel === 'alta' 
                                        ? 'bg-green-600 text-white'
                                        : rec.viabilityLevel === 'média'
                                        ? 'bg-yellow-600 text-white'
                                        : rec.viabilityLevel === 'baixa'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-red-600 text-white'
                                    }`}>
                                      <span className="hidden sm:inline">
                                        {rec.viabilityLevel === 'alta' ? 'Alta Viabilidade' :
                                         rec.viabilityLevel === 'média' ? 'Viabilidade Média' :
                                         rec.viabilityLevel === 'baixa' ? 'Baixa Viabilidade' :
                                         'Não Recomendada'}
                                      </span>
                                      <span className="sm:hidden">
                                        {rec.viabilityLevel === 'alta' ? 'Alta' :
                                         rec.viabilityLevel === 'média' ? 'Média' :
                                         rec.viabilityLevel === 'baixa' ? 'Baixa' :
                                         'Não Rec.'}
                                      </span>
                                    </span>
                                    <span className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300">
                                      {rec.overallScore}%
                                    </span>
                                  </div>
                                </div>

                                {/* Scores por dimensão - Mobile Optimized */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  <div className="text-center">
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Clima</div>
                                    <div className={`font-bold text-sm sm:text-base ${rec.scores.climate >= 80 ? 'text-green-600' : rec.scores.climate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {rec.scores.climate}%
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Solo</div>
                                    <div className={`font-bold text-sm sm:text-base ${rec.scores.soil >= 80 ? 'text-green-600' : rec.scores.soil >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {rec.scores.soil}%
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Econômico</div>
                                    <div className={`font-bold text-sm sm:text-base ${rec.scores.economic >= 80 ? 'text-green-600' : rec.scores.economic >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {rec.scores.economic}%
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Risco</div>
                                    <div className={`font-bold text-sm sm:text-base ${rec.scores.risk >= 80 ? 'text-green-600' : rec.scores.risk >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {rec.scores.risk}%
                                    </div>
                                  </div>
                                </div>

                                {/* Análise detalhada - Mobile Optimized */}
                                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                                  {rec.analysis.strengths.length > 0 && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/50">
                                      <h6 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-1 text-sm sm:text-base">
                                        <span className="w-5 h-5 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center text-xs">✅</span>
                                        <span>Pontos Fortes</span>
                                      </h6>
                                      <div className="space-y-1.5">
                                        {rec.analysis.strengths.map((strength, idx) => (
                                          <div key={idx} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{strength}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {rec.analysis.challenges.length > 0 && (
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/50">
                                      <h6 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-1 text-sm sm:text-base">
                                        <span className="w-5 h-5 bg-orange-100 dark:bg-orange-800/30 rounded-full flex items-center justify-center text-xs">⚠️</span>
                                        <span>Desafios</span>
                                      </h6>
                                      <div className="space-y-1.5">
                                        {rec.analysis.challenges.map((challenge, idx) => (
                                          <div key={idx} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{challenge}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Botão de ação ficará após os retornos (dados econômicos) */}

                                {/* Recomendações específicas - Mobile Optimized */}
                                {rec.analysis.recommendations.length > 0 && (
                                  <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                    <h6 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2 text-sm sm:text-base">
                                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                                        <span className="text-sm">💡</span>
                                      </div>
                                      <span>Recomendações</span>
                                    </h6>
                                    <div className="space-y-2 sm:space-y-1.5">
                                      {rec.analysis.recommendations.map((recommendation, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                                          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-relaxed flex-1">
                                            {recommendation}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Dados econômicos - Mobile Optimized */}
                                <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <h6 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center">
                                      <span className="text-xs">💰</span>
                                    </div>
                                    <span>Análise Econômica</span>
                                  </h6>
                                  
                                  {/* Investimento e Retorno - Mobile Friendly */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                                    <div className="p-2.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Investimento estimado</div>
                                      <div className="font-bold text-sm text-gray-900 dark:text-white">{rec.economics.estimatedInvestment}</div>
                                    </div>
                                    <div className="p-2.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Retorno esperado</div>
                                      <div className="font-bold text-sm text-gray-900 dark:text-white">{rec.economics.expectedReturn}</div>
                                    </div>
                                  </div>
                                  
                                  {/* Métricas Adicionais - Mobile Friendly */}
                                  {rec.economics.expectedProfit && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                      <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">Lucro esperado</div>
                                        <div className="font-bold text-sm text-green-700 dark:text-green-300">{rec.economics.expectedProfit}</div>
                                      </div>
                                      <div className="p-2.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">Margem de lucro</div>
                                        <div className="font-bold text-sm text-gray-900 dark:text-white">{rec.economics.profitMargin}</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Indicadores de Confiança - Mobile Optimized */}
                                  {rec.economics.confidenceLevel && (
                                    <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                      <h6 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2 text-sm flex items-center gap-2">
                                        <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-800/30 rounded-full flex items-center justify-center">
                                          <span className="text-xs">📊</span>
                                        </div>
                                        <span>Confiabilidade</span>
                                      </h6>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div className="flex items-center justify-between p-2 bg-white dark:bg-indigo-900/30 rounded">
                                          <span className="text-xs text-indigo-600 dark:text-indigo-400">Confiança:</span>
                                          <span className="font-semibold text-xs text-indigo-700 dark:text-indigo-300">{rec.economics.confidenceLevel}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-white dark:bg-indigo-900/30 rounded">
                                          <span className="text-xs text-indigo-600 dark:text-indigo-400">Retorno c/ risco:</span>
                                          <span className="font-semibold text-xs text-indigo-700 dark:text-indigo-300">{rec.economics.riskAdjustedReturn}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Ação: canto inferior direito da seção Análise detalhada, após os retornos - Mobile Optimized */}
                                <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
                                  <button
                                    onClick={() => {
                                      const cultura = rec.cropName?.toLowerCase() || 'milho';
                                      const regiao = (displayLocation as any)?.name || (displayLocation as any)?.address?.formatted || 'Moçambique';
                                      const lat = (displayLocation as any)?.lat || (displayLocation as any)?.coordinates?.latitude;
                                      const lng = (displayLocation as any)?.lng || (displayLocation as any)?.coordinates?.longitude;
                                      handleActivateAlert(cultura, regiao, lat, lng);
                                    }}
                                    className="px-2 sm:px-3 py-1 sm:py-2 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 whitespace-nowrap"
                                    title="Ativar alerta para esta cultura e região"
                                  >
                                    🔔 <span className="hidden sm:inline">Ativar </span>Alerta
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );
                }

                // Fallback para o sistema original se não há culturas selecionadas
                const insights = generateWeatherInsights(
                  {
                    temperature: displayWeather.current.temperature,
                    humidity: displayWeather.current.humidity,
                    wind: {
                      speed: displayWeather.current.wind.speed,
                      direction: typeof displayWeather.current.wind.direction === 'string'
                        ? displayWeather.current.wind.direction
                        : String(displayWeather.current.wind.direction)
                    },
                    pressure: displayWeather.current.pressure,
                    uvIndex: (displayWeather.current as any).uvIndex,
                    description: (displayWeather.current as any).description || ''
                  },
                  {
                    name: (displayLocation as any)?.name || 'Moçambique',
                    lat: (displayLocation as any)?.lat || -25.9653,
                    lng: (displayLocation as any)?.lng || 32.5892
                  },
                  displayForecast as any,
                  selectedCrops.length > 0 ? selectedCrops : undefined
                );
                if (!insights || insights.length === 0) {
                  return (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🌱</span>
                      </div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                        {selectedCrops.length === 0 
                          ? 'Selecione suas culturas para recomendações personalizadas'
                          : 'Condições favoráveis - sem alertas específicos'
                        }
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        {selectedCrops.length === 0 
                          ? 'Use o seletor acima para escolher suas culturas e receber insights específicos para cada uma.'
                          : 'As condições climáticas atuais estão adequadas para suas culturas selecionadas. Continue monitorando!'
                        }
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {insights.map((insight: AgricultureInsight) => {
                      const theme = getInsightTheme(insight.type);
                      return (
                        <div 
                          key={insight.id}
                          className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-lg sm:rounded-xl p-4 sm:p-6 relative overflow-hidden`}
                        >
                          {/* Badge de prioridade - Mobile Optimized */}
                          {insight.priority === 'high' && (
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Urgente
                              </span>
                            </div>
                          )}
                          
                          {/* Badge de severidade crítica - Mobile Optimized */}
                          {insight.severity === 'critical' && (
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-600 text-white animate-pulse">
                                ⚠️ <span className="hidden sm:inline">Crítico</span>
                              </span>
                            </div>
                          )}
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            {/* Ícone - Mobile Optimized */}
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <span className="text-lg sm:text-xl">{insight.icon}</span>
                            </div>
                            {/* Conteúdo - Mobile Optimized */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold mb-2 ${theme.text} text-sm sm:text-base leading-tight`}>
                                {insight.title}
                              </h4>
                              <p className={`text-xs sm:text-sm ${theme.subtext} mb-3 leading-relaxed`}>
                                {insight.description}
                              </p>
                              {/* Culturas afetadas - Mobile Optimized */}
                              {insight.crops && insight.crops.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Culturas afetadas:</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {insight.crops.slice(0, 3).map((crop, index) => (
                                      <span 
                                        key={index}
                                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/70 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700 ${theme.text}`}
                                      >
                                        🌱 {crop}
                                      </span>
                                    ))}
                                    {insight.crops.length > 3 && (
                                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${theme.subtext} bg-white/50 dark:bg-gray-800/40`}>
                                        +{insight.crops.length - 3} mais
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* Categoria e timeline - Mobile Optimized */}
                              <div className="flex flex-col gap-3">
                                {/* Categoria */}
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs uppercase font-bold tracking-wide ${theme.subtext} px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-md border border-white/30 dark:border-gray-700/50`}>
                                    {insight.category === 'planting' && '🌱 Plantio'}
                                    {insight.category === 'irrigation' && '💧 Irrigação'}
                                    {insight.category === 'protection' && '🛡️ Proteção'}
                                    {insight.category === 'harvest' && '🌾 Colheita'}
                                    {insight.category === 'pest' && '🐛 Pragas'}
                                    {insight.category === 'general' && '📋 Geral'}
                                    {insight.category === 'compatibility' && '🎯 Adequação'}
                                  </span>
                                </div>
                                
                                {/* Actions Row */}
                                <div className="flex flex-wrap items-center gap-2 justify-between">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {insight.timeline && (
                                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 px-2 py-1 rounded-lg border border-white/40 dark:border-gray-700">
                                        ⏱️ {insight.timeline}
                                      </span>
                                    )}
                                    {insight.actionable && (
                                      <span className="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100/80 dark:bg-green-900/30 px-2 py-1 rounded-lg border border-green-200 dark:border-green-800">
                                        <span className="hidden sm:inline">✓ Ação Requerida</span>
                                        <span className="sm:hidden">✓ Ação</span>
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Alert Button */}
                                  <button
                                    onClick={() => {
                                      const cultura = (insight.crops && insight.crops[0]) || (selectedCrops[0] || 'milho');
                                      const regiao = (displayLocation as any)?.name || (displayLocation as any)?.address?.formatted || 'Moçambique';
                                      const lat = (displayLocation as any)?.lat || (displayLocation as any)?.coordinates?.latitude;
                                      const lng = (displayLocation as any)?.lng || (displayLocation as any)?.coordinates?.longitude;
                                      handleActivateAlert(cultura, regiao, lat, lng);
                                    }}
                                    className="text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
                                  >
                                    🔔 <span className="hidden sm:inline">Ativar </span>Alerta
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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

      {/* Modal de ativação */}
      {alertModalOpen && alertContext && (
        <AlertActivationModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          cultura={alertContext.cultura}
          regiao={alertContext.regiao}
          latitude={alertContext.lat}
          longitude={alertContext.lng}
        />
      )}
    </div>
  );
}

// Modal de ativação (lazy import simples)
import dynamic from 'next/dynamic';
const AlertActivationModal = dynamic(() => import('@/components/alerts/AlertActivationModal'), { ssr: false });

// Render modal
export function WeatherDashboardWithModal(props: WeatherDashboardProps) {
  // Delegate to original and rely on its internal state for modal rendering
  return <WeatherDashboard {...props} />;
}

