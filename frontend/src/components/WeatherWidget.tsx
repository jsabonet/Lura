'use client';

import { useIntegratedLocationWeather } from '@/contexts/IntegratedLocationWeatherContext';
import Link from 'next/link';
import { useEffect } from 'react';

interface WeatherWidgetProps {
  compact?: boolean;
  showForecast?: boolean;
}

export default function WeatherWidget({ compact = true, showForecast = false }: WeatherWidgetProps) {
  const { 
    location, 
    currentWeather, 
    weatherForecast,
    isInitialized,
    requestLocation,
    refreshWeather,
    apiStatus
  } = useIntegratedLocationWeather();

  useEffect(() => {
    // Auto-request location se não estiver inicializado
    if (!isInitialized && !location) {
      const timer = setTimeout(() => {
        requestLocation().catch(console.error);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, location, requestLocation]);

  if (compact) {
    return (
      <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 flex items-center space-x-2">
            <span>🌤️</span>
            <span>Clima</span>
          </h3>
          
          {/* API Status Indicators */}
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.googleMaps ? 'bg-green-500' : 'bg-gray-400'}`} title="Google Maps"></div>
            <div className={`w-2 h-2 rounded-full ${apiStatus.openWeather ? 'bg-blue-500' : 'bg-gray-400'}`} title="OpenWeather"></div>
          </div>
        </div>

        {currentWeather && location ? (
          <div className="space-y-4">
            {/* Location */}
            <div className="text-sm text-green-600 dark:text-green-300">
              📍 {location.address.city || location.address.formatted}
            </div>

            {/* Current Weather */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(currentWeather.current.temperature)}°C
                </div>
                <div className="text-sm text-green-500 dark:text-green-300 capitalize">
                  {currentWeather.current.condition.description}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-green-700 dark:text-green-200">
                  <span>💧 Humidade:</span>
                  <span>{currentWeather.current.humidity}%</span>
                </div>
                <div className="flex justify-between text-green-700 dark:text-green-200">
                  <span>💨 Vento:</span>
                  <span>{Math.round(currentWeather.current.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="flex justify-between text-green-700 dark:text-green-200">
                  <span>🌡️ Sensação:</span>
                  <span>{Math.round(currentWeather.current.feels_like)}°C</span>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-green-50 dark:bg-green-700/50 rounded-lg p-3">
              <h4 className="font-medium text-green-800 dark:text-green-200 text-sm mb-2">
                🌾 Status Agrícola
              </h4>
              <div className="text-xs text-green-700 dark:text-green-300">
                {currentWeather.current.temperature > 30 
                  ? '🔥 Temperatura alta - aumente rega'
                  : currentWeather.current.temperature < 10
                  ? '❄️ Temperatura baixa - proteja culturas'
                  : '✅ Condições ideais para crescimento'
                }
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={refreshWeather}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                🔄 Atualizar
              </button>
              <Link
                href="/clima-novo"
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
              >
                📊 Detalhes
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {!location ? (
              <div className="space-y-4">
                <div className="text-green-600 dark:text-green-300">
                  📍 Localização necessária
                </div>
                <button
                  onClick={requestLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Obter Localização
                </button>
              </div>
            ) : (
              <div className="text-green-600 dark:text-green-300">
                🔄 Carregando dados climáticos...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full widget mode
  return (
    <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-green-800 dark:text-green-100 flex items-center space-x-2">
          <span>🌤️</span>
          <span>Clima Detalhado</span>
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* API Status */}
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${apiStatus.googleMaps ? 'bg-green-500' : 'bg-gray-400'}`} title="Google Maps"></div>
            <div className={`w-3 h-3 rounded-full ${apiStatus.openWeather ? 'bg-blue-500' : 'bg-gray-400'}`} title="OpenWeather"></div>
          </div>
          
          <Link
            href="/clima-novo"
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Ver Completo
          </Link>
        </div>
      </div>

      {currentWeather && location ? (
        <div className="space-y-6">
          {/* Location Info */}
          <div className="bg-green-50 dark:bg-green-700/50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">📍 Localização</h4>
            <p className="text-green-700 dark:text-green-300 text-sm">
              {location.address.formatted}
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs mt-1">
              {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
            </p>
          </div>

          {/* Current Weather Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl mb-2">🌡️</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(currentWeather.current.temperature)}°C
              </div>
              <div className="text-sm text-orange-500 dark:text-orange-300">
                Sensação {Math.round(currentWeather.current.feels_like)}°C
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentWeather.current.humidity}%
              </div>
              <div className="text-sm text-blue-500 dark:text-blue-300">
                Umidade
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl mb-2">💨</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(currentWeather.current.wind.speed * 3.6)}
              </div>
              <div className="text-sm text-green-500 dark:text-green-300">
                km/h
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {currentWeather.current.pressure}
              </div>
              <div className="text-sm text-purple-500 dark:text-purple-300">
                hPa
              </div>
            </div>
          </div>

          {/* Forecast */}
          {showForecast && weatherForecast && (
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-4">
                📅 Próximos Dias
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {weatherForecast.forecast.slice(0, 5).map((day, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}
                    </div>
                    <div className="text-lg mb-2">
                      {day.condition.icon ? '☀️' : '🌤️'}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(day.temperature.max)}°
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(day.temperature.min)}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={refreshWeather}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🔄 Atualizar Dados
            </button>
            <button
              onClick={requestLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📍 Atualizar Localização
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌤️</div>
          {!location ? (
            <div className="space-y-4">
              <p className="text-green-600 dark:text-green-300">
                Precisamos da sua localização para mostrar dados climáticos precisos
              </p>
              <button
                onClick={requestLocation}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📍 Obter Localização
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-600 dark:text-green-300">
                Carregando dados climáticos...
              </p>
              <div className="animate-pulse w-8 h-8 bg-green-200 dark:bg-green-700 rounded-full mx-auto"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
