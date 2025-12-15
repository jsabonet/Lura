import { useState, useEffect } from 'react';
import { getWeatherByGPS, type WeatherData } from '@/services/weatherService';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherByGPS();
        setWeatherData(data);
      } catch (err) {
        console.error('Erro ao carregar clima:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados climáticos');
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  return { weatherData, loading, error };
}
