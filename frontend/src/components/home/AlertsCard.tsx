'use client';
import { AlertTriangle, Droplets, TrendingUp, Info, CloudRain, Wind, Thermometer, CloudSun } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Project } from '@/types/project';
import type { WeatherData } from '@/services/weatherService';

interface AlertsCardProps {
  projects: Project[];
  weatherData?: WeatherData | null;
  loading?: boolean;
}

export default function AlertsCard({ projects, weatherData, loading = false }: AlertsCardProps) {
  const [alertas, setAlertas] = useState<Array<{
    id: number;
    tipo: string;
    prioridade: string;
    titulo: string;
    descricao: string;
    icon: any;
    cor: string;
    bg: string;
    border: string;
  }>>([]);

  useEffect(() => {
    const allAlerts: any[] = [];

    // ALERTAS CLIMÁTICOS (sempre mostrar quando disponível)
    if (weatherData) {
      // Alerta de temperatura extrema
      if (weatherData.temperatura > 35) {
        allAlerts.push({
          id: 'clima-1',
          tipo: 'clima-extremo',
          prioridade: 'alta',
          titulo: `Temperatura elevada em ${weatherData.localizacao}`,
          descricao: `${weatherData.temperatura}°C - Risco de estresse térmico nas plantas. Aumente a irrigação e considere sombreamento.`,
          icon: Thermometer,
          cor: 'text-red-400',
          bg: 'bg-red-400/20',
          border: 'border-red-400/30',
        });
      } else if (weatherData.temperatura < 10) {
        allAlerts.push({
          id: 'clima-2',
          tipo: 'clima-frio',
          prioridade: 'alta',
          titulo: `Alerta de frio em ${weatherData.localizacao}`,
          descricao: `${weatherData.temperatura}°C - Proteja culturas sensíveis ao frio. Risco de geada.`,
          icon: Thermometer,
          cor: 'text-blue-400',
          bg: 'bg-blue-400/20',
          border: 'border-blue-400/30',
        });
      }

      // Alerta de umidade
      if (weatherData.umidade > 85) {
        allAlerts.push({
          id: 'clima-3',
          tipo: 'umidade-alta',
          prioridade: 'media',
          titulo: 'Umidade elevada',
          descricao: `${weatherData.umidade}% - Risco aumentado de doenças fúngicas. Monitore suas plantas de perto.`,
          icon: Droplets,
          cor: 'text-[#00A86B]',
          bg: 'bg-[#00A86B]/20',
          border: 'border-[#00A86B]/30',
        });
      } else if (weatherData.umidade < 30) {
        allAlerts.push({
          id: 'clima-4',
          tipo: 'umidade-baixa',
          prioridade: 'media',
          titulo: 'Umidade muito baixa',
          descricao: `${weatherData.umidade}% - Aumente a frequência de irrigação para evitar estresse hídrico.`,
          icon: Droplets,
          cor: 'text-[#F2C94C]',
          bg: 'bg-[#F2C94C]/20',
          border: 'border-[#F2C94C]/30',
        });
      }

      // Alerta de vento forte
      if (weatherData.vento > 40) {
        allAlerts.push({
          id: 'clima-5',
          tipo: 'vento-forte',
          prioridade: 'alta',
          titulo: 'Ventos fortes',
          descricao: `${weatherData.vento} km/h - Proteja plantas jovens e estruturas. Evite aplicação de defensivos.`,
          icon: Wind,
          cor: 'text-orange-400',
          bg: 'bg-orange-400/20',
          border: 'border-orange-400/30',
        });
      }

      // Alerta de chuva (se probabilidade alta)
      if (weatherData.chuva_probabilidade > 70) {
        allAlerts.push({
          id: 'clima-6',
          tipo: 'chuva-prevista',
          prioridade: 'media',
          titulo: 'Alta probabilidade de chuva',
          descricao: `${weatherData.chuva_probabilidade}% de chance - Ajuste programação de irrigação e aplicação de produtos.`,
          icon: CloudRain,
          cor: 'text-blue-400',
          bg: 'bg-blue-400/20',
          border: 'border-blue-400/30',
        });
      }

      // Insight de condições favoráveis
      if (weatherData.temperatura >= 20 && weatherData.temperatura <= 28 && 
          weatherData.umidade >= 50 && weatherData.umidade <= 70 && 
          weatherData.vento < 20) {
        allAlerts.push({
          id: 'clima-7',
          tipo: 'condicoes-ideais',
          prioridade: 'baixa',
          titulo: 'Condições climáticas favoráveis',
          descricao: `Temperatura ${weatherData.temperatura}°C, umidade ${weatherData.umidade}% - Momento ideal para plantio e aplicações.`,
          icon: CloudSun,
          cor: 'text-[#00A86B]',
          bg: 'bg-[#00A86B]/20',
          border: 'border-[#00A86B]/30',
        });
      }
    }

    // ALERTAS DE PROJETOS (se existirem)
    const projectAlerts = (projects || [])
      .filter(p => p.dashboard)
      .map((p, idx) => {
        const dashboard = p.dashboard!;
        
        // Alerta de colheita próxima
        if (dashboard.dias_restantes < 7) {
          return {
            id: `projeto-${idx}-1`,
            tipo: 'urgente',
            prioridade: 'alta',
            titulo: `Colheita próxima - ${p.nome}`,
            descricao: `Apenas ${dashboard.dias_restantes} dias até a colheita estimada. Prepare os equipamentos.`,
            icon: AlertTriangle,
            cor: 'text-red-400',
            bg: 'bg-red-400/20',
            border: 'border-red-400/30',
          };
        }
        
        // Alerta de saúde baixa
        if (dashboard.saude_score < 70) {
          return {
            id: `projeto-${idx}-2`,
            tipo: 'saude',
            prioridade: 'media',
            titulo: `Atenção à saúde - ${p.nome}`,
            descricao: `Score de saúde em ${dashboard.saude_score}%. Recomenda-se inspeção detalhada.`,
            icon: AlertTriangle,
            cor: 'text-[#F2C94C]',
            bg: 'bg-[#F2C94C]/20',
            border: 'border-[#F2C94C]/30',
          };
        }

        // Alerta de próxima atividade
        if (dashboard.proxima_atividade) {
          return {
            id: `projeto-${idx}-3`,
            tipo: 'atividade',
            prioridade: 'media',
            titulo: `Próxima atividade - ${p.nome}`,
            descricao: `${dashboard.proxima_atividade} agendada para ${dashboard.data_proxima_atividade || 'em breve'}.`,
            icon: Info,
            cor: 'text-[#00A86B]',
            bg: 'bg-[#00A86B]/20',
            border: 'border-[#00A86B]/30',
          };
        }

        return null;
      })
      .filter(Boolean);

    // Combinar alertas climáticos + projetos
    const combinedAlerts = [...allAlerts, ...projectAlerts];

    // Ordenar por prioridade: alta > media > baixa
    const priorityOrder = { alta: 1, media: 2, baixa: 3 };
    combinedAlerts.sort((a, b) => 
      (priorityOrder[a.prioridade as keyof typeof priorityOrder] || 3) - 
      (priorityOrder[b.prioridade as keyof typeof priorityOrder] || 3)
    );

    setAlertas(combinedAlerts);
  }, [projects, weatherData]);

  return (
    <div>
      {alertas.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
          <div className="bg-[#00A86B]/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} className="text-[#00A86B]" />
          </div>
          <p className="text-white/50 text-sm">
            Nenhum alerta no momento.<br />
            Crie projetos para receber insights!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map((alerta) => {
          const Icon = alerta.icon;
          return (
            <div
              key={alerta.id}
              className={`${alerta.bg} backdrop-blur-xl rounded-2xl p-4 border ${alerta.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`${alerta.bg} rounded-xl p-2.5 shrink-0 shadow-md`}>
                  <Icon size={22} className={alerta.cor} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm mb-1.5">{alerta.titulo}</h4>
                  <p className="text-white/60 text-xs leading-relaxed font-medium">{alerta.descricao}</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
