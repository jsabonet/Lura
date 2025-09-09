'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIntegratedLocationWeather } from '@/contexts/IntegratedLocationWeatherContext';
import { WeatherDataProvider, useWeatherData } from '@/contexts/WeatherDataContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingPage } from '@/components/common/Loading';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import Link from 'next/link';

// Importar apenas as funcionalidades dos novos sistemas
import RegionalWeatherSystem from '@/components/RegionalWeatherSystem';
import PreciseGPSSystem from '@/components/PreciseGPSSystem';

function ClimaPageContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { 
    location, 
    currentWeather, 
    weatherForecast,
    isInitialized 
  } = useIntegratedLocationWeather();

  // Estado para controlar qual sistema adicional mostrar
  const [showRegionalSystem, setShowRegionalSystem] = useState(false);
  const [showGPSSystem, setShowGPSSystem] = useState(false);

  // Context para limpar dados quando necessário
  const { clearData } = useWeatherData();

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
              <Link
                href="/alertas"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Alertas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles de Dados Climáticos - Movido para cima */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-xl mr-2">⚙️</span>
              Opções de Dados Climáticos
              {(showGPSSystem || showRegionalSystem) && (
                <span className="ml-3 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  {showGPSSystem ? '🛰️ GPS Ativo' : '🗺️ Regional Ativo'}
                </span>
              )}
            </h3>
            
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => {
                  if (showGPSSystem) {
                    // Se estava ativo, limpar dados do contexto
                    clearData();
                  }
                  setShowGPSSystem(!showGPSSystem);
                  setShowRegionalSystem(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showGPSSystem
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                🛰️ GPS Preciso
              </button>
              
              <button
                onClick={() => {
                  if (showRegionalSystem) {
                    // Se estava ativo, limpar dados do contexto
                    clearData();
                  }
                  setShowRegionalSystem(!showRegionalSystem);
                  setShowGPSSystem(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  showRegionalSystem
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                🗺️ Clima Regional
              </button>

              {(showGPSSystem || showRegionalSystem) && (
                <button
                  onClick={() => {
                    // Limpar dados do contexto ao fechar
                    clearData();
                    setShowGPSSystem(false);
                    setShowRegionalSystem(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  ❌ Voltar ao Padrão
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sistema GPS Preciso */}
        {showGPSSystem && (
          <div className="mb-8">
            <PreciseGPSSystem 
              onLocationUpdate={(location) => {
                console.log('Nova localização GPS:', location);
              }}
              onError={(error) => {
                console.error('Erro GPS:', error);
              }}
            />
          </div>
        )}

        {/* Sistema Regional com Select */}
        {showRegionalSystem && (
          <div className="mb-8">
            <RegionalWeatherSystem apiKey={process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''} />
          </div>
        )}

        {/* Weather Dashboard Original */}
        <WeatherDashboard className="mb-8" />

        {/* Botões para Sistemas Alternativos - Removido daqui */}

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

export default function ClimaPage() {
  return (
    <WeatherDataProvider>
      <ClimaPageContent />
    </WeatherDataProvider>
  );
}
