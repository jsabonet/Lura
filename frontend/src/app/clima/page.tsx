'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { climaService, ClimaAtual, PrevisaoClima, AlertaClimatico } from '@/services/clima';
import { isValidArray, formatDateShort, getSeverityColor } from '@/utils/helpers';
import { LoadingPage, LoadingCard } from '@/components/common/Loading';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Link from 'next/link';

export default function ClimaPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [climaAtual, setClimaAtual] = useState<ClimaAtual | null>(null);
  const [previsao, setPrevisao] = useState<PrevisaoClima[]>([]);
  const [alertas, setAlertas] = useState<AlertaClimatico[]>([]);
  const [cidade, setCidade] = useState('Maputo');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchClimaData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        // Buscar clima atual
        const climaResponse = await climaService.getClimaAtual(cidade);
        if (climaResponse.data) {
          setClimaAtual(climaResponse.data);
        }

        // Buscar previsão
        const previsaoResponse = await climaService.getPrevisao(7, cidade);
        if (previsaoResponse.data) {
          setPrevisao(previsaoResponse.data);
        }

        // Buscar alertas
        const alertasResponse = await climaService.getAlertasClimaticos();
        if (alertasResponse.data) {
          setAlertas(alertasResponse.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do clima:', error);
        setError('Erro ao carregar dados do clima. Verifique sua conexão.');
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchClimaData();
    }
  }, [isAuthenticated, cidade]);

  const formatDate = (dateString: string) => {
    return formatDateShort(dateString);
  };

  const getSeverityColorLocal = (nivel: string) => {
    return getSeverityColor(nivel);
  };

  if (loading) {
    return <LoadingPage message="Carregando dados do clima..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 p-4">
        <div className="max-w-md mx-auto mt-20">
          <ErrorDisplay 
            error={error} 
            onRetry={() => window.location.reload()} 
            title="Erro ao Carregar Clima"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      {/* Header */}
      <header className="bg-white dark:bg-green-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="text-2xl">🌾</div>
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-100">
                AgroAlerta
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/clima" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white font-medium">
                Clima
              </Link>
              <Link href="/pragas" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Pragas
              </Link>
              <Link href="/mercado" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Mercado
              </Link>
            </nav>

            <Link
              href="/dashboard"
              className="text-green-700 hover:text-green-900 dark:text-green-200 dark:hover:text-white"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">
              🌤️ Informações Climáticas
            </h2>
            <p className="text-green-600 dark:text-green-200">
              Previsões e alertas meteorológicos para sua região
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
            >
              <option value="Maputo">Maputo</option>
              <option value="Beira">Beira</option>
              <option value="Nampula">Nampula</option>
              <option value="Tete">Tete</option>
              <option value="Quelimane">Quelimane</option>
            </select>
          </div>
        </div>

        {loadingData ? (
          <LoadingCard message="Carregando dados do clima..." />
        ) : (
          <>
            {/* Clima Atual */}
            {climaAtual && (
              <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-4">
                  Clima Atual - {climaAtual.cidade}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌡️</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {climaAtual.temperatura}°C
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-200">
                      Sensação: {climaAtual.sensacao_termica}°C
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-2">💧</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {climaAtual.umidade}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-200">
                      Umidade
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-2">💨</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {climaAtual.velocidade_vento} km/h
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-200">
                      Vento
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌪️</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {climaAtual.pressao} hPa
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-200">
                      Pressão
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-lg text-green-700 dark:text-green-200">
                    {climaAtual.descricao}
                  </div>
                </div>
              </div>
            )}

            {/* Alertas Climáticos */}
            {isValidArray(alertas) && (
              <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-4">
                  ⚠️ Alertas Climáticos Ativos
                </h3>
                <div className="space-y-4">
                  {alertas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className={`p-4 rounded-lg border ${getSeverityColorLocal(alerta.nivel_severidade || 'baixo')}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{alerta.titulo}</h4>
                          <p className="text-sm mb-2">{alerta.descricao}</p>
                          <div className="text-xs">
                            <span className="font-medium">Período:</span> {formatDate(alerta.data_inicio)} - {formatDate(alerta.data_fim)}
                          </div>
                          {isValidArray(alerta.regioes_afetadas) && (
                            <div className="text-xs mt-1">
                              <span className="font-medium">Regiões:</span> {alerta.regioes_afetadas!.join(', ')}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded uppercase">
                          {alerta.nivel_severidade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previsão 7 Dias */}
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-4">
                📅 Previsão para os Próximos 7 Dias
              </h3>
              {isValidArray(previsao) ? (
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {previsao.map((dia, index) => (
                    <div key={index} className="text-center p-4 bg-green-50 dark:bg-green-700 rounded-lg">
                      <div className="font-medium text-green-800 dark:text-green-100 mb-2">
                        {formatDate(dia.data)}
                      </div>
                      <div className="text-2xl mb-2">☀️</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {dia.temperatura_max}°
                      </div>
                      <div className="text-sm text-green-500 dark:text-green-300">
                        {dia.temperatura_min}°
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-200 mt-2">
                        💧 {dia.probabilidade_chuva}%
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-200">
                        💨 {dia.velocidade_vento} km/h
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-green-600 dark:text-green-200">
                  Dados de previsão não disponíveis no momento
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
