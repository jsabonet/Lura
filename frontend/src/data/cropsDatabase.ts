// Base de dados completa das culturas com análise profissional multidimensional

interface CropData {
  id: string;
  name: string;
  category: 'cereais' | 'leguminosas' | 'hortaliças' | 'frutíferas' | 'industriais' | 'tubérculos';
  icon: string;
  season: 'chuvosa' | 'seca' | 'todo_ano';
  growthPeriod: number; // dias
  waterRequirement: 'baixo' | 'médio' | 'alto';
  temperatureRange: { min: number; max: number };
  idealRegions: string[];
  compatibleRegions: string[];
  incompatibleRegions: string[];
  
  // Análise climática avançada
  climate: {
    precipitationRange: { min: number; max: number }; // mm/ano
    humidityRange: { min: number; max: number }; // %
    frostTolerance: 'alta' | 'média' | 'baixa' | 'nenhuma';
    droughtTolerance: 'alta' | 'média' | 'baixa';
    windTolerance: 'alta' | 'média' | 'baixa';
  };
  
  // Características do solo
  soil: {
    preferredTexture: ('arenoso' | 'franco' | 'argiloso')[];
    phRange: { min: number; max: number };
    organicMatterRequirement: 'baixo' | 'médio' | 'alto';
    drainageRequirement: 'boa' | 'moderada' | 'tolerante_encharcamento';
    depthRequirement: 'raso' | 'médio' | 'profundo'; // cm
    fertilityRequirement: 'baixa' | 'média' | 'alta';
  };
  
  // Necessidades hídricas
  water: {
    irrigationDependency: 'essencial' | 'recomendada' | 'opcional' | 'desnecessária';
    waterEfficiency: 'alta' | 'média' | 'baixa'; // produção por mm de água
  };
  
  // Aspectos econômicos
  economic: {
    marketDemand: 'alta' | 'média' | 'baixa';
    priceStability: 'estável' | 'moderada' | 'volátil';
    laborRequirement: 'baixo' | 'médio' | 'alto';
    infrastructureNeed: 'básica' | 'moderada' | 'avançada';
    investmentLevel: 'baixo' | 'médio' | 'alto';
    profitabilityPotential: 'baixa' | 'média' | 'alta';
  };
  
  // Análise de riscos
  risks: {
    mainPests: string[];
    mainDiseases: string[];
    climateVulnerability: 'baixa' | 'média' | 'alta';
    marketRisk: 'baixo' | 'médio' | 'alto';
  };
  
  // Sustentabilidade
  sustainability: {
    environmentalImpact: 'baixo' | 'médio' | 'alto';
    pesticidesUse: 'mínimo' | 'moderado' | 'intensivo';
    soilConservation: 'excelente' | 'boa' | 'moderada' | 'ruim';
    rotationCompatibility: string[];
  };
  
  // Aspectos culturais e sociais
  cultural: {
    localKnowledge: 'amplo' | 'moderado' | 'limitado';
    culturalAcceptance: 'alta' | 'média' | 'baixa';
    foodSecurity: 'básica' | 'importante' | 'essencial';
  };
  
  // Ciclo da planta e fenologia
  phenology: {
    stages: {
      germination: number; // dias
      vegetative: number; // dias  
      flowering: number; // dias
      fruiting: number; // dias
      maturation: number; // dias
    };
    criticalPeriods: {
      waterStress: string[]; // fases sensíveis à falta de água
      heatStress: string[]; // fases sensíveis ao calor
      coldStress: string[]; // fases sensíveis ao frio
    };
    photoperiod: {
      sensitivity: 'alta' | 'média' | 'baixa' | 'nenhuma';
      criticalDaylength?: number; // horas de luz críticas
    };
  };
  
  // Timing e sazonalidade
  timing: {
    plantingWindows: {
      primary: { start: string; end: string; description: string };
      secondary?: { start: string; end: string; description: string };
    };
    criticalMonths: string[]; // meses críticos para o desenvolvimento
    harvestMonths: string[]; // meses de colheita
    offSeasonViability: 'possível' | 'limitada' | 'inviável';
  };
  
  // Microclima e estresse
  microclimate: {
    temperatureStress: {
      heatThreshold: number; // °C acima do qual há estresse
      coldThreshold: number; // °C abaixo do qual há estresse
      degreeDay: { base: number; max: number }; // acumulação térmica
    };
    humidityStress: {
      lowThreshold: number; // % abaixo do qual há estresse
      highThreshold: number; // % acima do qual há risco de doença
    };
  };
  
  // Balanço hídrico dinâmico
  waterDynamics: {
    evapotranspiration: {
      kc_initial: number; // coeficiente inicial
      kc_development: number; // desenvolvimento
      kc_mid: number; // meio da estação
      kc_late: number; // final
    };
    waterStressSensitivity: {
      germination: 'alta' | 'média' | 'baixa';
      flowering: 'alta' | 'média' | 'baixa';
      fruiting: 'alta' | 'média' | 'baixa';
    };
  };
  
  // Manejo agronômico
  management: {
    plantingDensity: { min: number; max: number; unit: 'plantas/ha' | 'kg/ha' };
    spacing: { row: number; plant: number; unit: 'cm' | 'm' };
    cultivationSystem: ('monocultivo' | 'consórcio' | 'rotação' | 'agroflorestal')[];
    mechanizationLevel: 'manual' | 'semi-mecanizado' | 'mecanizado';
  };
}

export const COMPREHENSIVE_CROPS_DATABASE: CropData[] = [
  // CEREAIS
  {
    id: 'milho',
    name: 'Milho',
    category: 'cereais',
    icon: '🌽',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 32 },
    idealRegions: ['Manica', 'Sofala', 'Tete', 'Zambézia'],
    compatibleRegions: ['Maputo', 'Gaza', 'Inhambane', 'Nampula', 'Cabo Delgado', 'Niassa'],
    incompatibleRegions: [],
    
    climate: {
      precipitationRange: { min: 500, max: 1200 },
      humidityRange: { min: 50, max: 80 },
      frostTolerance: 'baixa',
      droughtTolerance: 'média',
      windTolerance: 'média'
    },
    
    soil: {
      preferredTexture: ['franco', 'argiloso'],
      phRange: { min: 5.5, max: 7.0 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'média'
    },
    
    water: {
      irrigationDependency: 'recomendada',
      waterEfficiency: 'média'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Lagarta-do-cartucho', 'Broca-do-colmo', 'Cigarrinha'],
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
    },
    
    // Novos campos fenológicos e temporais
    phenology: {
      stages: {
        germination: 7,
        vegetative: 45,
        flowering: 25,
        fruiting: 35,
        maturation: 8
      },
      criticalPeriods: {
        waterStress: ['floração', 'enchimento_grãos'],
        heatStress: ['floração'],
        coldStress: ['germinação', 'enchimento_grãos']
      },
      photoperiod: {
        sensitivity: 'média',
        criticalDaylength: 12
      }
    },
    
    timing: {
      plantingWindows: {
        primary: { start: 'outubro', end: 'dezembro', description: 'Início das chuvas' },
        secondary: { start: 'janeiro', end: 'fevereiro', description: 'Plantio tardio' }
      },
      criticalMonths: ['dezembro', 'janeiro', 'fevereiro'],
      harvestMonths: ['março', 'maio'],
      offSeasonViability: 'limitada'
    },
    
    microclimate: {
      temperatureStress: {
        heatThreshold: 35,
        coldThreshold: 10,
        degreeDay: { base: 10, max: 30 }
      },
      humidityStress: {
        lowThreshold: 40,
        highThreshold: 85
      }
    },
    
    waterDynamics: {
      evapotranspiration: {
        kc_initial: 0.3,
        kc_development: 0.7,
        kc_mid: 1.2,
        kc_late: 0.6
      },
      waterStressSensitivity: {
        germination: 'alta',
        flowering: 'alta',
        fruiting: 'alta'
      }
    },
    
    management: {
      plantingDensity: { min: 50000, max: 75000, unit: 'plantas/ha' },
      spacing: { row: 80, plant: 25, unit: 'cm' },
      cultivationSystem: ['monocultivo', 'consórcio'],
      mechanizationLevel: 'semi-mecanizado'
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
    idealRegions: ['Sofala', 'Zambézia'],
    compatibleRegions: ['Manica', 'Tete', 'Nampula'],
    incompatibleRegions: ['Gaza', 'Inhambane'],
    
    climate: {
      precipitationRange: { min: 800, max: 1800 },
      humidityRange: { min: 70, max: 90 },
      frostTolerance: 'nenhuma',
      droughtTolerance: 'baixa',
      windTolerance: 'baixa'
    },
    
    soil: {
      preferredTexture: ['argiloso'],
      phRange: { min: 5.0, max: 6.5 },
      organicMatterRequirement: 'alto',
      drainageRequirement: 'tolerante_encharcamento',
      depthRequirement: 'médio',
      fertilityRequirement: 'alta'
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
    },
    
    phenology: {
      stages: {
        germination: 10,
        vegetative: 40,
        flowering: 30,
        fruiting: 50,
        maturation: 10
      },
      criticalPeriods: {
        waterStress: ['floração', 'enchimento_grãos'],
        heatStress: ['floração'],
        coldStress: ['germinação']
      },
      photoperiod: {
        sensitivity: 'baixa'
      }
    },
    
    timing: {
      plantingWindows: {
        primary: { start: 'novembro', end: 'dezembro', description: 'Época das chuvas' },
        secondary: { start: 'março', end: 'abril', description: 'Safrinha irrigada' }
      },
      criticalMonths: ['dezembro', 'janeiro', 'fevereiro'],
      harvestMonths: ['abril', 'maio'],
      offSeasonViability: 'possível'
    },
    
    microclimate: {
      temperatureStress: {
        heatThreshold: 33,
        coldThreshold: 15,
        degreeDay: { base: 12, max: 30 }
      },
      humidityStress: {
        lowThreshold: 50,
        highThreshold: 90
      }
    },
    
    waterDynamics: {
      evapotranspiration: {
        kc_initial: 0.4,
        kc_development: 0.8,
        kc_mid: 1.3,
        kc_late: 0.5
      },
      waterStressSensitivity: {
        germination: 'alta',
        flowering: 'alta',
        fruiting: 'alta'
      }
    },
    
    management: {
      plantingDensity: { min: 80000, max: 120000, unit: 'plantas/ha' },
      spacing: { row: 40, plant: 20, unit: 'cm' },
      cultivationSystem: ['monocultivo', 'rotação'],
      mechanizationLevel: 'semi-mecanizado'
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
    temperatureRange: { min: 15, max: 28 },
    idealRegions: ['Manica', 'Sofala', 'Zambézia', 'Nampula'],
    compatibleRegions: ['Maputo', 'Gaza', 'Tete', 'Cabo Delgado', 'Niassa'],
    incompatibleRegions: ['Inhambane'],
    
    climate: {
      precipitationRange: { min: 400, max: 800 },
      humidityRange: { min: 60, max: 80 },
      frostTolerance: 'baixa',
      droughtTolerance: 'média',
      windTolerance: 'média'
    },
    
    soil: {
      preferredTexture: ['franco', 'arenoso'],
      phRange: { min: 6.0, max: 7.5 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'média'
    },
    
    water: {
      irrigationDependency: 'opcional',
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
      mainPests: ['Vaquinha', 'Mosca-branca', 'Pulgão'],
      mainDiseases: ['Antracnose', 'Ferrugem', 'Mosaico-dourado'],
      climateVulnerability: 'média',
      marketRisk: 'médio'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'moderado',
      soilConservation: 'excelente',
      rotationCompatibility: ['milho', 'mandioca', 'algodao']
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
    temperatureRange: { min: 20, max: 30 },
    idealRegions: ['Gaza', 'Inhambane', 'Sofala'],
    compatibleRegions: ['Maputo', 'Manica', 'Zambézia'],
    incompatibleRegions: [],
    
    climate: {
      precipitationRange: { min: 500, max: 900 },
      humidityRange: { min: 50, max: 70 },
      frostTolerance: 'baixa',
      droughtTolerance: 'alta',
      windTolerance: 'média'
    },
    
    soil: {
      preferredTexture: ['arenoso', 'franco'],
      phRange: { min: 6.0, max: 7.0 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'baixa'
    },
    
    water: {
      irrigationDependency: 'desnecessária',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'média',
      priceStability: 'volátil',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Tripes', 'Lagarta-rosca'],
      mainDiseases: ['Mancha-castanha', 'Cercosporiose'],
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
      localKnowledge: 'moderado',
      culturalAcceptance: 'média',
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
    temperatureRange: { min: 18, max: 28 },
    idealRegions: ['Manica', 'Sofala'],
    compatibleRegions: ['Zambézia', 'Tete', 'Nampula'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Cabo Delgado'],
    
    climate: {
      precipitationRange: { min: 600, max: 1000 },
      humidityRange: { min: 60, max: 75 },
      frostTolerance: 'nenhuma',
      droughtTolerance: 'baixa',
      windTolerance: 'baixa'
    },
    
    soil: {
      preferredTexture: ['franco'],
      phRange: { min: 6.0, max: 7.0 },
      organicMatterRequirement: 'alto',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'alta'
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
      mainPests: ['Mosca-branca', 'Traça-do-tomateiro', 'Ácaros'],
      mainDiseases: ['Requeima', 'Pinta-preta', 'Vira-cabeça'],
      climateVulnerability: 'alta',
      marketRisk: 'alto'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'intensivo',
      soilConservation: 'moderada',
      rotationCompatibility: ['milho', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'limitado',
      culturalAcceptance: 'alta',
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
    compatibleRegions: ['Sofala', 'Zambézia', 'Nampula'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Cabo Delgado'],
    
    climate: {
      precipitationRange: { min: 400, max: 800 },
      humidityRange: { min: 60, max: 85 },
      frostTolerance: 'média',
      droughtTolerance: 'baixa',
      windTolerance: 'baixa'
    },
    
    soil: {
      preferredTexture: ['franco', 'argiloso'],
      phRange: { min: 6.0, max: 7.5 },
      organicMatterRequirement: 'alto',
      drainageRequirement: 'boa',
      depthRequirement: 'raso',
      fertilityRequirement: 'alta'
    },
    
    water: {
      irrigationDependency: 'recomendada',
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
      mainPests: ['Pulgão', 'Lagarta-da-couve'],
      mainDiseases: ['Míldio', 'Alternária'],
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
      culturalAcceptance: 'alta',
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
    temperatureRange: { min: 22, max: 30 },
    idealRegions: ['Cabo Delgado', 'Nampula', 'Zambézia'],
    compatibleRegions: ['Sofala', 'Inhambane'],
    incompatibleRegions: ['Manica', 'Tete', 'Gaza', 'Maputo'],
    
    climate: {
      precipitationRange: { min: 1000, max: 2000 },
      humidityRange: { min: 70, max: 90 },
      frostTolerance: 'nenhuma',
      droughtTolerance: 'baixa',
      windTolerance: 'alta'
    },
    
    soil: {
      preferredTexture: ['arenoso', 'franco'],
      phRange: { min: 5.5, max: 7.0 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'profundo',
      fertilityRequirement: 'média'
    },
    
    water: {
      irrigationDependency: 'recomendada',
      waterEfficiency: 'baixa'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Ácaro-do-coqueiro', 'Broca-do-olho'],
      mainDiseases: ['Anel-vermelho', 'Podridão-de-estipe'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'excelente',
      rotationCompatibility: []
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
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Cabo Delgado', 'Nampula'],
    compatibleRegions: ['Zambézia', 'Sofala', 'Inhambane'],
    incompatibleRegions: ['Manica', 'Tete'],
    
    climate: {
      precipitationRange: { min: 600, max: 1200 },
      humidityRange: { min: 60, max: 80 },
      frostTolerance: 'baixa',
      droughtTolerance: 'alta',
      windTolerance: 'média'
    },
    
    soil: {
      preferredTexture: ['arenoso', 'franco'],
      phRange: { min: 5.0, max: 6.5 },
      organicMatterRequirement: 'baixo',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'baixa'
    },
    
    water: {
      irrigationDependency: 'opcional',
      waterEfficiency: 'alta'
    },
    
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'baixo',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta'
    },
    
    risks: {
      mainPests: ['Antracnose', 'Mosca-da-fruta'],
      mainDiseases: ['Resinose', 'Oídio'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio'
    },
    
    sustainability: {
      environmentalImpact: 'baixo',
      pesticidesUse: 'mínimo',
      soilConservation: 'boa',
      rotationCompatibility: ['amendoim', 'mandioca']
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
    idealRegions: ['Gaza', 'Inhambane', 'Sofala', 'Zambézia'],
    compatibleRegions: ['Maputo', 'Manica', 'Tete', 'Nampula', 'Cabo Delgado', 'Niassa'],
    incompatibleRegions: [],
    
    climate: {
      precipitationRange: { min: 600, max: 1500 },
      humidityRange: { min: 50, max: 80 },
      frostTolerance: 'nenhuma',
      droughtTolerance: 'alta',
      windTolerance: 'alta'
    },
    
    soil: {
      preferredTexture: ['arenoso', 'franco'],
      phRange: { min: 5.0, max: 7.0 },
      organicMatterRequirement: 'baixo',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'baixa'
    },
    
    water: {
      irrigationDependency: 'desnecessária',
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
      mainPests: ['Ácaro-verde', 'Mosca-branca'],
      mainDiseases: ['Bacteriose', 'Mosaico-africano'],
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
    idealRegions: ['Manica', 'Sofala', 'Zambézia'],
    compatibleRegions: ['Maputo', 'Gaza', 'Tete', 'Nampula'],
    incompatibleRegions: ['Inhambane', 'Cabo Delgado'],
    
    climate: {
      precipitationRange: { min: 750, max: 1000 },
      humidityRange: { min: 60, max: 80 },
      frostTolerance: 'baixa',
      droughtTolerance: 'média',
      windTolerance: 'média'
    },
    
    soil: {
      preferredTexture: ['franco', 'arenoso'],
      phRange: { min: 5.5, max: 6.8 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'média'
    },
    
    water: {
      irrigationDependency: 'opcional',
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
      mainPests: ['Broca-da-raiz', 'Gorgulho'],
      mainDiseases: ['Mal-do-pé', 'Podridão-negra'],
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
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Sofala', 'Tete'],
    compatibleRegions: ['Zambézia', 'Manica'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Nampula', 'Cabo Delgado'],
    
    climate: {
      precipitationRange: { min: 500, max: 1200 },
      humidityRange: { min: 50, max: 75 },
      frostTolerance: 'baixa',
      droughtTolerance: 'média',
      windTolerance: 'baixa'
    },
    
    soil: {
      preferredTexture: ['franco', 'argiloso'],
      phRange: { min: 6.0, max: 8.0 },
      organicMatterRequirement: 'médio',
      drainageRequirement: 'boa',
      depthRequirement: 'médio',
      fertilityRequirement: 'alta'
    },
    
    water: {
      irrigationDependency: 'recomendada',
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
      mainPests: ['Bicudo', 'Lagarta-rosada', 'Pulgão'],
      mainDiseases: ['Murcha-de-fusarium', 'Ramulose'],
      climateVulnerability: 'alta',
      marketRisk: 'alto'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'intensivo',
      soilConservation: 'moderada',
      rotationCompatibility: ['milho', 'feijao', 'amendoim']
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
    temperatureRange: { min: 20, max: 32 },
    idealRegions: ['Sofala', 'Zambézia'],
    compatibleRegions: ['Manica', 'Tete'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Maputo', 'Nampula', 'Cabo Delgado'],
    
    climate: {
      precipitationRange: { min: 1000, max: 1800 },
      humidityRange: { min: 70, max: 85 },
      frostTolerance: 'baixa',
      droughtTolerance: 'baixa',
      windTolerance: 'baixa'
    },
    
    soil: {
      preferredTexture: ['franco', 'argiloso'],
      phRange: { min: 6.0, max: 7.5 },
      organicMatterRequirement: 'alto',
      drainageRequirement: 'moderada',
      depthRequirement: 'profundo',
      fertilityRequirement: 'alta'
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
      mainPests: ['Broca-da-cana', 'Cigarrinha'],
      mainDiseases: ['Ferrugem', 'Carvão', 'Raquitismo'],
      climateVulnerability: 'média',
      marketRisk: 'baixo'
    },
    
    sustainability: {
      environmentalImpact: 'alto',
      pesticidesUse: 'moderado',
      soilConservation: 'ruim',
      rotationCompatibility: ['milho', 'feijao']
    },
    
    cultural: {
      localKnowledge: 'limitado',
      culturalAcceptance: 'média',
      foodSecurity: 'básica'
    }
  }
];

export const CATEGORY_LABELS = {
  cereais: 'Cereais',
  leguminosas: 'Leguminosas',
  hortaliças: 'Hortaliças',
  frutíferas: 'Frutíferas',
  industriais: 'Industriais',
  tubérculos: 'Tubérculos'
};

export type { CropData };
