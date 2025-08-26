'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIntegratedLocationWeather } from '@/contexts/IntegratedLocationWeatherContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/common/Loading';
import { IntegratedWeatherDisplay } from '@/components/IntegratedWeatherDisplay';
import Link from 'next/link';

export default function ClimaPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { 
    location, 
    currentWeather, 
    weatherForecast,
    isInitialized,
    requestLocation 
  } = useIntegratedLocationWeather();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🌤️ Clima Agrícola
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Dados climáticos precisos para decisões agrícolas inteligentes
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pragas"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pragas
              </Link>
              <Link
                href="/mercado"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Mercado
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Weather Display */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dados Climáticos Completos
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Sistema integrado Google Maps + OpenWeather
                </p>
              </div>
              
              {/* API Status */}
              <div className="flex flex-col items-end space-y-1">
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Google Maps</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>OpenWeather</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Weather Component */}
          <div className="p-6">
            <IntegratedWeatherDisplay 
              showDetailedForecast={true}
              showLocationDetails={true}
              autoRefresh={true}
              refreshInterval={30}
            />
          </div>
        </div>

        {/* Agricultural Insights */}
        {currentWeather && (
          <div className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              🌾 Insights Agrícolas Personalizados
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Temperature Analysis */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 flex items-center space-x-2">
                  <span>🌡️</span>
                  <span>Temperatura: {Math.round(currentWeather.current.temperature)}°C</span>
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400 mt-2">
                  {currentWeather.current.temperature > 30 
                    ? '🔥 Alta temperatura - considere irrigação adicional e proteção das culturas'
                    : currentWeather.current.temperature < 10
                    ? '❄️ Baixa temperatura - proteja culturas sensíveis ao frio'
                    : '✅ Temperatura ideal para crescimento da maioria das culturas'
                  }
                </p>
              </div>

              {/* Humidity Analysis */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-300 flex items-center space-x-2">
                  <span>💧</span>
                  <span>Umidade: {currentWeather.current.humidity}%</span>
                </h4>
                <p className="text-sm text-green-800 dark:text-green-400 mt-2">
                  {currentWeather.current.humidity > 80 
                    ? '🍄 Alta umidade - monitore fungos e doenças foliares'
                    : currentWeather.current.humidity < 40
                    ? '🏜️ Baixa umidade - aumente frequência de irrigação'
                    : '✅ Umidade adequada para desenvolvimento saudável'
                  }
                </p>
              </div>

              {/* Wind Analysis */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 flex items-center space-x-2">
                  <span>💨</span>
                  <span>Vento: {Math.round(currentWeather.current.wind.speed * 3.6)} km/h</span>
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-400 mt-2">
                  {currentWeather.current.wind.speed > 10 
                    ? '⚠️ Vento forte - evite aplicação de defensivos e fertilizantes foliares'
                    : '✅ Condições ideais para aplicações e pulverizações'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pragas"
            className="block p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🐛</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Monitorar Pragas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Identificação e controle</p>
              </div>
            </div>
          </Link>

          <Link
            href="/mercado"
            className="block p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">💰</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Preços do Mercado</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cotações atualizadas</p>
              </div>
            </div>
          </Link>

          <Link
            href="/recomendacoes"
            className="block p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Recomendações</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dicas personalizadas</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sistema integrado com APIs profissionais • Precisão Google Maps + Dados OpenWeather
          </p>
        </div>
      </div>
    </div>
  );
}
