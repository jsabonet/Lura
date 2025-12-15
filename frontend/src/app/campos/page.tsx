'use client';
import { useEffect, useState } from 'react';
import { Plus, MapPin, TrendingUp, Sprout } from 'lucide-react';
import Link from 'next/link';
import { getProjects } from '@/services/projectService';

export default function CamposPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    getProjects(token)
      .then(setProjects)
      .catch((error) => {
        console.error('Error loading projects:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Mock data para desenvolvimento sem auth
  const mockProjects = [
    {
      id: 1,
      nome: 'Milho 2025',
      cultura: 'Milho',
      area_hectares: 5,
      foto_capa: null,
      dashboard: {
        progresso_percent: 45,
        saude_score: 85,
        dias_restantes: 45,
        fase_atual: 'vegetativo',
        proxima_atividade: 'Aplicação de fertilizante',
        data_proxima_atividade: '2025-02-01',
        total_custos: 2500.00,
        custos_mes_atual: 450.00,
        ultima_atualizacao: '2025-01-25T10:30:00Z',
      },
    },
    {
      id: 2,
      nome: 'Tomate Orgânico',
      cultura: 'Tomate',
      area_hectares: 2,
      foto_capa: null,
      dashboard: {
        progresso_percent: 75,
        saude_score: 92,
        dias_restantes: 12,
        fase_atual: 'frutificacao',
        proxima_atividade: 'Colheita parcial',
        data_proxima_atividade: '2025-01-28',
        total_custos: 1800.00,
        custos_mes_atual: 320.00,
        ultima_atualizacao: '2025-01-26T08:15:00Z',
      },
    },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;
  const totalArea = displayProjects.reduce((sum, p) => sum + p.area_hectares, 0);

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
            <p className="text-white text-2xl font-bold">{displayProjects.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">Área Total</p>
            <p className="text-white text-2xl font-bold">{totalArea} ha</p>
          </div>
        </div>
      </div>

      <div className="px-4">
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A86B]"></div>
        </div>
      ) : displayProjects.length === 0 ? (
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
          {displayProjects.map((project: any) => (
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
