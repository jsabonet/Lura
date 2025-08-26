'use client';

import React, { useState, useEffect } from 'react';
import { useWeatherData } from '@/contexts/WeatherDataContext';

// Regiões de Moçambique com coordenadas
const MOZAMBIQUE_REGIONS = [
  { 
    name: 'Maputo Cidade', 
    coords: { lat: -25.969, lng: 32.573 },
    description: 'Capital de Moçambique'
  },
  { 
    name: 'Maputo Província', 
    coords: { lat: -25.0, lng: 32.0 },
    description: 'Província de Maputo'
  },
  { 
    name: 'Gaza', 
    coords: { lat: -23.0, lng: 33.0 },
    description: 'Província de Gaza'
  },
  { 
    name: 'Inhambane', 
    coords: { lat: -22.0, lng: 35.0 },
    description: 'Província de Inhambane'
  },
  { 
    name: 'Sofala', 
    coords: { lat: -18.0, lng: 35.0 },
    description: 'Província de Sofala - Beira'
  },
  { 
    name: 'Manica', 
    coords: { lat: -18.5, lng: 33.0 },
    description: 'Província de Manica'
  },
  { 
    name: 'Tete', 
    coords: { lat: -16.0, lng: 33.0 },
    description: 'Província de Tete'
  },
  { 
    name: 'Zambézia', 
    coords: { lat: -17.0, lng: 37.0 },
    description: 'Província da Zambézia'
  },
  { 
    name: 'Nampula', 
    coords: { lat: -15.0, lng: 39.0 },
    description: 'Província de Nampula'
  },
  { 
    name: 'Cabo Delgado', 
    coords: { lat: -11.0, lng: 40.0 },
    description: 'Província de Cabo Delgado'
  },
  { 
    name: 'Niassa', 
    coords: { lat: -13.0, lng: 37.0 },
    description: 'Província do Niassa'
  }
];

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  icon: string;
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    description: string;
    icon: string;
    rain: number;
  }>;
}

interface RegionalWeatherSystemProps {
  apiKey: string;
}

export default function RegionalWeatherSystem({ apiKey }: RegionalWeatherSystemProps) {
  const [selectedRegion, setSelectedRegion] = useState(MOZAMBIQUE_REGIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Context para enviar dados para o dashboard principal
  const { 
    setWeatherData: setContextWeatherData, 
    setIsLoading, 
    setError: setContextError,
    setDataSource 
  } = useWeatherData();

  const fetchRegionalWeather = async (region: typeof MOZAMBIQUE_REGIONS[0]) => {
    setLoading(true);
    setIsLoading(true);
    setError(null);
    setContextError(null);
    
    try {
      // Obter clima atual
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${region.coords.lat}&lon=${region.coords.lng}&appid=${apiKey}&units=metric&lang=pt`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Erro ao obter dados climáticos');
      }
      
      const currentData = await currentResponse.json();
      
      // Obter previsão
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${region.coords.lat}&lon=${region.coords.lng}&appid=${apiKey}&units=metric&lang=pt`
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
            precipitation: item.rain?.['3h'] || 0
          });
          processedDates.add(date);
        }
      }
      
      // Formato local do componente
      const weather: WeatherData = {
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s para km/h
        pressure: currentData.main.pressure,
        visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10,
        icon: currentData.weather[0].icon,
        forecast: dailyForecast.map(item => ({
          date: item.date,
          temp_max: item.temperature.max,
          temp_min: item.temperature.min,
          description: item.description,
          icon: item.icon,
          rain: item.precipitation
        }))
      };

      // Formato para o contexto global
      const contextWeatherData = {
        location: {
          name: region.name,
          country: 'Moçambique',
          lat: region.coords.lat,
          lng: region.coords.lng
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
        forecast: dailyForecast.map(item => ({
          date: item.date,
          temperature: item.temperature,
          description: item.description,
          icon: item.icon,
          humidity: currentData.main.humidity, // Usar valor atual
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          precipitation: item.precipitation
        }))
      };
      
      setWeatherData(weather);
      setContextWeatherData(contextWeatherData);
      setDataSource('regional');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setContextError(errorMessage);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionalWeather(selectedRegion);
  }, [selectedRegion]);

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header Mais Compacto */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
          🌍 Clima por Região - Moçambique
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Selecione uma província para ver a previsão do tempo
        </p>
      </div>

      {/* Seletor de Região com Select */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          📍 Selecionar Região:
        </label>
        <div className="relative">
          <select
            value={selectedRegion.name}
            onChange={(e) => {
              const region = MOZAMBIQUE_REGIONS.find(r => r.name === e.target.value);
              if (region) setSelectedRegion(region);
            }}
            className="w-full p-3 pr-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            {MOZAMBIQUE_REGIONS.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name} - {region.description}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Região Selecionada - Info Visual */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">🏛️</span>
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-300">{selectedRegion.name}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 ml-2">({selectedRegion.description})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Carregando dados climáticos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Weather Display */}
      {weatherData && !loading && (
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedRegion.name}</h2>
                <p className="text-blue-100">{selectedRegion.description}</p>
              </div>
              <div className="text-6xl">
                {getWeatherIcon(weatherData.icon)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🌡️</span>
                  <span className="text-sm">Temperatura</span>
                </div>
                <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                <div className="text-sm text-blue-100 capitalize">{weatherData.description}</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💧</span>
                  <span className="text-sm">Umidade</span>
                </div>
                <div className="text-2xl font-bold">{weatherData.humidity}%</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💨</span>
                  <span className="text-sm">Vento</span>
                </div>
                <div className="text-2xl font-bold">{weatherData.windSpeed} km/h</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">👁️</span>
                  <span className="text-sm">Visibilidade</span>
                </div>
                <div className="text-2xl font-bold">{weatherData.visibility} km</div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-lg mr-2">📅</span>
              Previsão dos Próximos Dias
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {index === 0 ? 'Hoje' : day.date}
                  </div>
                  <div className="text-3xl mb-2">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize mb-2">
                    {day.description}
                  </div>
                  <div className="font-bold">
                    <span className="text-red-500">{day.temp_max}°</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-blue-500">{day.temp_min}°</span>
                  </div>
                  {day.rain > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      💧 {day.rain}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
