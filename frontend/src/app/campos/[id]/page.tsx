'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Camera, DollarSign } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getProjectDashboard, createActivity, createCost, uploadFieldPhoto } from '@/services/projectService';
import AdicionarAtividadeModal from '@/components/modals/AdicionarAtividadeModal';
import AdicionarCustoModal from '@/components/modals/AdicionarCustoModal';
import AdicionarFotoModal from '@/components/modals/AdicionarFotoModal';

function CampoDashboardContent() {
  // Tipar e normalizar o parâmetro id para evitar null
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('geral');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados dos modais
  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [showCustoModal, setShowCustoModal] = useState(false);
  const [showFotoModal, setShowFotoModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID do projeto não encontrado');
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ Token não encontrado - redirecionando para login');
      router.push('/login');
      return;
    }
    
    console.log('🔍 Buscando dashboard do projeto:', id);
    getProjectDashboard(id, token)
      .then((responseData) => {
        console.log('✅ Dashboard carregado:', responseData);
        console.log('📊 Alertas disponíveis:', responseData.dashboard?.alertas_json);
        console.log('📸 Atividades recentes:', responseData.atividades_recentes?.length);
        console.log('💰 Custos:', responseData.custos?.length);
        setData(responseData);
      })
      .catch((error) => {
        console.error('❌ Erro ao carregar dashboard:', error);
        setError('Erro ao carregar dados do projeto. Tente novamente.');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  // Função para recarregar dados
  const reloadData = async () => {
    if (!id) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const responseData = await getProjectDashboard(id, token);
      setData(responseData);
      console.log('♻️ Dados recarregados');
    } catch (error) {
      console.error('❌ Erro ao recarregar dados:', error);
    }
  };

  // Handlers dos modais
  const handleAddAtividade = async (formData: any) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token não encontrado');
    
    await createActivity(formData, token);
    await reloadData();
  };

  const handleAddCusto = async (formData: any) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token não encontrado');
    
    await createCost(formData, token);
    await reloadData();
  };

  const handleAddFoto = async (formData: FormData) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token não encontrado');
    
    await uploadFieldPhoto(formData, token);
    await reloadData();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00A86B]"></div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">{error || 'Projeto não encontrado'}</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white px-6 py-3 rounded-xl font-bold"
          >
            Voltar
          </button>
        </div>
      </main>
    );
  }

  const totalOrcado = data.custos?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor_orcado) || 0), 0) || 0;
  const totalReal = data.custos?.reduce((sum: number, c: any) => sum + (parseFloat(c.valor_real) || 0), 0) || 0;
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
              {data.dashboard?.alertas_json && data.dashboard.alertas_json.length > 0 ? (
                <div className="space-y-2">
                  {data.dashboard.alertas_json.map((alerta: any, index: number) => (
                    <div key={index} className="bg-[#F2C94C]/20 rounded-lg p-3 border border-[#F2C94C]/30">
                      <p className="text-white text-sm">
                        {alerta.icone || '⚠️'} {alerta.mensagem || alerta.message || alerta}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/50 text-sm">Nenhum alerta no momento</p>
                  <p className="text-white/30 text-xs mt-1">✅ Tudo está sob controle</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tab Diário */}
        {activeTab === 'diario' && (
          <div className="space-y-3">
            {data.atividades_recentes && data.atividades_recentes.length > 0 ? (
              data.atividades_recentes.map((ativ: any) => (
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
            ))
            ) : (
              <div className="bg-white/5 backdrop-blur rounded-xl p-8 text-center">
                <Calendar size={48} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-2">Nenhuma atividade registrada</p>
                <p className="text-white/40 text-sm">Comece registrando sua primeira atividade</p>
              </div>
            )}
            
            <button 
              onClick={() => setShowAtividadeModal(true)}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold mt-4 hover:opacity-90 transition-opacity"
            >
              + Adicionar Atividade
            </button>
          </div>
        )}
        
        {/* Tab Galeria */}
        {activeTab === 'galeria' && (
          <div>
            {data.atividades_recentes?.some((ativ: any) => ativ.fotos && ativ.fotos.length > 0) ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {data.atividades_recentes
                    .filter((ativ: any) => ativ.fotos && ativ.fotos.length > 0)
                    .flatMap((ativ: any) => ativ.fotos)
                    .map((foto: any, index: number) => (
                      <div key={index} className="aspect-square bg-white/5 backdrop-blur rounded-xl overflow-hidden">
                        <img 
                          src={foto.imagem} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  }
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur rounded-xl p-8 text-center mb-4">
                <Camera size={48} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-2">Nenhuma foto registrada</p>
                <p className="text-white/40 text-sm">Adicione fotos do seu campo para acompanhar o desenvolvimento</p>
              </div>
            )}
            <button 
              onClick={() => setShowFotoModal(true)}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold hover:opacity-90 transition-opacity"
            >
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
                  <span className="text-white font-bold">{totalOrcado.toFixed(2)} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Gasto Real:</span>
                  <span className="text-white font-bold">{totalReal.toFixed(2)} MT</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20">
                  <span className="text-white/70">Variação:</span>
                  <span className={`font-bold ${variacao > 0 ? 'text-red-400' : 'text-[#00A86B]'}`}>
                    {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {data.custos && data.custos.length > 0 ? (
              <div className="space-y-2">
                {data.custos.map((custo: any) => (
                <div key={custo.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{custo.descricao}</p>
                      <p className="text-white/50 text-xs">{custo.categoria}</p>
                    </div>
                    <span className={`font-bold ${parseFloat(custo.valor_real) > parseFloat(custo.valor_orcado) ? 'text-red-400' : 'text-[#00A86B]'}`}>
                      {parseFloat(custo.valor_real).toFixed(2)} MT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Orçado: {parseFloat(custo.valor_orcado).toFixed(2)} MT</span>
                    <span>•</span>
                    <span className={parseFloat(custo.valor_real) > parseFloat(custo.valor_orcado) ? 'text-red-400' : 'text-[#00A86B]'}>
                      {parseFloat(custo.valor_real) > parseFloat(custo.valor_orcado) ? 'Acima' : 'Dentro'} do orçamento
                    </span>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur rounded-xl p-8 text-center">
                <DollarSign size={48} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-2">Nenhum custo registrado</p>
                <p className="text-white/40 text-sm">Comece registrando seus custos para controle financeiro</p>
              </div>
            )}
            
            <button 
              onClick={() => setShowCustoModal(true)}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold hover:opacity-90 transition-opacity mt-4"
            >
              + Adicionar Custo
            </button>
          </div>
        )}
      </div>

      {/* Modais */}
      <AdicionarAtividadeModal
        isOpen={showAtividadeModal}
        onClose={() => setShowAtividadeModal(false)}
        onSubmit={handleAddAtividade}
        projectId={id || ''}
      />
      
      <AdicionarCustoModal
        isOpen={showCustoModal}
        onClose={() => setShowCustoModal(false)}
        onSubmit={handleAddCusto}
        projectId={id || ''}
      />
      
      <AdicionarFotoModal
        isOpen={showFotoModal}
        onClose={() => setShowFotoModal(false)}
        onSubmit={handleAddFoto}
        projectId={id || ''}
      />
    </main>
  );
}

export default function CampoDashboard() {
  return (
    <ProtectedRoute>
      <CampoDashboardContent />
    </ProtectedRoute>
  );
}
