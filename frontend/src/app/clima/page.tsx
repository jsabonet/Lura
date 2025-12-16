'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIntegratedLocationWeather } from '@/contexts/IntegratedLocationWeatherContext';
import { WeatherDataProvider, useWeatherData } from '@/contexts/WeatherDataContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingPage } from '@/components/common/Loading';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                🌤️ Clima Agrícola
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                Dados climáticos precisos para decisões agrícolas inteligentes
              </p>
            </div>
            
            {/* Navigation - Mobile Optimized */}
            <div className="flex flex-wrap gap-2 sm:space-x-4 justify-center sm:justify-end">
              {/* <Link
                href="/dashboard"
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex-1 sm:flex-none text-center"
              >
                Dashboard
              </Link> */}
              {/* <Link
                href="/pragas"
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-1 sm:flex-none text-center"
              >
                Pragas
              </Link> */}
              {/* <Link
                href="/mercado"
                className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex-1 sm:flex-none text-center"
              >
                Mercado
              </Link> */}
              <Link
                href="/alertas"
                className="px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm flex-1 sm:flex-none text-center"
              >
                Alertas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Controles de Dados Climáticos - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center">
              <span className="flex items-center mb-2 sm:mb-0">
                <span className="text-lg sm:text-xl mr-2">⚙️</span>
                Opções de Dados Climáticos
              </span>
              {(showGPSSystem || showRegionalSystem) && (
                <span className="ml-0 sm:ml-3 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full inline-block w-fit">
                  {showGPSSystem ? '🛰️ GPS Ativo' : '🗺️ Regional Ativo'}
                </span>
              )}
            </h3>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 sm:items-center">
              <button
                onClick={() => {
                  if (showGPSSystem) {
                    // Se estava ativo, limpar dados do contexto
                    clearData();
                  }
                  setShowGPSSystem(!showGPSSystem);
                  setShowRegionalSystem(false);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
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
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
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
                  className="px-3 sm:px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base"
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

        {/* Quick Actions - Mobile Optimized */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="#"
            className="block p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-2xl sm:text-3xl">🐛</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Monitorar Pragas</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Identificação e controle</p>
              </div>
            </div>
          </Link>

          <Link
            href="#"
            className="block p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-2xl sm:text-3xl">💰</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Preços do Mercado</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cotações atualizadas</p>
              </div>
            </div>
          </Link>

          <Link
            href="#"
            className="block p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-slate-800 transition-colors sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-2xl sm:text-3xl">💡</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Recomendações</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Dicas personalizadas</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
            Sistema integrado com APIs profissionais • Precisão Google Maps + Dados OpenWeather
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ClimaPage() {
  return (
    <ProtectedRoute>
      <WeatherDataProvider>
        <ClimaPageContent />
      </WeatherDataProvider>
    </ProtectedRoute>
  );
}
