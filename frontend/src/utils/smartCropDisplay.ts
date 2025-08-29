// Sistema de Prioridade Inteligente para Culturas
// Define prioridades baseadas em critérios específicos

export interface CropPriority {
  national: number; // 1-5: Importância nacional (alimentar, econômica)
  beginner: number; // 1-5: Facilidade para iniciantes
  commercial: number; // 1-5: Potencial comercial
  subsistence: number; // 1-5: Valor para agricultura familiar
  climate: number; // 1-5: Adaptação às mudanças climáticas
}

export interface SmartDisplayConfig {
  priority: 'high' | 'medium' | 'low';
  showByDefault: boolean;
  targetAudience: 'beginner' | 'commercial' | 'subsistence' | 'all';
}

// Base de dados de prioridades inteligentes
export const CROP_PRIORITIES: Record<string, CropPriority> = {
  // Cereais - Alimentos básicos essenciais
  'milho': { national: 5, beginner: 4, commercial: 5, subsistence: 5, climate: 3 },
  'arroz': { national: 5, beginner: 3, commercial: 4, subsistence: 4, climate: 2 },
  'sorgo': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 5 },
  'milheto': { national: 3, beginner: 5, commercial: 2, subsistence: 4, climate: 5 },
  'trigo': { national: 2, beginner: 2, commercial: 3, subsistence: 2, climate: 2 },
  'aveia': { national: 1, beginner: 3, commercial: 2, subsistence: 2, climate: 3 },
  'cevada': { national: 1, beginner: 3, commercial: 2, subsistence: 2, climate: 3 },

  // Leguminosas - Proteína vegetal e fixação de nitrogênio
  'feijao_vulgar': { national: 5, beginner: 4, commercial: 4, subsistence: 5, climate: 3 },
  'feijao_nhemba': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 4 },
  'soja': { national: 3, beginner: 3, commercial: 5, subsistence: 2, climate: 3 },
  'ervilha': { national: 2, beginner: 4, commercial: 3, subsistence: 3, climate: 3 },
  'amendoim': { national: 4, beginner: 4, commercial: 4, subsistence: 4, climate: 4 },
  'lentilha': { national: 2, beginner: 3, commercial: 3, subsistence: 3, climate: 3 },

  // Tubérculos - Segurança alimentar
  'mandioca': { national: 5, beginner: 5, commercial: 3, subsistence: 5, climate: 5 },
  'batata_doce': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 4 },
  'inhame': { national: 3, beginner: 4, commercial: 2, subsistence: 4, climate: 4 },
  'batata_irlandesa': { national: 2, beginner: 3, commercial: 4, subsistence: 3, climate: 2 },

  // Hortaliças - Alto valor comercial, ciclo curto
  'tomate': { national: 3, beginner: 3, commercial: 5, subsistence: 3, climate: 2 },
  'cebola': { national: 3, beginner: 3, commercial: 4, subsistence: 4, climate: 3 },
  'repolho': { national: 2, beginner: 4, commercial: 4, subsistence: 3, climate: 3 },
  'alface': { national: 2, beginner: 5, commercial: 3, subsistence: 3, climate: 2 },

  // Frutíferas - Investimento de longo prazo
  'cajueiro': { national: 4, beginner: 2, commercial: 5, subsistence: 2, climate: 4 },
  'manga': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 4 },
  'laranja': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 3 },
  'banana': { national: 4, beginner: 3, commercial: 4, subsistence: 4, climate: 3 },
  'coqueiro': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 4 },
  'abacate': { national: 2, beginner: 3, commercial: 3, subsistence: 3, climate: 3 },
  'abacaxi': { national: 3, beginner: 3, commercial: 4, subsistence: 3, climate: 3 }, // Ananás

  // Industriais - Alto potencial econômico
  'algodao': { national: 3, beginner: 2, commercial: 5, subsistence: 1, climate: 2 },
  'cana_acucar': { national: 3, beginner: 2, commercial: 4, subsistence: 2, climate: 3 },

  // Oleaginosas - Valor agregado
  'girassol': { national: 3, beginner: 4, commercial: 4, subsistence: 3, climate: 3 },
  'gergelim': { national: 2, beginner: 4, commercial: 3, subsistence: 3, climate: 4 },
  'cartamo': { national: 1, beginner: 3, commercial: 3, subsistence: 2, climate: 4 },
  'colza': { national: 1, beginner: 3, commercial: 3, subsistence: 2, climate: 3 },

  // Especiarias - Alto valor agregado
  'piri_piri': { national: 2, beginner: 4, commercial: 4, subsistence: 4, climate: 4 },
  'oregaos': { national: 1, beginner: 4, commercial: 3, subsistence: 2, climate: 3 },
  'coentros': { national: 2, beginner: 5, commercial: 3, subsistence: 3, climate: 3 },
  'gengibre': { national: 2, beginner: 3, commercial: 4, subsistence: 3, climate: 3 }
};

// Função para calcular prioridade geral de uma cultura
export function calculateOverallPriority(cropId: string): number {
  const priorities = CROP_PRIORITIES[cropId];
  if (!priorities) return 2.5; // Prioridade média padrão

  // Pesos diferentes para cada critério
  const weights = {
    national: 0.3,
    beginner: 0.2,
    commercial: 0.2,
    subsistence: 0.2,
    climate: 0.1
  };

  return (
    priorities.national * weights.national +
    priorities.beginner * weights.beginner +
    priorities.commercial * weights.commercial +
    priorities.subsistence * weights.subsistence +
    priorities.climate * weights.climate
  );
}

// Função para determinar configuração de exibição inteligente
export function getSmartDisplayConfig(cropId: string, userProfile?: 'beginner' | 'commercial' | 'subsistence'): SmartDisplayConfig {
  const priorities = CROP_PRIORITIES[cropId];
  if (!priorities) {
    return { priority: 'medium', showByDefault: false, targetAudience: 'all' };
  }

  const overallPriority = calculateOverallPriority(cropId);
  
  // Determinar prioridade geral
  let priority: 'high' | 'medium' | 'low';
  if (overallPriority >= 4.0) priority = 'high';
  else if (overallPriority >= 3.0) priority = 'medium';
  else priority = 'low';

  // Determinar se mostra por padrão
  let showByDefault = false;
  if (userProfile) {
    const relevantScore = priorities[userProfile];
    showByDefault = relevantScore >= 4 || priority === 'high';
  } else {
    showByDefault = priority === 'high';
  }

  // Determinar público-alvo principal
  const scores = [
    { audience: 'beginner' as const, score: priorities.beginner },
    { audience: 'commercial' as const, score: priorities.commercial },
    { audience: 'subsistence' as const, score: priorities.subsistence }
  ];
  
  const maxScore = Math.max(...scores.map(s => s.score));
  const targetAudience = scores.find(s => s.score === maxScore)?.audience || 'all';

  return { priority, showByDefault, targetAudience };
}

// Função para filtrar culturas por critério específico
export function filterCropsByPriority(
  crops: string[],
  criterion: keyof CropPriority,
  minScore: number = 4
): string[] {
  return crops.filter(cropId => {
    const priorities = CROP_PRIORITIES[cropId];
    return priorities && priorities[criterion] >= minScore;
  });
}

// Função para ordenar culturas por relevância
export function sortCropsByRelevance(
  crops: string[],
  userProfile?: 'beginner' | 'commercial' | 'subsistence'
): string[] {
  return crops.sort((a, b) => {
    const priorityA = CROP_PRIORITIES[a];
    const priorityB = CROP_PRIORITIES[b];
    
    if (!priorityA && !priorityB) return 0;
    if (!priorityA) return 1;
    if (!priorityB) return -1;

    let scoreA = calculateOverallPriority(a);
    let scoreB = calculateOverallPriority(b);

    // Ajustar pontuação baseada no perfil do usuário
    if (userProfile) {
      scoreA += priorityA[userProfile] * 0.5;
      scoreB += priorityB[userProfile] * 0.5;
    }

    return scoreB - scoreA; // Ordem decrescente
  });
}
