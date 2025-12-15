'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { createProject } from '@/services/projectService';

export default function NovoProjetoWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cultura: '',
    area_hectares: '',
    orcamento_total: '',
    data_plantio: '',
  });

  const culturas = [
    { id: 'milho', nome: 'Milho', icon: '🌽', desc: 'Ciclo 120-150 dias' },
    { id: 'tomate', nome: 'Tomate', icon: '🍅', desc: 'Ciclo 90-120 dias' },
    { id: 'feijao', nome: 'Feijão', icon: '🫘', desc: 'Ciclo 70-90 dias' },
    { id: 'mandioca', nome: 'Mandioca', icon: '🥔', desc: 'Ciclo 12-18 meses' },
    { id: 'batata', nome: 'Batata-Doce', icon: '🍠', desc: 'Ciclo 4-6 meses' },
    { id: 'repolho', nome: 'Repolho', icon: '🥬', desc: 'Ciclo 70-100 dias' },
  ];

  const calcularDataColheita = (dataPlantio: string, cultura: string): string => {
    const data = new Date(dataPlantio);
    const diasCiclo: { [key: string]: number } = {
      'Milho': 135,
      'Tomate': 105,
      'Feijão': 80,
      'Mandioca': 450,
      'Batata-Doce': 150,
      'Repolho': 85,
    };
    data.setDate(data.getDate() + (diasCiclo[cultura] || 120));
    return data.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('access_token');
      
      const projectData = {
        nome: `${formData.cultura} ${new Date().getFullYear()}`,
        cultura: formData.cultura,
        area_hectares: parseFloat(formData.area_hectares),
        orcamento_total: parseFloat(formData.orcamento_total),
        data_plantio: formData.data_plantio,
        data_colheita_estimada: calcularDataColheita(formData.data_plantio, formData.cultura),
        status: 'planejamento',
      };

      if (token) {
        const project = await createProject(projectData, token);
        router.push(`/campos/${project.id}`);
      } else {
        // Sem token: redirecionar para campos com mock data
        console.log('Projeto criado (mock):', projectData);
        router.push('/campos');
      }
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
      setError('Erro ao criar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.cultura !== '';
      case 2:
        return formData.area_hectares !== '' && parseFloat(formData.area_hectares) > 0;
      case 3:
        return formData.orcamento_total !== '' && parseFloat(formData.orcamento_total) > 0;
      case 4:
        return formData.data_plantio !== '';
      default:
        return false;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-24">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="bg-white/10 backdrop-blur rounded-lg p-2 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Novo Plantio</h1>
            <p className="text-white/50 text-sm">Passo {step} de 4</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-[#00A86B] to-[#3BB273]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        
        {/* Step 1: Cultura */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-white text-xl font-bold mb-2">O que vai plantar?</h2>
            <p className="text-white/70 text-sm mb-6">Escolha a cultura principal desta área</p>
            <div className="grid grid-cols-2 gap-3">
              {culturas.map((cult) => (
                <button
                  key={cult.id}
                  onClick={() => {
                    setFormData({ ...formData, cultura: cult.nome });
                    setTimeout(() => setStep(2), 300);
                  }}
                  className={`bg-white/10 backdrop-blur rounded-xl p-4 text-left hover:bg-white/20 transition-all ${
                    formData.cultura === cult.nome ? 'ring-2 ring-[#00A86B]' : ''
                  }`}
                >
                  <span className="text-4xl mb-2 block">{cult.icon}</span>
                  <span className="text-white font-bold block">{cult.nome}</span>
                  <span className="text-white/50 text-xs">{cult.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 2: Área */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-white text-xl font-bold mb-2">Tamanho da área?</h2>
            <p className="text-white/70 text-sm mb-6">Informe a área total em hectares</p>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 5.5"
              value={formData.area_hectares}
              onChange={(e) => setFormData({ ...formData, area_hectares: e.target.value })}
              className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-xl p-4 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#00A86B] transition-all"
              autoFocus
            />
            <div className="bg-[#00A86B]/20 rounded-lg p-3 mb-4">
              <p className="text-white/70 text-sm">
                💡 <strong>Dica:</strong> 1 hectare = 10.000 m²
              </p>
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceed()}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Próximo
              <ArrowRight size={20} />
            </button>
          </div>
        )}
        
        {/* Step 3: Orçamento */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-white text-xl font-bold mb-2">Quanto vai investir?</h2>
            <p className="text-white/70 text-sm mb-6">Defina o orçamento total para este plantio</p>
            <div className="relative mb-4">
              <input
                type="number"
                step="100"
                placeholder="Ex: 15000"
                value={formData.orcamento_total}
                onChange={(e) => setFormData({ ...formData, orcamento_total: e.target.value })}
                className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-xl p-4 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-[#00A86B] transition-all"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 font-medium">
                MT
              </span>
            </div>
            <div className="bg-[#F2C94C]/20 rounded-lg p-3 mb-4">
              <p className="text-white/70 text-sm">
                💰 Inclua sementes, fertilizantes, mão de obra e outros custos
              </p>
            </div>
            <button
              onClick={() => setStep(4)}
              disabled={!canProceed()}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Próximo
              <ArrowRight size={20} />
            </button>
          </div>
        )}
        
        {/* Step 4: Data Plantio */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <h2 className="text-white text-xl font-bold mb-2">Quando vai plantar?</h2>
            <p className="text-white/70 text-sm mb-6">Escolha a data prevista para o plantio</p>
            <input
              type="date"
              value={formData.data_plantio}
              onChange={(e) => setFormData({ ...formData, data_plantio: e.target.value })}
              className="w-full bg-white/10 text-white rounded-xl p-4 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#00A86B] transition-all"
              autoFocus
            />
            
            {/* Resumo */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
              <h3 className="text-white font-bold mb-3">Resumo do Projeto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Cultura:</span>
                  <span className="text-white font-medium">{formData.cultura}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Área:</span>
                  <span className="text-white font-medium">{formData.area_hectares} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Orçamento:</span>
                  <span className="text-white font-medium">{formData.orcamento_total} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Data Plantio:</span>
                  <span className="text-white font-medium">
                    {formData.data_plantio ? new Date(formData.data_plantio).toLocaleDateString('pt-MZ') : '-'}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Criar Projeto
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
