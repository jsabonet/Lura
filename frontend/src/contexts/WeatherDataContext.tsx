'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  };
  current: {
    temperature: number;
    description: string;
    humidity: number;
    wind: {
      speed: number;
      direction: string;
    };
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    temperature: {
      max: number;
      min: number;
    };
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  }>;
}

interface WeatherDataContextType {
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  dataSource: 'gps' | 'regional' | 'default' | null;
  setDataSource: (source: 'gps' | 'regional' | 'default' | null) => void;
  clearData: () => void;
}

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(undefined);

export function WeatherDataProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'gps' | 'regional' | 'default' | null>(null);

  const clearData = () => {
    setWeatherData(null);
    setError(null);
    setDataSource(null);
    setIsLoading(false);
  };

  return (
    <WeatherDataContext.Provider
      value={{
        weatherData,
        setWeatherData,
        isLoading,
        setIsLoading,
        error,
        setError,
        dataSource,
        setDataSource,
        clearData,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
}

export function useWeatherData() {
  const context = useContext(WeatherDataContext);
  if (context === undefined) {
    throw new Error('useWeatherData must be used within a WeatherDataProvider');
  }
  return context;
}
