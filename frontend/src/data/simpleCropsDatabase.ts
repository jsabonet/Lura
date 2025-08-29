// Base de Dados de Culturas Simplificada - Versão Compatível
// Esta versão mantém apenas os campos essenciais para evitar erros de compilação

export interface SimpleCropData {
  id: string;
  name: string;
  category: 'cereais' | 'leguminosas' | 'hortaliças' | 'frutíferas' | 'tubérculos' | 'industriais';
  icon: string;
  season: 'chuvosa' | 'seca' | 'todo_ano';
  growthPeriod: number; // dias
  waterRequirement: 'baixo' | 'médio' | 'alto';
  temperatureRange: { min: number; max: number };
  idealRegions: string[];
  compatibleRegions: string[];
  incompatibleRegions: string[];
  
  // Dados básicos de análise
  climate: {
    temperatureOptimal: number;
    rainfallRequirement: string;
  };
  
  soil: {
    phOptimal: { min: number; max: number };
    drainageRequirement: 'boa' | 'moderada' | 'baixa';
  };
  
  water: {
    irrigationDependency: 'essencial' | 'moderada' | 'baixa';
    waterEfficiency: 'alta' | 'média' | 'baixa';
  };
  
  economic: {
    marketDemand: 'alta' | 'média' | 'baixa';
    priceStability: 'estável' | 'moderada' | 'volátil';
    laborRequirement: 'baixo' | 'médio' | 'alto';
    infrastructureNeed: 'básica' | 'moderada' | 'avançada';
    investmentLevel: 'baixo' | 'médio' | 'alto';
    profitabilityPotential: 'baixa' | 'média' | 'alta';
  };
  
  risks: {
    mainPests: string[];
    mainDiseases: string[];
    climateVulnerability: 'baixa' | 'média' | 'alta';
    marketRisk: 'baixo' | 'médio' | 'alto';
  };
  
  sustainability: {
    environmentalImpact: 'baixo' | 'médio' | 'alto';
    pesticidesUse: 'mínimo' | 'moderado' | 'intensivo';
    soilConservation: 'excelente' | 'boa' | 'moderada' | 'ruim';
    rotationCompatibility: string[];
  };
  
  cultural: {
    localKnowledge: 'amplo' | 'moderado' | 'limitado';
    culturalAcceptance: 'alta' | 'média' | 'baixa';
    foodSecurity: 'básica' | 'importante' | 'essencial';
  };
}

export const SIMPLE_CROPS_DATABASE: SimpleCropData[] = [
  // CEREAIS
  {
    id: 'milho',
    name: 'Milho',
    category: 'cereais',
    icon: '🌽',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 35 },
    idealRegions: ['Manica', 'Sofala', 'Tete'],
    compatibleRegions: ['Zambézia', 'Nampula', 'Niassa'],
    incompatibleRegions: [],
    
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '500-800mm'
    },
    
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Lagarta-do-cartucho', 'Broca-do-colmo'],
      mainDiseases: ['Helmintosporiose', 'Ferrugem', 'Mancha-branca'],
      climateVulnerability: 'média',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'médio',
      pesticidesUse: 'moderado',
      soilConservation: 'boa',
      rotationCompatibility: ['feijao', 'amendoim', 'mandioca']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'essencial'
    }
  },

  {
    id: 'arroz',
    name: 'Arroz',
    category: 'cereais',
    icon: '🌾',
    season: 'chuvosa',
    growthPeriod: 140,
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Zambézia', 'Sofala'],
    compatibleRegions: ['Tete', 'Manica'],
    incompatibleRegions: ['Gaza', 'Inhambane'],
    
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '1200-1800mm'
    },
    
    soil: {
      phOptimal: { min: 5.0, max: 6.5 },
      drainageRequirement: 'baixa'
    },
    
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Broca-do-colmo', 'Percevejo-do-grão'],
      mainDiseases: ['Brusone', 'Queima-das-bainhas', 'Mancha-parda'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'intensivo',
      soilConservation: 'moderada',
      rotationCompatibility: ['milho', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'moderado',
      culturalAcceptance: 'alta',
      foodSecurity: 'essencial'
    }
  },

  // LEGUMINOSAS
  {
    id: 'feijao',
    name: 'Feijão',
    category: 'leguminosas',
    icon: '🫘',
    season: 'chuvosa',
    growthPeriod: 90,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 30 },
    idealRegions: ['Manica', 'Tete', 'Niassa'],
    compatibleRegions: ['Sofala', 'Zambézia', 'Nampula'],
    incompatibleRegions: [],
    
    climate: {
      temperatureOptimal: 24,
      rainfallRequirement: '400-600mm'
    },
    
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média'
    },
    
    risks: {
      mainPests: ['Mosca-branca', 'Vaquinha'],
      mainDiseases: ['Antracnose', 'Ferrugem', 'Mosaico-dourado'],
      climateVulnerability: 'média',
      marketRisk: 'médio'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'excelente',
      rotationCompatibility: ['milho', 'tomate', 'mandioca']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'essencial'
    }
  },

  {
    id: 'amendoim',
    name: 'Amendoim',
    category: 'leguminosas',
    icon: '🥜',
    season: 'chuvosa',
    growthPeriod: 110,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 32 },
    idealRegions: ['Nampula', 'Cabo Delgado', 'Niassa'],
    compatibleRegions: ['Zambézia', 'Tete', 'Manica'],
    incompatibleRegions: [],
    
    climate: {
      temperatureOptimal: 26,
      rainfallRequirement: '500-700mm'
    },
    
    soil: {
      phOptimal: { min: 5.8, max: 7.2 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'média',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Tripes', 'Lagarta-rosca'],
      mainDiseases: ['Mancha-castanha', 'Ferrugem'],
      climateVulnerability: 'baixa',
      marketRisk: 'alto'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'excelente',
      rotationCompatibility: ['milho', 'algodao', 'mandioca']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'importante'
    }
  },

  // HORTALIÇAS
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'hortaliças',
    icon: '🍅',
    season: 'todo_ano',
    growthPeriod: 85,
    waterRequirement: 'alto',
    temperatureRange: { min: 15, max: 30 },
    idealRegions: ['Manica', 'Sofala'],
    compatibleRegions: ['Tete', 'Zambézia'],
    incompatibleRegions: ['Gaza', 'Inhambane'],
    
    climate: {
      temperatureOptimal: 22,
      rainfallRequirement: '600-1000mm'
    },
    
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Mosca-branca', 'Traça-do-tomateiro'],
      mainDiseases: ['Requeima', 'Murcha-bacteriana', 'Mosaico'],
      climateVulnerability: 'alta',
      marketRisk: 'alto'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'intensivo',
      soilConservation: 'moderada',
      rotationCompatibility: ['feijao', 'milho']
    },
    
    cultural: {
      localKnowledge: 'limitado',
      culturalAcceptance: 'média',
      foodSecurity: 'importante'
    }
  },

  {
    id: 'couve',
    name: 'Couve',
    category: 'hortaliças',
    icon: '🥬',
    season: 'seca',
    growthPeriod: 60,
    waterRequirement: 'médio',
    temperatureRange: { min: 12, max: 25 },
    idealRegions: ['Manica', 'Tete'],
    compatibleRegions: ['Niassa', 'Sofala'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Cabo Delgado'],
    
    climate: {
      temperatureOptimal: 18,
      rainfallRequirement: '400-600mm'
    },
    
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'média',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média'
    },
    
    risks: {
      mainPests: ['Pulgão', 'Traça-das-crucíferas'],
      mainDiseases: ['Hérnia-das-crucíferas', 'Alternariose'],
      climateVulnerability: 'média',
      marketRisk: 'médio'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'moderado',
      soilConservation: 'boa',
      rotationCompatibility: ['tomate', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'moderado',
      culturalAcceptance: 'média',
      foodSecurity: 'importante'
    }
  },

  // FRUTÍFERAS
  {
    id: 'coco',
    name: 'Coco',
    category: 'frutíferas',
    icon: '🥥',
    season: 'todo_ano',
    growthPeriod: 2555, // 7 anos
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Gaza', 'Inhambane', 'Zambézia'],
    compatibleRegions: ['Sofala', 'Nampula', 'Cabo Delgado'],
    incompatibleRegions: ['Tete', 'Manica', 'Niassa'],
    
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '1500-2500mm'
    },
    
    soil: {
      phOptimal: { min: 5.5, max: 8.0 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Broca-do-olho-do-coqueiro', 'Ácaro-vermelho'],
      mainDiseases: ['Anel-vermelho', 'Queima-das-folhas'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'excelente',
      rotationCompatibility: ['feijao', 'amendoim']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'importante'
    }
  },

  {
    id: 'caju',
    name: 'Caju',
    category: 'frutíferas',
    icon: '🌰',
    season: 'todo_ano',
    growthPeriod: 1095, // 3 anos
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 32 },
    idealRegions: ['Nampula', 'Cabo Delgado', 'Zambézia'],
    compatibleRegions: ['Niassa', 'Inhambane'],
    incompatibleRegions: ['Tete', 'Manica'],
    
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '800-1200mm'
    },
    
    soil: {
      phOptimal: { min: 4.5, max: 6.5 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Mosca-da-castanha', 'Broca-da-castanha'],
      mainDiseases: ['Antracnose', 'Oídio'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'excelente',
      rotationCompatibility: ['amendoim', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'importante'
    }
  },

  // TUBÉRCULOS
  {
    id: 'mandioca',
    name: 'Mandioca',
    category: 'tubérculos',
    icon: '🍠',
    season: 'todo_ano',
    growthPeriod: 365,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Zambézia', 'Nampula', 'Cabo Delgado'],
    compatibleRegions: ['Niassa', 'Sofala', 'Inhambane'],
    incompatibleRegions: [],
    
    climate: {
      temperatureOptimal: 27,
      rainfallRequirement: '600-1200mm'
    },
    
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média'
    },
    
    risks: {
      mainPests: ['Mosca-branca', 'Ácaro-verde'],
      mainDiseases: ['Mosaico-africano', 'Bacteriose'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'boa',
      rotationCompatibility: ['milho', 'feijao', 'amendoim']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'essencial'
    }
  },

  {
    id: 'batata_doce',
    name: 'Batata-doce',
    category: 'tubérculos',
    icon: '🍠',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 30 },
    idealRegions: ['Manica', 'Sofala', 'Tete'],
    compatibleRegions: ['Zambézia', 'Nampula'],
    incompatibleRegions: ['Gaza', 'Inhambane'],
    
    climate: {
      temperatureOptimal: 24,
      rainfallRequirement: '500-1000mm'
    },
    
    soil: {
      phOptimal: { min: 5.8, max: 6.8 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média'
    },
    
    economic: {
      marketDemand: 'média',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média'
    },
    
    risks: {
      mainPests: ['Gorgulho-da-batata-doce', 'Broca-da-raiz'],
      mainDiseases: ['Fusariose', 'Podridão-negra'],
      climateVulnerability: 'média',
      marketRisk: 'médio'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'boa',
      rotationCompatibility: ['milho', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'amplo',
      culturalAcceptance: 'alta',
      foodSecurity: 'importante'
    }
  },

  // INDUSTRIAIS
  {
    id: 'algodao',
    name: 'Algodão',
    category: 'industriais',
    icon: '🌼',
    season: 'chuvosa',
    growthPeriod: 180,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 35 },
    idealRegions: ['Cabo Delgado', 'Nampula'],
    compatibleRegions: ['Zambézia', 'Sofala'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete'],
    
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '500-1200mm'
    },
    
    soil: {
      phOptimal: { min: 5.8, max: 7.5 },
      drainageRequirement: 'boa'
    },
    
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Lagarta-rosada', 'Curuquerê'],
      mainDiseases: ['Ramulose', 'Murcha-de-fusarium'],
      climateVulnerability: 'alta',
      marketRisk: 'alto'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'intensivo',
      soilConservation: 'moderada',
      rotationCompatibility: ['milho', 'amendoim']
    },
    
    cultural: {
      localKnowledge: 'moderado',
      culturalAcceptance: 'média',
      foodSecurity: 'básica'
    }
  },

  {
    id: 'cana_acucar',
    name: 'Cana-de-açúcar',
    category: 'industriais',
    icon: '🎋',
    season: 'todo_ano',
    growthPeriod: 365,
    waterRequirement: 'alto',
    temperatureRange: { min: 18, max: 38 },
    idealRegions: ['Sofala', 'Zambézia'],
    compatibleRegions: ['Inhambane', 'Gaza'],
    incompatibleRegions: ['Tete', 'Manica', 'Niassa'],
    
    climate: {
      temperatureOptimal: 30,
      rainfallRequirement: '1000-1500mm'
    },
    
    soil: {
      phOptimal: { min: 6.0, max: 8.0 },
      drainageRequirement: 'moderada'
    },
    
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Broca-da-cana', 'Cupim'],
      mainDiseases: ['Mosaico', 'Ferrugem', 'Carvão'],
      climateVulnerability: 'média',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'médio',
      pesticidesUse: 'moderado',
      soilConservation: 'moderada',
      rotationCompatibility: ['feijao', 'amendoim']
    },
    
    cultural: {
      localKnowledge: 'limitado',
      culturalAcceptance: 'baixa',
      foodSecurity: 'básica'
    }
  }
];

export const CATEGORY_LABELS = {
  cereais: 'Cereais',
  leguminosas: 'Leguminosas',
  hortaliças: 'Hortaliças',
  frutíferas: 'Frutíferas',
  tubérculos: 'Tubérculos',
  industriais: 'Industriais'
} as const;
