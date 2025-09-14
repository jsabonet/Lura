'use client';

import React, { useState } from 'react';
import RegionalWeatherSystem from '../components/RegionalWeatherSystem';
import PreciseGPSSystem from '../components/PreciseGPSSystem';

interface GPSLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface GPSWeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
  location: string;
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    description: string;
    icon: string;
    rain: number;
  }>;
}

export default function DualClimateSystemPage() {
  const [activeTab, setActiveTab] = useState<'regional' | 'gps'>('regional');
  const [gpsLocation, setGpsLocation] = useState<GPSLocationData | null>(null);
  const [gpsWeather, setGpsWeather] = useState<GPSWeatherData | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

  const fetchGPSWeather = async (location: GPSLocationData) => {
    setGpsLoading(true);
    setGpsError(null);
    
    try {
      // Obter clima atual
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Erro ao obter dados climáticos para sua localização');
      }
      
      const currentData = await currentResponse.json();
      
      // Obter previsão
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt`
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
            temp_max: Math.round(item.main.temp_max),
            temp_min: Math.round(item.main.temp_min),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            rain: item.rain?.['3h'] || 0
          });
          processedDates.add(date);
        }
      }
      
      const weather: GPSWeatherData = {
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s para km/h
        pressure: currentData.main.pressure,
        icon: currentData.weather[0].icon,
        location: location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        forecast: dailyForecast
      };
      
      setGpsWeather(weather);
    } catch (err) {
      setGpsError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleLocationUpdate = (location: GPSLocationData) => {
    setGpsLocation(location);
    fetchGPSWeather(location);
  };

  const handleLocationError = (error: string) => {
    setGpsError(error);
    setGpsLoading(false);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            🌤️ Sistema Dual de Clima Agrícola
          </h1>
          <p className="text-gray-600 text-center">
            Dados climáticos precisos para decisões agrícolas inteligentes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex bg-white rounded-lg border shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('regional')}
            className={`flex-1 py-4 px-6 font-medium transition-all duration-200 rounded-l-lg ${
              activeTab === 'regional'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-2">🗺️</span>
              <div>
                <div className="font-bold">Clima por Região</div>
                <div className="text-sm opacity-80">Moçambique - Províncias</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('gps')}
            className={`flex-1 py-4 px-6 font-medium transition-all duration-200 rounded-r-lg ${
              activeTab === 'gps'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl mr-2">🛰️</span>
              <div>
                <div className="font-bold">GPS Preciso</div>
                <div className="text-sm opacity-80">Sua Localização Exata</div>
              </div>
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'regional' ? (
          <RegionalWeatherSystem apiKey={OPENWEATHER_API_KEY} />
        ) : (
          <div className="space-y-6">
            {/* GPS System */}
            <PreciseGPSSystem 
              onLocationUpdate={handleLocationUpdate}
              onError={handleLocationError}
            />

            {/* GPS Weather Display */}
            {gpsLoading && (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600">Carregando dados climáticos para sua localização...</p>
              </div>
            )}

            {gpsError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-red-800 mb-2">❌ Erro</h3>
                <p className="text-red-700">{gpsError}</p>
              </div>
            )}

            {gpsWeather && !gpsLoading && (
              <div className="space-y-6">
                {/* Current Weather */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">Sua Localização GPS</h2>
                      <p className="text-green-100">{gpsWeather.location}</p>
                      {gpsLocation && (
                        <p className="text-xs text-green-200 mt-1">
                          Precisão: ±{gpsLocation.accuracy.toFixed(0)}m
                        </p>
                      )}
                    </div>
                    <div className="text-6xl">
                      {getWeatherIcon(gpsWeather.icon)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🌡️</span>
                        <span className="text-sm">Temperatura</span>
                      </div>
                      <div className="text-2xl font-bold">{gpsWeather.temperature}°C</div>
                      <div className="text-sm text-green-100 capitalize">{gpsWeather.description}</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💧</span>
                        <span className="text-sm">Humidade</span>
                      </div>
                      <div className="text-2xl font-bold">{gpsWeather.humidity}%</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💨</span>
                        <span className="text-sm">Vento</span>
                      </div>
                      <div className="text-2xl font-bold">{gpsWeather.windSpeed} km/h</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🧭</span>
                        <span className="text-sm">Pressão</span>
                      </div>
                      <div className="text-2xl font-bold">{gpsWeather.pressure} hPa</div>
                    </div>
                  </div>
                </div>

                {/* Forecast */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-lg mr-2">📅</span>
                    Previsão para Sua Localização
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {gpsWeather.forecast.map((day, index) => (
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
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Sistema integrado com APIs profissionais • Precisão GPS + Dados OpenWeather</p>
        </div>
      </div>
    </div>
  );
}
