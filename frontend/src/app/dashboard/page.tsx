'use client';

import { useEffect, useState } from 'react';
import WeatherWidget from '@/components/home/WeatherWidget';
import TaskChecklist from '@/components/home/TaskChecklist';
import AlertsCard from '@/components/home/AlertsCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Sprout, TrendingUp, Droplets, Calendar } from 'lucide-react';
import { getProjects } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { useWeather } from '@/hooks/useWeather';
import type { Project } from '@/types/project';

function DashboardContent() {
  const { user } = useAuth();
  const { weatherData } = useWeather();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No access token found');
      setLoading(false);
      return;
    }

    console.log('Loading projects with token...');
    getProjects(token)
      .then((data) => {
        console.log('Projects loaded:', data);
        console.log('Is array?', Array.isArray(data));
        console.log('Type:', typeof data);
        // Garantir que sempre seja um array
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error loading projects:', error);
        setProjects([]); // Garantir array vazio em caso de erro
      })
      .finally(() => setLoading(false));
  }, []);

  // Calcular estatísticas reais dos projetos - SEM valores mock
  const projetosAtivos = projects.length;
  const diasProximaColheita = projects.length > 0
    ? Math.min(...projects.map(p => p.dashboard?.dias_restantes ?? 0))
    : null;
  const saudeMedia = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.dashboard?.saude_score ?? 0), 0) / projects.length)
    : null;

  // Nome real do usuário: prioriza "Nome Sobrenome", depois username, depois email
  const usuarioNome = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : (user?.first_name || user?.username || user?.email || 'Bem-vindo');

  // Construir stats apenas com dados reais disponíveis
  const stats = [
    { label: 'Projetos Ativos', value: String(projetosAtivos), icon: Sprout, color: 'from-[#00A86B] to-[#3BB273]', show: true },
    ...(saudeMedia !== null ? [{ label: 'Saúde Média', value: `${saudeMedia}%`, icon: TrendingUp, color: 'from-[#F2C94C] to-[#F2A94C]', show: true }] : []),
    ...(diasProximaColheita !== null ? [{ label: 'Dias até Colheita', value: String(diasProximaColheita), icon: Calendar, color: 'from-[#00A86B]/80 to-[#00A86B]', show: true }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#1B2735] to-[#203A43] text-white pb-24 pt-0">
      {/* Hero Header com Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A86B]/20 via-transparent to-[#F2C94C]/10 pointer-events-none" />
        <div className="relative px-4 pt-8 pb-6">
          {/* Saudação Premium */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00A86B]/30">
                <Sprout size={32} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white/50 text-sm font-medium">Bem-vindo de volta</p>
                <h1 className="text-white text-3xl font-bold tracking-tight">{usuarioNome}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[#00A86B] text-sm font-medium">Agricultor Inteligente</p>
                  {projects.length > 0 && (
                    <span className="text-xs bg-[#00A86B]/20 text-[#00A86B] px-2 py-0.5 rounded-full border border-[#00A86B]/30">
                      {projects.length} {projects.length === 1 ? 'Projeto' : 'Projetos'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Métricas Rápidas */}
          {stats.length > 0 ? (
            <div className={`grid gap-3 mb-6 ${stats.length === 3 ? 'grid-cols-3' : stats.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-white/60 text-xs mb-0.5">{stat.label}</p>
                    <p className="text-white text-xl font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Mensagem quando não há projetos */}
          {projetosAtivos === 0 && !loading && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6 text-center">
              <div className="bg-[#00A86B]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sprout size={32} className="text-[#00A86B]" strokeWidth={2} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Comece sua Jornada</h3>
              <p className="text-white/60 text-sm mb-4">
                Você ainda não tem projetos. Crie seu primeiro campo para começar!
              </p>
              <a 
                href="/novo-projeto"
                className="inline-block bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
              >
                + Criar Primeiro Projeto
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Feed de Conteúdo com Espaçamento Profissional */}
      <div className="px-4 space-y-5">
        {/* Seção: Condições Climáticas */}
        <div>
          <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Droplets size={16} className="text-[#00A86B]" />
            Condições Climáticas
          </h2>
          <WeatherWidget />
        </div>

        {/* Seção: Tarefas Prioritárias */}
        <div>
          <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-[#F2C94C]" />
            Tarefas Prioritárias
          </h2>
          <TaskChecklist projects={Array.isArray(projects) ? projects : []} loading={loading} />
        </div>

        {/* Seção: Alertas e Insights */}
        <div>
          <h2 className="text-white/90 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00A86B]" />
            Alertas e Insights
          </h2>
          <AlertsCard 
            projects={Array.isArray(projects) ? projects : []} 
            weatherData={weatherData}
            loading={loading} 
          />
        </div>

        {/* CTA Bottom - Ação Rápida */}
        <div className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] rounded-2xl p-6 text-center shadow-xl shadow-[#00A86B]/20">
          <h3 className="text-white font-bold text-lg mb-2">Maximize sua Produção</h3>
          <p className="text-white/80 text-sm mb-4">
            Converse com a Lura IA para recomendações personalizadas
          </p>
          <button className="bg-white text-[#00A86B] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105">
            Iniciar Conversa
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
