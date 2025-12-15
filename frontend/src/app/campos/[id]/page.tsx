'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Camera, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { getProjectDashboard } from '@/services/projectService';

export default function CampoDashboard() {
  // Tipar e normalizar o parâmetro id para evitar null
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('geral');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Mock data para desenvolvimento sem auth
      setData(mockData);
      setLoading(false);
      return;
    }
    
    getProjectDashboard(id, token)
      .then(setData)
      .catch((error) => {
        console.error('Error loading dashboard:', error);
        setData(mockData); // Fallback to mock on error
      })
      .finally(() => setLoading(false));
  }, [id]);
  
  // Mock data para desenvolvimento
  const mockData = {
    project: {
      id: id || '1',
      nome: 'Milho 2025',
      cultura: 'Milho',
      area_hectares: 5,
      data_plantio: '2025-01-15',
      data_colheita_estimada: '2025-06-15',
    },
    dashboard: {
      fase_atual: 'Vegetativo',
      progresso_percent: 45,
      dias_decorridos: 45,
      dias_restantes: 90,
      saude_score: 85,
      rendimento_estimado: 12500,
    },
    atividades_recentes: [
      {
        id: 1,
        tipo: 'Adubação',
        descricao: 'Aplicação de ureia - 200kg',
        data: '2025-12-03',
        custo: 850,
      },
      {
        id: 2,
        tipo: 'Inspeção',
        descricao: 'Verificação de pragas - tudo normal',
        data: '2025-12-01',
        custo: 0,
      },
      {
        id: 3,
        tipo: 'Irrigação',
        descricao: 'Sistema de gotejamento - 3 horas',
        data: '2025-11-28',
        custo: 150,
      },
    ],
    custos: [
      {
        id: 1,
        descricao: 'Sementes',
        valor_orcado: 1200,
        valor_real: 1200,
        categoria: 'Insumos',
      },
      {
        id: 2,
        descricao: 'Fertilizantes',
        valor_orcado: 2000,
        valor_real: 2150,
        categoria: 'Insumos',
      },
      {
        id: 3,
        descricao: 'Mão de obra',
        valor_orcado: 3000,
        valor_real: 2800,
        categoria: 'Mão de Obra',
      },
    ],
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00A86B]"></div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Projeto não encontrado</p>
        </div>
      </main>
    );
  }

  const totalOrcado = data.custos?.reduce((sum: number, c: any) => sum + c.valor_orcado, 0) || 0;
  const totalReal = data.custos?.reduce((sum: number, c: any) => sum + c.valor_real, 0) || 0;
  const variacao = totalOrcado > 0 ? ((totalReal - totalOrcado) / totalOrcado) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-24">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="bg-white/10 backdrop-blur rounded-lg p-2 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{data.project.nome}</h1>
          <p className="text-[#F2C94C]">{data.project.cultura} - {data.project.area_hectares} ha</p>
        </div>
      </div>
      
      {/* Card de Progresso */}
      <div className="bg-gradient-to-br from-[#00A86B]/20 to-[#3BB273]/20 backdrop-blur rounded-xl p-4 mb-6 border border-[#00A86B]/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Fase: {data.dashboard.fase_atual}</span>
          <span className="text-[#F2C94C] font-bold text-lg">{data.dashboard.progresso_percent}%</span>
        </div>
        <div className="bg-white/20 rounded-full h-3 mb-3">
          <div 
            className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] h-3 rounded-full transition-all duration-500"
            style={{ width: `${data.dashboard.progresso_percent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#00A86B]" />
            <span className="text-white/70">{data.dashboard.dias_restantes} dias restantes</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00A86B]" />
            <span className="text-white/70">{data.dashboard.rendimento_estimado} kg estimado</span>
          </div>
        </div>
      </div>
      
      {/* Tabs de Navegação */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'geral', label: 'Geral', icon: TrendingUp },
          { id: 'diario', label: 'Diário', icon: Calendar },
          { id: 'galeria', label: 'Galeria', icon: Camera },
          { id: 'custos', label: 'Custos', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#00A86B] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Conteúdo das Tabs */}
      <div className="space-y-4">
        {/* Tab Geral */}
        {activeTab === 'geral' && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Saúde da Lavoura</h3>
              <div className="flex items-end gap-4">
                <div className="text-5xl font-bold text-[#00A86B]">
                  {data.dashboard.saude_score}
                </div>
                <div className="flex-1">
                  <div className="text-white/70 text-sm mb-1">Score de Saúde</div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] h-2 rounded-full"
                      style={{ width: `${data.dashboard.saude_score}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-white/50 text-sm mt-3">
                Baseado em análise de imagens e dados climáticos
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-[#F2C94C]" />
                <h3 className="text-white font-bold">Alertas</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-[#F2C94C]/20 rounded-lg p-3 border border-[#F2C94C]/30">
                  <p className="text-white text-sm">
                    ☀️ Previsão de calor intenso nos próximos 3 dias. Considere irrigação extra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tab Diário */}
        {activeTab === 'diario' && (
          <div className="space-y-3">
            {data.atividades_recentes.map((ativ: any) => (
              <div key={ativ.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[#F2C94C] font-bold">{ativ.tipo}</span>
                    <p className="text-white text-sm mt-1">{ativ.descricao}</p>
                  </div>
                  <span className="text-white/50 text-xs">{ativ.data}</span>
                </div>
                {ativ.custo > 0 && (
                  <div className="text-white/70 text-sm mt-2">
                    Custo: {ativ.custo} MT
                  </div>
                )}
              </div>
            ))}
            
            <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold mt-4 hover:opacity-90 transition-opacity">
              + Adicionar Atividade
            </button>
          </div>
        )}
        
        {/* Tab Galeria */}
        {activeTab === 'galeria' && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white/5 backdrop-blur rounded-xl flex items-center justify-center">
                  <Camera size={32} className="text-white/30" />
                </div>
              ))}
            </div>
            <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold hover:opacity-90 transition-opacity">
              + Adicionar Foto
            </button>
          </div>
        )}
        
        {/* Tab Custos */}
        {activeTab === 'custos' && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">Resumo Financeiro</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Orçado Total:</span>
                  <span className="text-white font-bold">{totalOrcado} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Gasto Real:</span>
                  <span className="text-white font-bold">{totalReal} MT</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20">
                  <span className="text-white/70">Variação:</span>
                  <span className={`font-bold ${variacao > 0 ? 'text-red-400' : 'text-[#00A86B]'}`}>
                    {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {data.custos.map((custo: any) => (
                <div key={custo.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{custo.descricao}</p>
                      <p className="text-white/50 text-xs">{custo.categoria}</p>
                    </div>
                    <span className={`font-bold ${custo.valor_real > custo.valor_orcado ? 'text-red-400' : 'text-[#00A86B]'}`}>
                      {custo.valor_real} MT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Orçado: {custo.valor_orcado} MT</span>
                    <span>•</span>
                    <span className={custo.valor_real > custo.valor_orcado ? 'text-red-400' : 'text-[#00A86B]'}>
                      {custo.valor_real > custo.valor_orcado ? 'Acima' : 'Dentro'} do orçamento
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
