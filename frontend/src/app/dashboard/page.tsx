'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { climaService, ClimaAtual, AlertaClimatico } from '@/services/clima';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [climaAtual, setClimaAtual] = useState<ClimaAtual | null>(null);
  const [alertas, setAlertas] = useState<AlertaClimatico[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar clima atual
        const climaResponse = await climaService.getClimaAtual('Maputo');
        if (climaResponse.data) {
          setClimaAtual(climaResponse.data);
        }

        // Buscar alertas
        const alertasResponse = await climaService.getAlertasClimaticos();
        if (alertasResponse.data) {
          setAlertas(alertasResponse.data.slice(0, 3)); // Apenas os 3 primeiros
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 flex items-center justify-center">
        <div className="text-green-800 dark:text-green-100">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      {/* Header */}
      <header className="bg-white dark:bg-green-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🌾</div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
                AgroAlerta
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white font-medium">
                Dashboard
              </Link>
              <Link href="/clima-novo" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Clima
              </Link>
              <Link href="/pragas" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Pragas
              </Link>
              <Link href="/mercado" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Mercado
              </Link>
              <Link href="/chatbot" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Assistente
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-green-700 dark:text-green-200">
                {user?.first_name || user?.username}
              </span>
              <Link
                href="/perfil"
                className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
              >
                Perfil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">
            Bem-vindo, {user?.first_name || user?.username}!
          </h2>
          <p className="text-green-600 dark:text-green-200">
            Aqui está um resumo das informações mais importantes para sua propriedade.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Clima Moderno - Widget Integrado */}
          <div className="md:col-span-2">
            <WeatherWidget compact={true} />
          </div>

          {/* Alertas */}
          <div className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">
                Alertas Ativos
              </h3>
              <div className="text-2xl">⚠️</div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {alertas.length}
            </div>
            <div className="text-sm text-green-600 dark:text-green-200">
              {alertas.length === 0 ? 'Nenhum alerta' : 'Alertas ativos'}
            </div>
          </div>

          {/* Detecções Recentes */}
          <div className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">
                Detecções
              </h3>
              <div className="text-2xl">🐛</div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              0
            </div>
            <div className="text-sm text-green-600 dark:text-green-200">
              Esta semana
            </div>
          </div>

          {/* Recomendações */}
          <div className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100">
                Recomendações
              </h3>
              <div className="text-2xl">💡</div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              3
            </div>
            <div className="text-sm text-green-600 dark:text-green-200">
              Disponíveis
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Previsão do Tempo */}
          <div className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-100">
                Previsão dos Próximos Dias
              </h3>
              <Link
                href="/clima"
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                Ver mais →
              </Link>
            </div>
            <div className="text-green-600 dark:text-green-200">
              Dados de previsão serão carregados aqui...
            </div>
          </div>

          {/* Alertas Recentes */}
          <div className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-100">
                Alertas Recentes
              </h3>
              <Link
                href="/clima"
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {alertas.length === 0 ? (
                <div className="text-green-600 dark:text-green-200">
                  Nenhum alerta ativo no momento
                </div>
              ) : (
                alertas.map((alerta) => (
                  <div key={alerta.id} className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200">
                      {alerta.titulo}
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-300">
                      {alerta.descricao}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/pragas"
              className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📸</div>
              <div className="font-semibold text-green-800 dark:text-green-100">
                Detectar Praga
              </div>
              <div className="text-sm text-green-600 dark:text-green-200">
                Envie uma foto
              </div>
            </Link>

            <Link
              href="/clima"
              className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🌦️</div>
              <div className="font-semibold text-green-800 dark:text-green-100">
                Ver Previsão
              </div>
              <div className="text-sm text-green-600 dark:text-green-200">
                7 dias
              </div>
            </Link>

            <Link
              href="/chatbot"
              className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold text-green-800 dark:text-green-100">
                Assistente
              </div>
              <div className="text-sm text-green-600 dark:text-green-200">
                Tire dúvidas
              </div>
            </Link>

            <Link
              href="/mercado"
              className="bg-white dark:bg-green-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold text-green-800 dark:text-green-100">
                Preços
              </div>
              <div className="text-sm text-green-600 dark:text-green-200">
                Ver mercado
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
