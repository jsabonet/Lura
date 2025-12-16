'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Bell, Moon, Globe, LogOut, Shield, Sprout } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getProjects } from '@/services/projectService';
import type { Project } from '@/types/project';

function PerfilPageContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dados');
  const [projects, setProjects] = useState<Project[]>([]);
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

  const userData = {
    nome: user?.first_name || 'João',
    sobrenome: user?.last_name || 'Agricultor',
    email: user?.email || 'joao@example.com',
    username: user?.username || 'usuario',
    telefone: user?.telefone || '+258 84 123 4567',
    localizacao: user?.localizacao || 'Maputo, Moçambique',
    plano: 'Gratuito',
    totalProjetos: projects.length,
    areaTotal: projects.reduce((acc, p) => acc + (p.area_hectares || 0), 0),
  };

  const [settings, setSettings] = useState({
    notificacoes_sms: true,
    notificacoes_email: false,
    modo_escuro: true,
    idioma: 'pt',
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] via-[#1B2735] to-[#203A43] pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header com Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00A86B]/20 via-transparent to-[#F2C94C]/10 px-4 pt-8 pb-6 mb-6">
          <button
            onClick={() => router.back()}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-2.5 hover:bg-white/20 transition-all duration-300 mb-4 border border-white/20"
          >
            <ArrowLeft size={22} className="text-white" strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">Perfil</h1>
          <p className="text-white/60 text-sm">Gerencie sua conta</p>
        </div>

        <div className="px-4">
        {/* Avatar e Info Básica */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 text-center border border-white/10 shadow-xl">
          <div className="w-28 h-28 bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00A86B]/30">
            <span className="text-white text-4xl font-bold">
              {userData.nome[0]}{userData.sobrenome[0]}
            </span>
          </div>
          <h2 className="text-white text-2xl font-bold mb-1.5">
            {userData.nome} {userData.sobrenome}
          </h2>
          <p className="text-white/60 text-sm mb-4">@{userData.username}</p>
          <p className="text-white/50 text-xs mb-4">{userData.email}</p>
          <div className="inline-block bg-gradient-to-r from-[#F2C94C]/20 to-[#F2C94C]/10 px-4 py-2 rounded-xl border border-[#F2C94C]/30 mb-6">
            <span className="text-[#F2C94C] text-sm font-bold">✨ Plano {userData.plano}</span>
          </div>

          {/* Estatísticas do Usuário */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sprout size={16} className="text-[#00A86B]" />
                <span className="text-white text-2xl font-bold">{userData.totalProjetos}</span>
              </div>
              <p className="text-white/60 text-xs">Projetos Ativos</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin size={16} className="text-[#00A86B]" />
                <span className="text-white text-2xl font-bold">{userData.areaTotal.toFixed(1)}</span>
              </div>
              <p className="text-white/60 text-xs">Hectares Totais</p>
            </div>
          </div>
        </div>

        {/* Tabs de Seção */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'dados', label: 'Dados Pessoais', icon: User },
            { id: 'config', label: 'Configurações', icon: Bell },
            { id: 'plano', label: 'Plano', icon: Shield },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 border border-white/10'
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Seções */}
        <div className="space-y-4">
          {/* Dados Pessoais */}
          {activeSection === 'dados' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#00A86B]/20 rounded-lg p-2">
                    <User size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Nome Completo</span>
                </div>
                <p className="text-white font-bold text-lg">
                  {userData.nome} {userData.sobrenome}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#00A86B]/20 rounded-lg p-2">
                    <Mail size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Email</span>
                </div>
                <p className="text-white font-bold text-lg">{userData.email}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#00A86B]/20 rounded-lg p-2">
                    <Phone size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Telefone</span>
                </div>
                <p className="text-white font-bold text-lg">{userData.telefone}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#00A86B]/20 rounded-lg p-2">
                    <MapPin size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                  </div>
                  <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Localização</span>
                </div>
                <p className="text-white font-bold text-lg">{userData.localizacao}</p>
              </div>

              <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg">
                Editar Dados
              </button>
            </div>
          )}

          {/* Configurações */}
          {activeSection === 'config' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00A86B]/20 rounded-lg p-2">
                      <Bell size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Alertas SMS</p>
                      <p className="text-white/50 text-xs">Receber alertas climáticos via SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.notificacoes_sms}
                      onChange={(e) =>
                        setSettings({ ...settings, notificacoes_sms: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-white/20 rounded-full peer-checked:bg-[#00A86B] transition-colors">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00A86B]/20 rounded-lg p-2">
                      <Mail size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Notificações Email</p>
                      <p className="text-white/50 text-xs">Receber resumos semanais</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.notificacoes_email}
                      onChange={(e) =>
                        setSettings({ ...settings, notificacoes_email: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-white/20 rounded-full peer-checked:bg-[#00A86B] transition-colors">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00A86B]/20 rounded-lg p-2">
                      <Moon size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Modo Escuro</p>
                      <p className="text-white/50 text-xs">Interface com fundo escuro</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.modo_escuro}
                      onChange={(e) =>
                        setSettings({ ...settings, modo_escuro: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-white/20 rounded-full peer-checked:bg-[#00A86B] transition-colors">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#00A86B]/20 rounded-lg p-2">
                    <Globe size={20} className="text-[#00A86B]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Idioma</p>
                    <p className="text-white/50 text-xs">Idioma do aplicativo</p>
                  </div>
                </div>
                <select
                  value={settings.idioma}
                  onChange={(e) => setSettings({ ...settings, idioma: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
                >
                  <option value="pt" className="bg-[#1B2735]">Português</option>
                  <option value="en" className="bg-[#1B2735]">English</option>
                </select>
              </div>
            </div>
          )}

          {/* Plano */}
          {activeSection === 'plano' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-[#00A86B]/10 to-[#3BB273]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00A86B]/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-xl p-2.5">
                    <Shield size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-white font-bold text-xl">Plano Atual</h3>
                </div>
                <p className="text-white text-3xl font-bold mb-4">{userData.plano}</p>
                <ul className="space-y-2.5 text-sm text-white/70 mb-6">
                  <li className="flex items-center gap-2">✓ 1 Projeto simultâneo</li>
                  <li className="flex items-center gap-2">✓ Alertas básicos</li>
                  <li className="flex items-center gap-2">✓ IA para detecção de pragas</li>
                  <li className="flex items-center gap-2">✓ Clima em tempo real</li>
                </ul>
              </div>

              <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl">
                ✨ Fazer Upgrade para Pro
              </button>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 text-center border border-white/10">
                <p className="text-white/60 text-sm">
                  Com o plano Pro você desbloqueia projetos ilimitados, alertas SMS, marketplace e muito mais!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/20 text-red-400 rounded-xl p-4 font-bold mt-6 flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          <LogOut size={20} strokeWidth={2.5} />
          Sair da Conta
        </button>
        </div>
      </div>
    </main>
  );
}

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilPageContent />
    </ProtectedRoute>
  );
}
