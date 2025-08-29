'use client';

import React, { useState } from 'react';
import { useWeatherData } from '@/contexts/WeatherDataContext';
import RegionSelector from './RegionSelector';

interface RegionalWeatherSystemProps {
  apiKey: string;
}

const RegionalWeatherSystem: React.FC<RegionalWeatherSystemProps> = ({ apiKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const { setWeatherData, setDataSource, setError: setContextError, setIsLoading: setContextLoading } = useWeatherData();

  const fetchRegionalWeather = async (coords: { lat: number; lng: number }, locationName: string) => {
    if (!apiKey) {
      const errorMsg = 'API key do OpenWeather não configurada';
      setError(errorMsg);
      setContextError(errorMsg);
      return;
    }

    setIsLoading(true);
    setContextLoading(true);
    setError(null);
    setContextError(null);

    try {
      // Buscar dados atuais
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=metric&lang=pt`
      );

      if (!currentResponse.ok) {
        throw new Error(`Erro na API de dados atuais: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      // Buscar previsão de 7 dias
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=metric&lang=pt&cnt=40`
      );

      let forecastData = [];
      if (forecastResponse.ok) {
        const forecastResult = await forecastResponse.json();
        
        // Processar dados de previsão para 7 dias
        const dailyForecasts = new Map();
        
        forecastResult.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateKey = date.toDateString();
          
          if (!dailyForecasts.has(dateKey)) {
            dailyForecasts.set(dateKey, {
              date: date.toLocaleDateString('pt-BR', { 
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              }),
              datetime: date.toISOString(),
              temperature: {
                max: item.main.temp_max,
                min: item.main.temp_min
              },
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed * 3.6, // Converter para km/h
              precipitation: (item.rain?.['3h'] || 0) + (item.snow?.['3h'] || 0)
            });
          } else {
            // Atualizar min/max temperaturas se necessário
            const existing = dailyForecasts.get(dateKey);
            existing.temperature.max = Math.max(existing.temperature.max, item.main.temp_max);
            existing.temperature.min = Math.min(existing.temperature.min, item.main.temp_min);
          }
        });

        forecastData = Array.from(dailyForecasts.values()).slice(0, 7);
      }

      // Buscar índice UV (API gratuita do OpenWeather)
      let uvIndex = 0;
      try {
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}`
        );
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          uvIndex = uvData.value || 0;
        }
      } catch (uvError) {
        console.warn('Erro ao buscar dados UV:', uvError);
      }

      // Transformar dados para o formato esperado
      const weatherData = {
        location: {
          name: locationName,
          country: 'Moçambique',
          lat: coords.lat,
          lng: coords.lng
        },
        current: {
          temperature: currentData.main.temp,
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          wind: {
            speed: currentData.wind.speed,
            direction: `${currentData.wind.deg}°`
          },
          pressure: currentData.main.pressure,
          visibility: currentData.visibility / 1000, // Converter para km
          uvIndex: uvIndex
        },
        forecast: forecastData
      };

      setWeatherData(weatherData);
      setDataSource('regional');

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar dados climáticos regionais';
      setError(errorMsg);
      setContextError(errorMsg);
      console.error('Erro ao buscar dados climáticos:', err);
    } finally {
      setIsLoading(false);
      setContextLoading(false);
    }
  };

  const handleRegionSelect = (province: string, district?: string, coords?: { lat: number; lng: number }) => {
    setSelectedProvince(province);
    setSelectedDistrict(district || '');
    
    if (coords) {
      setCurrentCoords(coords);
      const locationName = district ? `${district}, ${province}` : province;
      fetchRegionalWeather(coords, locationName);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🗺️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl lg:text-2xl font-bold mb-1">
              Sistema Regional Avançado
            </h3>
            <p className="text-emerald-100 text-sm lg:text-base">
              Precisão climática por província e distrito de Moçambique
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-200">Sistema Ativo</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6 space-y-6">
        {/* Seletor de Região com design melhorado */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
          <RegionSelector
            onRegionSelect={handleRegionSelect}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            className="max-w-2xl"
          />
        </div>

        {/* Status de Carregamento com design melhorado */}
        {isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 rounded-full h-8 w-8 border-4 border-transparent border-t-blue-400 animate-ping"></div>
              </div>
              <div className="text-center">
                <div className="text-blue-800 dark:text-blue-300 font-medium">
                  Carregando dados climáticos
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {selectedDistrict || selectedProvince}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Erro com design melhorado */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h4 className="text-red-800 dark:text-red-300 font-semibold mb-1">
                  Erro no Sistema Regional
                </h4>
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Informações sobre os dados com design profissional */}
        {currentCoords && !isLoading && !error && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400 text-xl">📍</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <span>Dados Climáticos Carregados</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/60 dark:bg-gray-800/40 rounded-lg px-3 py-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Localização:</span>
                      <span className="text-emerald-800 dark:text-emerald-300">
                        {selectedDistrict ? `${selectedDistrict}, ${selectedProvince}` : selectedProvince}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 dark:bg-gray-800/40 rounded-lg px-3 py-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Coordenadas:</span>
                      <span className="text-emerald-800 dark:text-emerald-300 font-mono text-xs">
                        {currentCoords.lat.toFixed(3)}, {currentCoords.lng.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/60 dark:bg-gray-800/40 rounded-lg px-3 py-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Fonte:</span>
                      <span className="text-emerald-800 dark:text-emerald-300">OpenWeather API</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 dark:bg-gray-800/40 rounded-lg px-3 py-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">Status:</span>
                      <span className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        Ativo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-100/50 dark:bg-emerald-800/20 rounded-lg">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <span>💡</span>
                    <em>Os dados climáticos específicos desta região estão sendo exibidos no dashboard principal acima.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções de uso com design melhorado */}
        {!selectedProvince && (
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 text-xl">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-3">
                  Como usar o Sistema Regional
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Selecione uma província no primeiro dropdown
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Escolha um distrito específico (opcional)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Os dados climáticos serão carregados automaticamente
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Use a busca para encontrar rapidamente sua região
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalWeatherSystem;
