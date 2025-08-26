'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useGeolocation } from '@/contexts/GeolocationContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { climaService, ClimaAtual, PrevisaoClima, AlertaClimatico } from '@/services/clima';
import { LoadingPage, LoadingCard } from '@/components/common/Loading';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import LocationRequest from '@/components/common/LocationRequest';
import Link from 'next/link';

// Funções utilitárias locais
function isValidArray<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  } catch {
    return dateString;
  }
}

function getSeverityColor(nivel: string): string {
  switch (nivel?.toLowerCase()) {
    case 'alto':
      return 'border-red-300 bg-red-50 text-red-800';
    case 'médio':
    case 'medio':
      return 'border-yellow-300 bg-yellow-50 text-yellow-800';
    case 'baixo':
    default:
      return 'border-green-300 bg-green-50 text-green-800';
  }
}

export default function ClimaPage() {
  const { isAuthenticated, loading } = useAuth();
  const { location } = useGeolocation();
  const router = useRouter();
  const [climaAtual, setClimaAtual] = useState<ClimaAtual | null>(null);
  const [previsao, setPrevisao] = useState<PrevisaoClima[]>([]);
  const [alertas, setAlertas] = useState<AlertaClimatico[]>([]);
  const [cidade, setCidade] = useState('Maputo');
  const [useGPS, setUseGPS] = useState(false);
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
        let climaResponse, previsaoResponse, alertasResponse;
        
        // Usar GPS se disponível e ativado
        if (useGPS && location) {
          console.log('🎯 Usando coordenadas GPS:', location);
          
          // Buscar clima atual usando GPS
          climaResponse = await climaService.getClimaAtual(undefined, location.latitude, location.longitude);
          
          // Buscar previsão usando GPS
          previsaoResponse = await climaService.getPrevisao(7, undefined, location.latitude, location.longitude);
          
          // Buscar alertas (sem GPS, usa região geral)
          alertasResponse = await climaService.getAlertasClimaticos();
        } else {
          console.log('🏙️ Usando cidade:', cidade);
          
          // Buscar clima atual por cidade
          climaResponse = await climaService.getClimaAtual(cidade);
          
          // Buscar previsão por cidade
          previsaoResponse = await climaService.getPrevisao(7, cidade);
          
          // Buscar alertas por região
          alertasResponse = await climaService.getAlertasClimaticos();
        }

        if (climaResponse.data) {
          setClimaAtual(climaResponse.data);
        }

        if (previsaoResponse.data) {
          setPrevisao(previsaoResponse.data);
        }

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
  }, [isAuthenticated, cidade, useGPS, location]);

  const handleLocationObtained = (latitude: number, longitude: number) => {
    console.log('📍 Localização GPS obtida:', { latitude, longitude });
    // O useEffect será disparado automaticamente quando location mudar
  };

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
        {/* Controles de Localização */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">
                🌤️ Informações Climáticas
              </h2>
              <p className="text-green-600 dark:text-green-200">
                Previsões e alertas meteorológicos para sua região
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Toggle GPS/Cidade */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setUseGPS(false)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    !useGPS 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  🏙️ Por Cidade
                </button>
                <button
                  onClick={() => setUseGPS(true)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    useGPS 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  📍 GPS
                </button>
              </div>
              
              {/* Seletor de Cidade (apenas se não usar GPS) */}
              {!useGPS && (
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                >
                  {/* Maputo (Província e Cidade) */}
                  <option value="Maputo">Maputo</option>
                  <option value="Matola">Matola</option>
                  
                  {/* Gaza */}
                  <option value="Xai-Xai">Xai-Xai</option>
                  <option value="Chokwe">Chokwe</option>
                  <option value="Chibuto">Chibuto</option>
                  
                  {/* Inhambane */}
                  <option value="Inhambane">Inhambane</option>
                  <option value="Maxixe">Maxixe</option>
                  <option value="Vilanculos">Vilanculos</option>
                  
                  {/* Sofala */}
                  <option value="Beira">Beira</option>
                  <option value="Dondo">Dondo</option>
                  <option value="Nhamatanda">Nhamatanda</option>
                  
                  {/* Manica */}
                  <option value="Chimoio">Chimoio</option>
                  <option value="Manica">Manica</option>
                  <option value="Catandica">Catandica</option>
                  
                  {/* Tete */}
                  <option value="Tete">Tete</option>
                  <option value="Moatize">Moatize</option>
                  <option value="Cahora-Bassa">Cahora Bassa</option>
                  <option value="Angonia">Angonia</option>
                  
                  {/* Zambézia */}
                  <option value="Quelimane">Quelimane</option>
                  <option value="Mocuba">Mocuba</option>
                  <option value="Gurué">Gurué</option>
                  <option value="Milange">Milange</option>
                  
                  {/* Nampula */}
                  <option value="Nampula">Nampula</option>
                  <option value="Nacala">Nacala</option>
                  <option value="Ilha-de-Mocambique">Ilha de Moçambique</option>
                  <option value="Angoche">Angoche</option>
                  
                  {/* Cabo Delgado */}
                  <option value="Pemba">Pemba</option>
                  <option value="Montepuez">Montepuez</option>
                  <option value="Mueda">Mueda</option>
                  <option value="Mocimboa-da-Praia">Mocímboa da Praia</option>
                  
                  {/* Niassa */}
                  <option value="Lichinga">Lichinga</option>
                  <option value="Cuamba">Cuamba</option>
                  <option value="Mandimba">Mandimba</option>
                </select>
              )}
            </div>
          </div>
          
          {/* Componente de GPS (apenas se GPS estiver ativado) */}
          {useGPS && (
            <div className="mt-4">
              <LocationRequest 
                onLocationObtained={handleLocationObtained}
                className="w-full"
              />
            </div>
          )}
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
