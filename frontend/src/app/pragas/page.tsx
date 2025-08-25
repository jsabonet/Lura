'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { pragasService, DeteccaoPraga, Praga, RecomendacaoPraga } from '@/services/pragas';
import { isValidArray, formatDateBR, getSeverityColor } from '@/utils/helpers';
import { LoadingPage } from '@/components/common/Loading';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Link from 'next/link';

export default function PragasPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cultura, setCultura] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [deteccaoResult, setDeteccaoResult] = useState<DeteccaoPraga | null>(null);
  const [recomendacao, setRecomendacao] = useState<RecomendacaoPraga | null>(null);
  const [historico, setHistorico] = useState<DeteccaoPraga[]>([]);
  const [pragasComuns, setPragasComuns] = useState<Praga[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const CULTURAS = [
    'Milho', 'Arroz', 'Feijão', 'Mandioca', 'Batata-doce',
    'Amendoim', 'Gergelim', 'Algodão', 'Caju', 'Coco',
    'Banana', 'Manga', 'Abacaxi', 'Tomate', 'Cebola'
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar histórico de detecções
        const historicoResponse = await pragasService.getHistoricoDeteccoes(5);
        if (historicoResponse.data) {
          setHistorico(historicoResponse.data);
        }

        // Buscar pragas comuns
        const pragasResponse = await pragasService.listarPragas();
        if (pragasResponse.data) {
          setPragasComuns(pragasResponse.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectPraga = async () => {
    if (!selectedFile || !cultura) {
      alert('Por favor, selecione uma imagem e a cultura.');
      return;
    }

    setIsDetecting(true);
    try {
      const response = await pragasService.detectarPraga(
        selectedFile,
        cultura,
        undefined,
        observacoes
      );

      if (response.data) {
        setDeteccaoResult(response.data);
        
        // Buscar recomendações
        const recomendacaoResponse = await pragasService.gerarRecomendacao(
          response.data.praga_detectada.id,
          cultura
        );
        
        if (recomendacaoResponse.data) {
          setRecomendacao(recomendacaoResponse.data);
        }

        // Atualizar histórico
        const historicoResponse = await pragasService.getHistoricoDeteccoes(5);
        if (historicoResponse.data) {
          setHistorico(historicoResponse.data);
        }
      }
    } catch (error) {
      console.error('Erro na detecção:', error);
      alert('Erro ao detectar praga. Tente novamente.');
    } finally {
      setIsDetecting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setCultura('');
    setObservacoes('');
    setDeteccaoResult(null);
    setRecomendacao(null);
  };

  const formatDate = (dateString: string) => {
    return formatDateBR(dateString);
  };

  if (loading) {
    return <LoadingPage message="Carregando dados de pragas..." />;
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
              <Link href="/clima" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white">
                Clima
              </Link>
              <Link href="/pragas" className="text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-white font-medium">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">
            🐛 Detecção de Pragas e Doenças
          </h2>
          <p className="text-green-600 dark:text-green-200">
            Identifique pragas e doenças através de fotos usando nossa IA especializada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload e Detecção */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-4">
                📸 Nova Detecção
              </h3>

              {!deteccaoResult ? (
                <div className="space-y-6">
                  {/* Upload de Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-2">
                      Foto da Cultura Afetada
                    </label>
                    <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full h-64 object-contain mx-auto rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview(null);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover imagem
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-4">📷</div>
                          <p className="text-green-600 dark:text-green-200 mb-4">
                            Clique para selecionar uma imagem ou arraste aqui
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-input"
                          />
                          <label
                            htmlFor="file-input"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700"
                          >
                            Selecionar Imagem
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seleção de Cultura */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-2">
                      Cultura Afetada *
                    </label>
                    <select
                      value={cultura}
                      onChange={(e) => setCultura(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                    >
                      <option value="">Selecione a cultura</option>
                      {CULTURAS.map(cult => (
                        <option key={cult} value={cult}>{cult}</option>
                      ))}
                    </select>
                  </div>

                  {/* Observações */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 dark:text-green-200 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows={3}
                      placeholder="Descreva sintomas observados, localização na planta, etc."
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:border-green-600 dark:text-white"
                    />
                  </div>

                  {/* Botão de Detecção */}
                  <button
                    onClick={handleDetectPraga}
                    disabled={!selectedFile || !cultura || isDetecting}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDetecting ? 'Analisando Imagem...' : 'Detectar Praga'}
                  </button>
                </div>
              ) : (
                /* Resultado da Detecção */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-100">
                      Resultado da Análise
                    </h4>
                    <button
                      onClick={resetForm}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                    >
                      Nova Detecção
                    </button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-700 p-4 rounded-lg">
                    <div className="flex items-start space-x-4">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Imagem analisada"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h5 className="font-semibold text-green-800 dark:text-green-100">
                          {deteccaoResult.praga_detectada.nome}
                        </h5>
                        <p className="text-sm text-green-600 dark:text-green-200 italic">
                          {deteccaoResult.praga_detectada.nome_cientifico}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          Confiança: {Math.round(deteccaoResult.confianca * 100)}%
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Cultura: {deteccaoResult.cultura}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recomendações */}
                  {recomendacao && (
                    <div className="space-y-4">
                      <h5 className="font-semibold text-green-800 dark:text-green-100">
                        Recomendações de Controle
                      </h5>
                      
                      <div className={`p-3 rounded-lg ${getSeverityColor(recomendacao.urgencia)} bg-opacity-10`}>
                        <p className="font-medium">
                          Urgência: <span className={getSeverityColor(recomendacao.urgencia)}>
                            {recomendacao.urgencia?.toUpperCase() || 'NÃO DEFINIDA'}
                          </span>
                        </p>
                      </div>

                      {recomendacao.recomendacoes_imediatas && recomendacao.recomendacoes_imediatas.length > 0 && (
                        <div>
                          <h6 className="font-medium text-green-800 dark:text-green-100 mb-2">
                            Ações Imediatas:
                          </h6>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-200">
                            {recomendacao.recomendacoes_imediatas.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recomendacao.produtos_recomendados && recomendacao.produtos_recomendados.length > 0 && (
                        <div>
                          <h6 className="font-medium text-green-800 dark:text-green-100 mb-2">
                            Produtos Recomendados:
                          </h6>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-200">
                            {recomendacao.produtos_recomendados.map((produto, index) => (
                              <li key={index}>{produto}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Histórico Recente */}
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100 mb-4">
                📋 Detecções Recentes
              </h3>
              {historico.length > 0 ? (
                <div className="space-y-3">
                  {historico.map((deteccao) => (
                    <div key={deteccao.id} className="p-3 bg-green-50 dark:bg-green-700 rounded-md">
                      <div className="font-medium text-green-800 dark:text-green-100 text-sm">
                        {deteccao.praga_detectada.nome}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-200">
                        {deteccao.cultura} • {formatDate(deteccao.data_deteccao)}
                      </div>
                      <div className="text-xs text-green-500 dark:text-green-300">
                        Confiança: {Math.round(deteccao.confianca * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 dark:text-green-200 text-sm">
                  Nenhuma detecção realizada ainda
                </p>
              )}
            </div>

            {/* Pragas Comuns */}
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-100 mb-4">
                🐛 Pragas Comuns
              </h3>
              <div className="space-y-3">
                {pragasComuns.map((praga) => (
                  <div key={praga.id} className="p-3 bg-green-50 dark:bg-green-700 rounded-md">
                    <div className="font-medium text-green-800 dark:text-green-100 text-sm">
                      {praga.nome}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-200">
                      {praga.culturas_afetadas && praga.culturas_afetadas.length > 0 
                        ? praga.culturas_afetadas.slice(0, 3).join(', ')
                        : 'Culturas não especificadas'
                      }
                    </div>
                    <div className={`text-xs mt-1 ${getSeverityColor(praga.nivel_dano)}`}>
                      Nível: {praga.nivel_dano || 'Não definido'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
