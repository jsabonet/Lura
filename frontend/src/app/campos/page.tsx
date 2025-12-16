'use client';
import { useEffect, useState } from 'react';
import { Plus, MapPin, TrendingUp, Sprout } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getProjects } from '@/services/projectService';

function CamposContent() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🚀 CamposContent - useEffect executado');
    const token = localStorage.getItem('access_token');
    console.log('🔑 Token encontrado:', token ? `Sim (${token.substring(0, 20)}...)` : 'Não');
    
    if (!token) {
      console.log('❌ Token não encontrado - usuário não autenticado');
      setLoading(false);
      return;
    }
    
    console.log('🔍 Chamando getProjects...');
    getProjects(token)
      .then((data) => {
        console.log('✅ Callback then() - Projetos recebidos:', data);
        console.log('� Setando projetos. Total:', data.length);
        setProjects(data);
      })
      .catch((error) => {
        console.error('❌ Callback catch() - Erro ao carregar projetos:', error);
        setError('Erro ao carregar projetos. Tente novamente.');
      })
      .finally(() => {
        console.log('🏁 finally() - Loading concluído');
        setLoading(false);
      });
  }, []);

  const totalArea = projects.reduce((sum, p) => sum + (parseFloat(p.area_hectares) || 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#1B2735] to-[#203A43] pb-24">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#00A86B]/20 via-transparent to-[#F2C94C]/10 px-4 pt-8 pb-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Meus Campos</h1>
            <p className="text-white/60 text-sm">Gerencie suas plantações</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
            <Sprout size={28} className="text-[#00A86B]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Stats Rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Total de Campos</p>
            <p className="text-white text-2xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Área Total</p>
            <p className="text-white text-2xl font-bold">{totalArea.toFixed(1)} ha</p>
          </div>
        </div>
      </div>

      <div className="px-4">
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A86B]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-500/10 backdrop-blur rounded-full p-6 mb-4">
            <p className="text-red-400 text-4xl">⚠️</p>
          </div>
          <p className="text-white/70 text-center mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white px-6 py-3 rounded-xl font-bold"
          >
            Tentar Novamente
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-white/5 backdrop-blur rounded-full p-6 mb-4">
            <Plus size={48} className="text-[#00A86B]" strokeWidth={2} />
          </div>
          <p className="text-white/70 text-center mb-6">
            Você ainda não tem nenhum campo cadastrado.<br />
            Comece criando seu primeiro projeto!
          </p>
          <Link href="/novo-projeto">
            <button className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white px-6 py-3 rounded-xl font-bold">
              + Criar Primeiro Campo
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/campos/${project.id}`}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden hover:scale-[1.02] hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00A86B]/30 shadow-xl hover:shadow-2xl">
                {project.foto_capa ? (
                  <img src={project.foto_capa} className="w-full h-40 object-cover" alt={project.nome} />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-[#00A86B]/10 to-[#3BB273]/10 flex items-center justify-center border-b border-white/10">
                    <Sprout size={48} className="text-[#00A86B]/40" strokeWidth={2} />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{project.nome}</h3>
                      <p className="text-white/60 text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#00A86B]" />
                        {project.cultura} • {project.area_hectares} ha
                      </p>
                    </div>
                    {project.dashboard?.saude_score && (
                      <div className="bg-[#00A86B]/20 rounded-lg px-3 py-1">
                        <span className="text-[#00A86B] text-xs font-bold">Saúde: {project.dashboard.saude_score}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-xs font-medium">Progresso</span>
                      <span className="text-white text-sm font-bold">
                        {project.dashboard?.progresso_percent ?? project.progresso_percent ?? 0}%
                      </span>
                    </div>
                    <div className="bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${project.dashboard?.progresso_percent ?? project.progresso_percent ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-white/50 text-xs">
                      🌱 {project.dashboard?.dias_restantes ?? project.dias_restantes ?? 0} dias até colheita
                    </p>
                    <TrendingUp size={16} className="text-[#00A86B]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      
      <Link href="/novo-projeto">
        <button className="fixed bottom-24 right-4 w-16 h-16 bg-gradient-to-br from-[#F2C94C] to-[#F2A94C] rounded-2xl shadow-2xl shadow-[#F2C94C]/50 flex items-center justify-center hover:scale-110 transition-all duration-300 z-40 border-4 border-[#0F2027]">
          <Plus size={32} className="text-[#0F2027]" strokeWidth={3} />
        </button>
      </Link>
    </main>
  );
}

export default function CamposPage() {
  return (
    <ProtectedRoute>
      <CamposContent />
    </ProtectedRoute>
  );
}
