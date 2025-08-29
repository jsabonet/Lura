// Base de Dados Completa de Culturas de Moçambique
// Incluindo todas as principais culturas produzidas no país

export interface MozambiqueCropData {
  id: string;
  name: string;
  localName?: string; // Nome local em português moçambicano
  category: 'cereais' | 'leguminosas' | 'hortaliças' | 'frutíferas' | 'tubérculos' | 'industriais' | 'oleaginosas' | 'especiarias';
  icon: string;
  season: 'chuvosa' | 'seca' | 'todo_ano';
  growthPeriod: number; // dias
  waterRequirement: 'baixo' | 'médio' | 'alto';
  temperatureRange: { min: number; max: number };
  idealRegions: string[];
  compatibleRegions: string[];
  incompatibleRegions: string[];
  
  // Sistema de prioridade inteligente
  priority?: {
    national: number; // 1-5: Importância nacional (alimentar, econômica)
    beginner: number; // 1-5: Facilidade para iniciantes
    commercial: number; // 1-5: Potencial comercial
    subsistence: number; // 1-5: Valor para agricultura familiar
    climate: number; // 1-5: Adaptação às mudanças climáticas
  };
  
  // Dados climáticos específicos
  climate: {
    temperatureOptimal: number;
    rainfallRequirement: string;
    altitudeRange: { min: number; max: number }; // metros
    photoperiodSensitive: boolean;
  };
  
  // Dados de solo
  soil: {
    phOptimal: { min: number; max: number };
    drainageRequirement: 'boa' | 'moderada' | 'baixa';
    soilTypes: string[];
    fertilityRequirement: 'baixa' | 'média' | 'alta';
  };
  
  // Gestão de água
  water: {
    irrigationDependency: 'essencial' | 'moderada' | 'baixa';
    waterEfficiency: 'alta' | 'média' | 'baixa';
    droughtTolerance: 'alta' | 'média' | 'baixa';
  };
  
  // Dados econômicos detalhados
  economic: {
    marketDemand: 'alta' | 'média' | 'baixa';
    priceStability: 'estável' | 'moderada' | 'volátil';
    laborRequirement: 'baixo' | 'médio' | 'alto';
    infrastructureNeed: 'básica' | 'moderada' | 'avançada';
    investmentLevel: 'baixo' | 'médio' | 'alto';
    profitabilityPotential: 'baixa' | 'média' | 'alta';
    exportPotential: 'alto' | 'médio' | 'baixo';
    processingNeed: 'nenhum' | 'básico' | 'avançado';
    
    // Dados específicos para cálculos
    seedCostPerHa: number; // MZN
    fertiliserCostPerHa: number; // MZN
    pesticideCostPerHa: number; // MZN
    laborCostPerHa: number; // MZN
    machineryDepreciationPerHa: number; // MZN
    otherCostsPerHa: number; // MZN
    
    averageYieldPerHa: number; // kg/ha ou unidades
    pricePerKg: number; // MZN/kg
    priceVariability: number; // percentual de variação
  };
  
  // Riscos específicos
  risks: {
    mainPests: string[];
    mainDiseases: string[];
    climateVulnerability: 'baixa' | 'média' | 'alta';
    marketRisk: 'baixo' | 'médio' | 'alto';
    cycloneVulnerability: 'baixa' | 'média' | 'alta';
    droughtRisk: 'baixo' | 'médio' | 'alto';
  };
  
  // Sustentabilidade
  sustainability: {
    environmentalImpact: 'baixo' | 'médio' | 'alto';
    soilConservation: 'excelente' | 'boa' | 'moderada' | 'ruim';
    carbonSequestration: 'alta' | 'média' | 'baixa';
    biodiversityImpact: 'positivo' | 'neutro' | 'negativo';
    rotationCompatibility: string[];
  };
  
  // Dados agronômicos
  agronomy: {
    plantingDensity: string;
    spacingRecommendation: string;
    fertiliserProgram: string[];
    harvestMethod: 'manual' | 'mecanizada' | 'ambos';
    postHarvestHandling: string[];
  };
}

export const MOZAMBIQUE_CROPS: MozambiqueCropData[] = [
  // CEREAIS
  {
    id: 'milho',
    name: 'Milho',
    localName: 'Milho',
    category: 'cereais',
    icon: '🌽',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 35 },
    idealRegions: ['Tete', 'Manica', 'Sofala'],
    compatibleRegions: ['Zambézia', 'Nampula', 'Niassa'],
    incompatibleRegions: ['Gaza (zonas áridas)'],
    
    priority: {
      national: 5, // Alimento básico fundamental
      beginner: 4, // Relativamente fácil para iniciantes
      commercial: 5, // Alto potencial comercial
      subsistence: 5, // Essencial para agricultura familiar
      climate: 3 // Moderadamente adaptado às mudanças climáticas
    },
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '500-800mm',
      altitudeRange: { min: 0, max: 2000 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Franco-argiloso'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 8000,
      fertiliserCostPerHa: 25000,
      pesticideCostPerHa: 12000,
      laborCostPerHa: 15000,
      machineryDepreciationPerHa: 8000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 3500,
      pricePerKg: 35,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Broca do milho', 'Lagarta do cartucho', 'Pulgão'],
      mainDiseases: ['Ferrugem', 'Mancha foliar', 'Podridão da espiga'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Feijão', 'Soja', 'Amendoim']
    },
    agronomy: {
      plantingDensity: '55.000-65.000 plantas/ha',
      spacingRecommendation: '75cm entre fileiras, 25cm entre plantas',
      fertiliserProgram: ['NPK na sementeira', 'Ureia em cobertura'],
      harvestMethod: 'ambos',
      postHarvestHandling: ['Secagem', 'Debulha', 'Armazenamento']
    }
  },
  
  {
    id: 'arroz',
    name: 'Arroz',
    localName: 'Arroz',
    category: 'cereais',
    icon: '🌾',
    season: 'chuvosa',
    growthPeriod: 130,
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Zambézia', 'Sofala', 'Gaza'],
    compatibleRegions: ['Inhambane', 'Maputo', 'Nampula'],
    incompatibleRegions: ['Tete (zonas secas)', 'Cabo Delgado (interior)'],
    
    priority: {
      national: 5, // Alimento básico fundamental
      beginner: 3, // Requer mais técnica (irrigação)
      commercial: 4, // Alto potencial comercial
      subsistence: 4, // Importante para agricultura familiar
      climate: 2 // Sensível a mudanças climáticas (água)
    },
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '1200-1800mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'baixa',
      soilTypes: ['Argiloso', 'Franco-argiloso', 'Gleissolo'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 12000,
      fertiliserCostPerHa: 35000,
      pesticideCostPerHa: 18000,
      laborCostPerHa: 25000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 8000,
      averageYieldPerHa: 4500,
      pricePerKg: 45,
      priceVariability: 0.15
    },
    risks: {
      mainPests: ['Broca do colmo', 'Percevejo marrom', 'Gorgulho'],
      mainDiseases: ['Brusone', 'Mancha parda', 'Queima das bainhas'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo',
      cycloneVulnerability: 'alta',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'alto',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'negativo',
      rotationCompatibility: ['Feijão', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '150-200 kg/ha',
      spacingRecommendation: '20cm entre fileiras',
      fertiliserProgram: ['NPK base', 'Ureia parcelada', 'Micronutrientes'],
      harvestMethod: 'ambos',
      postHarvestHandling: ['Secagem', 'Beneficiamento', 'Polimento']
    }
  },

  {
    id: 'sorgo',
    name: 'Sorgo',
    localName: 'Mapira',
    category: 'cereais',
    icon: '🌾',
    season: 'chuvosa',
    growthPeriod: 110,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 40 },
    idealRegions: ['Gaza', 'Inhambane', 'Tete'],
    compatibleRegions: ['Manica', 'Sofala', 'Cabo Delgado'],
    incompatibleRegions: ['Zambézia (zonas húmidas)'],
    climate: {
      temperatureOptimal: 30,
      rainfallRequirement: '300-600mm',
      altitudeRange: { min: 0, max: 1800 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 8.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso', 'Argiloso'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'moderada',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 6000,
      fertiliserCostPerHa: 15000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 10000,
      machineryDepreciationPerHa: 5000,
      otherCostsPerHa: 3000,
      averageYieldPerHa: 2500,
      pricePerKg: 30,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Broca do colmo', 'Pulgão', 'Gafanhoto'],
      mainDiseases: ['Antracnose', 'Ferrugem', 'Carvão'],
      climateVulnerability: 'baixa',
      marketRisk: 'alto',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Feijão nhemba', 'Amendoim', 'Algodão']
    },
    agronomy: {
      plantingDensity: '8-12 kg/ha',
      spacingRecommendation: '75cm entre fileiras, 15cm entre plantas',
      fertiliserProgram: ['NPK base', 'Ureia cobertura'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Armazenamento']
    }
  },

  // LEGUMINOSAS
  {
    id: 'feijao_vulgar',
    name: 'Feijão Vulgar',
    localName: 'Feijão',
    category: 'leguminosas',
    icon: '🫘',
    season: 'chuvosa',
    growthPeriod: 90,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 30 },
    idealRegions: ['Manica', 'Tete', 'Niassa'],
    compatibleRegions: ['Sofala', 'Zambézia', 'Nampula'],
    incompatibleRegions: ['Gaza (zonas muito quentes)'],
    climate: {
      temperatureOptimal: 22,
      rainfallRequirement: '400-800mm',
      altitudeRange: { min: 500, max: 2500 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 15000,
      fertiliserCostPerHa: 20000,
      pesticideCostPerHa: 15000,
      laborCostPerHa: 18000,
      machineryDepreciationPerHa: 6000,
      otherCostsPerHa: 4000,
      averageYieldPerHa: 1500,
      pricePerKg: 80,
      priceVariability: 0.35
    },
    risks: {
      mainPests: ['Mosca branca', 'Trips', 'Vaquinha'],
      mainDiseases: ['Antracnose', 'Ferrugem', 'Murcha bacteriana'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Milho', 'Arroz', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '50-80 kg/ha',
      spacingRecommendation: '40cm entre fileiras, 10cm entre plantas',
      fertiliserProgram: ['Fósforo na sementeira', 'Inoculação'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Seleção']
    }
  },

  {
    id: 'feijao_nhemba',
    name: 'Feijão Nhemba',
    localName: 'Nhemba',
    category: 'leguminosas',
    icon: '🫛',
    season: 'chuvosa',
    growthPeriod: 75,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Gaza', 'Inhambane', 'Tete'],
    compatibleRegions: ['Sofala', 'Manica', 'Cabo Delgado'],
    incompatibleRegions: ['Niassa (zonas muito frias)'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '300-700mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso', 'Franco'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média',
      exportPotential: 'baixo',
      processingNeed: 'nenhum',
      seedCostPerHa: 8000,
      fertiliserCostPerHa: 10000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 12000,
      machineryDepreciationPerHa: 3000,
      otherCostsPerHa: 2000,
      averageYieldPerHa: 1200,
      pricePerKg: 60,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Pulgão', 'Trips', 'Broca da vagem'],
      mainDiseases: ['Vírus do mosaico', 'Antracnose', 'Septoriose'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Sorgo', 'Milho', 'Algodão']
    },
    agronomy: {
      plantingDensity: '15-25 kg/ha',
      spacingRecommendation: '50cm entre fileiras, 20cm entre plantas',
      fertiliserProgram: ['Fósforo base', 'Inoculação recomendada'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem ao sol', 'Debulha', 'Armazenamento']
    }
  },

  // TUBÉRCULOS
  {
    id: 'mandioca',
    name: 'Mandioca',
    localName: 'Mandioca',
    category: 'tubérculos',
    icon: '🍠',
    season: 'todo_ano',
    growthPeriod: 300,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Nampula', 'Cabo Delgado', 'Niassa'],
    compatibleRegions: ['Zambézia', 'Tete', 'Sofala'],
    incompatibleRegions: ['Gaza (zonas muito áridas)'],
    climate: {
      temperatureOptimal: 27,
      rainfallRequirement: '600-1200mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 12000,
      fertiliserCostPerHa: 8000,
      pesticideCostPerHa: 5000,
      laborCostPerHa: 20000,
      machineryDepreciationPerHa: 4000,
      otherCostsPerHa: 3000,
      averageYieldPerHa: 15000,
      pricePerKg: 15,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Ácaro verde', 'Mosca branca', 'Cochonilha'],
      mainDiseases: ['Mosaico africano', 'Bacteriose', 'Podridão radicular'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo',
      cycloneVulnerability: 'média',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Feijão nhemba', 'Milho', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '10.000 estacas/ha',
      spacingRecommendation: '1m x 1m',
      fertiliserProgram: ['NPK na plantação', 'Matéria orgânica'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Processamento imediato', 'Farinha', 'Conservação']
    }
  },

  {
    id: 'batata_doce',
    name: 'Batata-doce',
    localName: 'Batata-doce',
    category: 'tubérculos',
    icon: '🍠',
    season: 'seca',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 30 },
    idealRegions: ['Manica', 'Sofala', 'Tete'],
    compatibleRegions: ['Zambézia', 'Nampula', 'Inhambane'],
    incompatibleRegions: ['Gaza (zonas muito secas)'],
    climate: {
      temperatureOptimal: 24,
      rainfallRequirement: '500-1000mm',
      altitudeRange: { min: 0, max: 2000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco-arenoso', 'Franco'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'alta',
      exportPotential: 'baixo',
      processingNeed: 'nenhum',
      seedCostPerHa: 15000,
      fertiliserCostPerHa: 12000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 18000,
      machineryDepreciationPerHa: 5000,
      otherCostsPerHa: 3000,
      averageYieldPerHa: 12000,
      pricePerKg: 25,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Gorgulho', 'Broca da batata', 'Lagarta'],
      mainDiseases: ['Fusariose', 'Podridão negra', 'Vírus SPFMV'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Feijão', 'Milho', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '25.000-30.000 plantas/ha',
      spacingRecommendation: '80cm x 40cm',
      fertiliserProgram: ['NPK base', 'Matéria orgânica'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Cura', 'Seleção', 'Comercialização rápida']
    }
  },

  // FRUTÍFERAS
  {
    id: 'cajueiro',
    name: 'Cajueiro',
    localName: 'Caju',
    category: 'frutíferas',
    icon: '🥜',
    season: 'todo_ano',
    growthPeriod: 1095, // 3 anos para produção
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Nampula', 'Cabo Delgado', 'Inhambane'],
    compatibleRegions: ['Zambézia', 'Gaza'],
    incompatibleRegions: ['Tete', 'Niassa (interior)'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '800-1200mm',
      altitudeRange: { min: 0, max: 800 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 25000,
      fertiliserCostPerHa: 15000,
      pesticideCostPerHa: 10000,
      laborCostPerHa: 12000,
      machineryDepreciationPerHa: 8000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 800,
      pricePerKg: 150,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Traça da castanha', 'Mosca da fruta', 'Formigas'],
      mainDiseases: ['Antracnose', 'Oídio', 'Mancha angular'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo',
      cycloneVulnerability: 'média',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Culturas anuais intercalares']
    },
    agronomy: {
      plantingDensity: '100-150 plantas/ha',
      spacingRecommendation: '10m x 10m',
      fertiliserProgram: ['NPK anual', 'Micronutrientes', 'Matéria orgânica'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Processamento', 'Secagem', 'Beneficiamento']
    }
  },

  // INDUSTRIAIS
  {
    id: 'algodao',
    name: 'Algodão',
    localName: 'Algodão',
    category: 'industriais',
    icon: '🌸',
    season: 'chuvosa',
    growthPeriod: 150,
    waterRequirement: 'médio',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Cabo Delgado', 'Nampula', 'Zambézia'],
    compatibleRegions: ['Sofala', 'Tete'],
    incompatibleRegions: ['Gaza', 'Inhambane'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '600-1200mm',
      altitudeRange: { min: 0, max: 1000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 5.8, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 8000,
      fertiliserCostPerHa: 40000,
      pesticideCostPerHa: 35000,
      laborCostPerHa: 30000,
      machineryDepreciationPerHa: 20000,
      otherCostsPerHa: 10000,
      averageYieldPerHa: 1800,
      pricePerKg: 80,
      priceVariability: 0.40
    },
    risks: {
      mainPests: ['Lagarta rosada', 'Curuquerê', 'Percevejo'],
      mainDiseases: ['Murcha de Fusarium', 'Ramulose', 'Mancha angular'],
      climateVulnerability: 'alta',
      marketRisk: 'alto',
      cycloneVulnerability: 'alta',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'alto',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'negativo',
      rotationCompatibility: ['Milho', 'Sorgo', 'Leguminosas']
    },
    agronomy: {
      plantingDensity: '50.000-80.000 plantas/ha',
      spacingRecommendation: '90cm entre fileiras, 20cm entre plantas',
      fertiliserProgram: ['NPK base', 'Ureia parcelada', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Beneficiamento', 'Classificação', 'Enfardamento']
    }
  },

  // OLEAGINOSAS
  {
    id: 'girassol',
    name: 'Girassol',
    localName: 'Girassol',
    category: 'oleaginosas',
    icon: '🌻',
    season: 'seca',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 30 },
    idealRegions: ['Manica', 'Sofala', 'Tete'],
    compatibleRegions: ['Zambézia', 'Gaza'],
    incompatibleRegions: ['Cabo Delgado (zonas húmidas)'],
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '400-800mm',
      altitudeRange: { min: 0, max: 2000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'baixo',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 10000,
      fertiliserCostPerHa: 25000,
      pesticideCostPerHa: 15000,
      laborCostPerHa: 12000,
      machineryDepreciationPerHa: 10000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 2000,
      pricePerKg: 60,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Lagarta da espiga', 'Pulgão', 'Gorgulho'],
      mainDiseases: ['Ferrugem', 'Podridão do capítulo', 'Murcha de Sclerotinia'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Milho', 'Soja', 'Leguminosas']
    },
    agronomy: {
      plantingDensity: '45.000-55.000 plantas/ha',
      spacingRecommendation: '70cm entre fileiras, 25cm entre plantas',
      fertiliserProgram: ['NPK base', 'Ureia cobertura', 'Boro'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Extração de óleo']
    }
  },

  // === NOVAS CULTURAS ADICIONADAS ===

  // CEREAIS ADICIONAIS
  {
    id: 'milheto',
    name: 'Milheto',
    localName: 'Mexoeira',
    category: 'cereais',
    icon: '🌾',
    season: 'chuvosa',
    growthPeriod: 90,
    waterRequirement: 'baixo',
    temperatureRange: { min: 22, max: 42 },
    idealRegions: ['Tete', 'Cabo Delgado', 'Niassa'],
    compatibleRegions: ['Gaza', 'Inhambane', 'Nampula'],
    incompatibleRegions: ['Zambézia (zonas húmidas)'],
    climate: {
      temperatureOptimal: 30,
      rainfallRequirement: '300-600mm',
      altitudeRange: { min: 0, max: 1200 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.5, max: 8.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso', 'Marginal'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 5000,
      fertiliserCostPerHa: 8000,
      pesticideCostPerHa: 3000,
      laborCostPerHa: 10000,
      machineryDepreciationPerHa: 4000,
      otherCostsPerHa: 3000,
      averageYieldPerHa: 1800,
      pricePerKg: 40,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Pássaros', 'Gafanhotos', 'Pulgão'],
      mainDiseases: ['Carvão', 'Ferrugem', 'Mancha foliar'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'média',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Leguminosas', 'Amendoim', 'Girassol']
    },
    agronomy: {
      plantingDensity: '200.000-250.000 plantas/ha',
      spacingRecommendation: '30cm entre fileiras, 15cm entre plantas',
      fertiliserProgram: ['NPK base mínimo'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Armazenamento']
    }
  },

  {
    id: 'trigo',
    name: 'Trigo',
    localName: 'Trigo',
    category: 'cereais',
    icon: '🌾',
    season: 'seca',
    growthPeriod: 110,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 28 },
    idealRegions: ['Manica', 'Tete (zonas altas)'],
    compatibleRegions: ['Niassa (planaltos)'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Sofala (baixadas)'],
    climate: {
      temperatureOptimal: 20,
      rainfallRequirement: '450-650mm',
      altitudeRange: { min: 800, max: 2000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso', 'Aluvial'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 15000,
      fertiliserCostPerHa: 35000,
      pesticideCostPerHa: 18000,
      laborCostPerHa: 20000,
      machineryDepreciationPerHa: 25000,
      otherCostsPerHa: 12000,
      averageYieldPerHa: 4500,
      pricePerKg: 45,
      priceVariability: 0.15
    },
    risks: {
      mainPests: ['Pulgão', 'Lagarta cortadeira', 'Percevejos'],
      mainDiseases: ['Ferrugem', 'Oídio', 'Septoriose'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Girassol', 'Canola']
    },
    agronomy: {
      plantingDensity: '4.000.000-5.000.000 plantas/ha',
      spacingRecommendation: '17cm entre fileiras, sementes espaçadas',
      fertiliserProgram: ['NPK base', 'Ureia cobertura', 'Micronutrientes'],
      harvestMethod: 'mecanizada',
      postHarvestHandling: ['Secagem', 'Limpeza', 'Armazenamento controlado']
    }
  },

  // LEGUMINOSAS ADICIONAIS
  {
    id: 'soja',
    name: 'Soja',
    localName: 'Soja',
    category: 'leguminosas',
    icon: '🫛',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 20, max: 32 },
    idealRegions: ['Tete', 'Manica', 'Nampula'],
    compatibleRegions: ['Niassa', 'Cabo Delgado', 'Zambézia'],
    incompatibleRegions: ['Gaza (zonas áridas)', 'Inhambane (sul)'],
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '600-900mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso', 'Latossolo'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 18000,
      fertiliserCostPerHa: 20000,
      pesticideCostPerHa: 15000,
      laborCostPerHa: 12000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 8000,
      averageYieldPerHa: 2800,
      pricePerKg: 55,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Lagarta da soja', 'Percevejos', 'Mosca branca'],
      mainDiseases: ['Ferrugem asiática', 'Antracnose', 'Podridão radicular'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Milho', 'Sorgo', 'Algodão']
    },
    agronomy: {
      plantingDensity: '300.000-400.000 plantas/ha',
      spacingRecommendation: '45cm entre fileiras, 10cm entre plantas',
      fertiliserProgram: ['NPK base', 'Micronutrientes', 'Inoculante'],
      harvestMethod: 'ambos',
      postHarvestHandling: ['Secagem', 'Armazenamento', 'Processamento']
    }
  },

  {
    id: 'ervilha',
    name: 'Ervilha',
    localName: 'Ervilha',
    category: 'leguminosas',
    icon: '🟢',
    season: 'seca',
    growthPeriod: 80,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 25 },
    idealRegions: ['Manica', 'Tete (zonas altas)', 'Niassa'],
    compatibleRegions: ['Zambézia (planaltos)'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Sofala (baixadas)'],
    climate: {
      temperatureOptimal: 20,
      rainfallRequirement: '400-600mm',
      altitudeRange: { min: 600, max: 1800 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Argiloso'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'média',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 12000,
      fertiliserCostPerHa: 15000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 18000,
      machineryDepreciationPerHa: 6000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 2200,
      pricePerKg: 60,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Pulgão', 'Tripes', 'Gorgulho'],
      mainDiseases: ['Oídio', 'Antracnose', 'Murcha'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cereais', 'Hortaliças', 'Tubérculos']
    },
    agronomy: {
      plantingDensity: '400.000-500.000 plantas/ha',
      spacingRecommendation: '30cm entre fileiras, 5cm entre plantas',
      fertiliserProgram: ['NPK base', 'Inoculante'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Embalagem']
    }
  },

  // HORTALIÇAS
  {
    id: 'tomate',
    name: 'Tomate',
    localName: 'Tomate',
    category: 'hortaliças',
    icon: '🍅',
    season: 'seca',
    growthPeriod: 110,
    waterRequirement: 'alto',
    temperatureRange: { min: 18, max: 30 },
    idealRegions: ['Maputo', 'Manica', 'Sofala'],
    compatibleRegions: ['Zambézia', 'Tete', 'Nampula'],
    incompatibleRegions: ['Gaza (zonas muito quentes)'],
    climate: {
      temperatureOptimal: 24,
      rainfallRequirement: '600-800mm',
      altitudeRange: { min: 0, max: 1200 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Orgânico'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 25000,
      fertiliserCostPerHa: 45000,
      pesticideCostPerHa: 35000,
      laborCostPerHa: 60000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 20000,
      averageYieldPerHa: 35000,
      pricePerKg: 8,
      priceVariability: 0.40
    },
    risks: {
      mainPests: ['Mosca branca', 'Pulgão', 'Lagarta do tomate'],
      mainDiseases: ['Requeima', 'Pinta preta', 'Murcha bacteriana'],
      climateVulnerability: 'alta',
      marketRisk: 'alto',
      cycloneVulnerability: 'alta',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Cereais', 'Cebola']
    },
    agronomy: {
      plantingDensity: '25.000-30.000 plantas/ha',
      spacingRecommendation: '1m entre fileiras, 40cm entre plantas',
      fertiliserProgram: ['NPK base', 'Cobertura semanal', 'Cálcio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Classificação', 'Embalagem', 'Refrigeração']
    }
  },

  {
    id: 'cebola',
    name: 'Cebola',
    localName: 'Cebola',
    category: 'hortaliças',
    icon: '🧅',
    season: 'seca',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 15, max: 28 },
    idealRegions: ['Maputo', 'Gaza', 'Inhambane'],
    compatibleRegions: ['Sofala', 'Manica', 'Tete'],
    incompatibleRegions: ['Zambézia (zonas muito húmidas)'],
    climate: {
      temperatureOptimal: 22,
      rainfallRequirement: '350-500mm',
      altitudeRange: { min: 0, max: 1000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Aluvial'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 30000,
      fertiliserCostPerHa: 40000,
      pesticideCostPerHa: 20000,
      laborCostPerHa: 50000,
      machineryDepreciationPerHa: 10000,
      otherCostsPerHa: 15000,
      averageYieldPerHa: 25000,
      pricePerKg: 12,
      priceVariability: 0.35
    },
    risks: {
      mainPests: ['Trips', 'Minadora', 'Ácaros'],
      mainDiseases: ['Míldio', 'Podridão do colo', 'Queima das pontas'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Tomate', 'Leguminosas', 'Repolho']
    },
    agronomy: {
      plantingDensity: '400.000-500.000 plantas/ha',
      spacingRecommendation: '25cm entre fileiras, 10cm entre plantas',
      fertiliserProgram: ['NPK base', 'Ureia cobertura', 'Potássio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Cura', 'Classificação', 'Armazenamento']
    }
  },

  // FRUTÍFERAS ADICIONAIS
  {
    id: 'manga',
    name: 'Manga',
    localName: 'Manga',
    category: 'frutíferas',
    icon: '🥭',
    season: 'todo_ano',
    growthPeriod: 1825, // 5 anos para produção
    waterRequirement: 'médio',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Gaza', 'Inhambane', 'Sofala'],
    compatibleRegions: ['Maputo', 'Zambézia', 'Nampula'],
    incompatibleRegions: ['Tete (zonas secas)', 'Niassa (planaltos frios)'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '800-1200mm',
      altitudeRange: { min: 0, max: 800 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Laterítico'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'básico',
      seedCostPerHa: 50000,
      fertiliserCostPerHa: 30000,
      pesticideCostPerHa: 25000,
      laborCostPerHa: 40000,
      machineryDepreciationPerHa: 20000,
      otherCostsPerHa: 15000,
      averageYieldPerHa: 15000,
      pricePerKg: 25,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Mosca da fruta', 'Cochonilha', 'Ácaro'],
      mainDiseases: ['Antracnose', 'Oídio', 'Podridão do fruto'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio',
      cycloneVulnerability: 'alta',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Culturas anuais intercalares']
    },
    agronomy: {
      plantingDensity: '100-200 árvores/ha',
      spacingRecommendation: '8m x 8m ou 10m x 10m',
      fertiliserProgram: ['NPK anual', 'Micronutrientes', 'Matéria orgânica'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Classificação', 'Embalagem', 'Refrigeração']
    }
  },

  {
    id: 'laranja',
    name: 'Laranja',
    localName: 'Laranja',
    category: 'frutíferas',
    icon: '🍊',
    season: 'todo_ano',
    growthPeriod: 1460, // 4 anos para produção
    waterRequirement: 'alto',
    temperatureRange: { min: 18, max: 32 },
    idealRegions: ['Gaza', 'Inhambane', 'Maputo'],
    compatibleRegions: ['Sofala', 'Zambézia', 'Manica'],
    incompatibleRegions: ['Tete (zonas secas)', 'Cabo Delgado (norte)'],
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '1000-1400mm',
      altitudeRange: { min: 0, max: 600 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Aluvial'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 80000,
      fertiliserCostPerHa: 50000,
      pesticideCostPerHa: 40000,
      laborCostPerHa: 60000,
      machineryDepreciationPerHa: 30000,
      otherCostsPerHa: 20000,
      averageYieldPerHa: 25000,
      pricePerKg: 20,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Cochonilha', 'Ácaro', 'Minadora dos citros'],
      mainDiseases: ['Cancro cítrico', 'Gomose', 'Clorose variegada'],
      climateVulnerability: 'média',
      marketRisk: 'baixo',
      cycloneVulnerability: 'alta',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Culturas intercalares']
    },
    agronomy: {
      plantingDensity: '200-400 árvores/ha',
      spacingRecommendation: '6m x 6m ou 5m x 5m',
      fertiliserProgram: ['NPK trimestral', 'Cálcio', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Lavagem', 'Classificação', 'Enceramento']
    }
  },

  // TUBÉRCULOS ADICIONAIS
  {
    id: 'inhame',
    name: 'Inhame',
    localName: 'Inhame',
    category: 'tubérculos',
    icon: '🍠',
    season: 'chuvosa',
    growthPeriod: 270,
    waterRequirement: 'alto',
    temperatureRange: { min: 22, max: 32 },
    idealRegions: ['Zambézia', 'Sofala', 'Nampula'],
    compatibleRegions: ['Cabo Delgado', 'Niassa', 'Manica'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete (zonas secas)'],
    climate: {
      temperatureOptimal: 27,
      rainfallRequirement: '1000-1500mm',
      altitudeRange: { min: 0, max: 1000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'moderada',
      soilTypes: ['Franco', 'Franco-argiloso', 'Aluvial'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'média',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 40000,
      fertiliserCostPerHa: 30000,
      pesticideCostPerHa: 15000,
      laborCostPerHa: 45000,
      machineryDepreciationPerHa: 8000,
      otherCostsPerHa: 12000,
      averageYieldPerHa: 18000,
      pricePerKg: 15,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Gorgulho', 'Escaravelhos', 'Nematóides'],
      mainDiseases: ['Antracnose', 'Podridão seca', 'Viroses'],
      climateVulnerability: 'média',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'moderada',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Cereais', 'Leguminosas']
    },
    agronomy: {
      plantingDensity: '10.000-15.000 plantas/ha',
      spacingRecommendation: '1m x 1m com tutores',
      fertiliserProgram: ['NPK base', 'Matéria orgânica', 'Potássio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Cura', 'Limpeza', 'Armazenamento']
    }
  },

  // INDUSTRIAIS ADICIONAIS
  {
    id: 'cana_acucar',
    name: 'Cana-de-açúcar',
    localName: 'Cana-de-açúcar',
    category: 'industriais',
    icon: '🎋',
    season: 'todo_ano',
    growthPeriod: 365,
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Sofala', 'Zambézia', 'Nampula'],
    compatibleRegions: ['Cabo Delgado', 'Inhambane', 'Gaza'],
    incompatibleRegions: ['Tete (zonas secas)', 'Niassa (planaltos frios)'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '1200-1800mm',
      altitudeRange: { min: 0, max: 1000 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'moderada',
      soilTypes: ['Franco', 'Franco-argiloso', 'Aluvial'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 25000,
      fertiliserCostPerHa: 60000,
      pesticideCostPerHa: 30000,
      laborCostPerHa: 80000,
      machineryDepreciationPerHa: 50000,
      otherCostsPerHa: 25000,
      averageYieldPerHa: 80000,
      pricePerKg: 4,
      priceVariability: 0.15
    },
    risks: {
      mainPests: ['Broca da cana', 'Cupim', 'Cigarrinha'],
      mainDiseases: ['Ferrugem', 'Carvão', 'Mosaico'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo',
      cycloneVulnerability: 'alta',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'alta',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Renovação de canavial']
    },
    agronomy: {
      plantingDensity: '60.000-80.000 toletes/ha',
      spacingRecommendation: '1,5m entre fileiras',
      fertiliserProgram: ['NPK base', 'Ureia cobertura', 'Vinhaça'],
      harvestMethod: 'mecanizada',
      postHarvestHandling: ['Transporte rápido', 'Processamento imediato']
    }
  },

  // OLEAGINOSAS ADICIONAIS
  {
    id: 'gergelim',
    name: 'Gergelim',
    localName: 'Gergelim',
    category: 'oleaginosas',
    icon: '🌱',
    season: 'chuvosa',
    growthPeriod: 95,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 38 },
    idealRegions: ['Cabo Delgado', 'Nampula', 'Tete'],
    compatibleRegions: ['Niassa', 'Gaza', 'Inhambane'],
    incompatibleRegions: ['Zambézia (zonas muito húmidas)'],
    climate: {
      temperatureOptimal: 30,
      rainfallRequirement: '400-700mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 8.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Arenoso'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 8000,
      fertiliserCostPerHa: 12000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 15000,
      machineryDepreciationPerHa: 6000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 800,
      pricePerKg: 120,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Pulgão', 'Trips', 'Gafanhotos'],
      mainDiseases: ['Murcha bacteriana', 'Mancha foliar', 'Podridão radicular'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'média',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cereais', 'Leguminosas', 'Algodão']
    },
    agronomy: {
      plantingDensity: '150.000-200.000 plantas/ha',
      spacingRecommendation: '30cm entre fileiras, 15cm entre plantas',
      fertiliserProgram: ['NPK base baixo', 'Fósforo'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Limpeza', 'Armazenamento']
    }
  },

  // ESPECIARIAS
  {
    id: 'gengibre',
    name: 'Gengibre',
    localName: 'Gengibre',
    category: 'especiarias',
    icon: '🫚',
    season: 'chuvosa',
    growthPeriod: 270,
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 30 },
    idealRegions: ['Zambézia', 'Sofala', 'Nampula'],
    compatibleRegions: ['Cabo Delgado', 'Manica', 'Niassa'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete (zonas secas)'],
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '1000-1500mm',
      altitudeRange: { min: 0, max: 1200 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Rico em matéria orgânica'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 60000,
      fertiliserCostPerHa: 50000,
      pesticideCostPerHa: 25000,
      laborCostPerHa: 80000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 20000,
      averageYieldPerHa: 12000,
      pricePerKg: 45,
      priceVariability: 0.50
    },
    risks: {
      mainPests: ['Trips', 'Ácaros', 'Nematóides'],
      mainDiseases: ['Podridão mole', 'Murcha bacteriana', 'Mancha foliar'],
      climateVulnerability: 'alta',
      marketRisk: 'alto',
      cycloneVulnerability: 'média',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '40.000-50.000 rizomas/ha',
      spacingRecommendation: '30cm entre fileiras, 20cm entre plantas',
      fertiliserProgram: ['Matéria orgânica', 'NPK', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Lavagem', 'Secagem', 'Processamento']
    }
  },

  {
    id: 'pimenta',
    name: 'Pimenta',
    localName: 'Piri-piri',
    category: 'especiarias',
    icon: '🌶️',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 32 },
    idealRegions: ['Sofala', 'Zambézia', 'Manica'],
    compatibleRegions: ['Nampula', 'Cabo Delgado', 'Tete'],
    incompatibleRegions: ['Gaza (zonas muito quentes)', 'Niassa (zonas frias)'],
    climate: {
      temperatureOptimal: 26,
      rainfallRequirement: '600-1000mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Bem drenado'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'média',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'básico',
      seedCostPerHa: 15000,
      fertiliserCostPerHa: 25000,
      pesticideCostPerHa: 20000,
      laborCostPerHa: 45000,
      machineryDepreciationPerHa: 8000,
      otherCostsPerHa: 12000,
      averageYieldPerHa: 3500,
      pricePerKg: 80,
      priceVariability: 0.45
    },
    risks: {
      mainPests: ['Pulgão', 'Trips', 'Mosca branca'],
      mainDiseases: ['Antracnose', 'Murcha bacteriana', 'Viroses'],
      climateVulnerability: 'média',
      marketRisk: 'alto',
      cycloneVulnerability: 'média',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Tomate', 'Cebola', 'Leguminosas']
    },
    agronomy: {
      plantingDensity: '20.000-25.000 plantas/ha',
      spacingRecommendation: '60cm entre fileiras, 40cm entre plantas',
      fertiliserProgram: ['NPK base', 'Cobertura orgânica', 'Cálcio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Moagem', 'Embalagem']
    }
  },

  // === CULTURAS ADICIONAIS - EXPANSÃO COMPLETA ===

  // CEREAIS ADICIONAIS
  {
    id: 'aveia',
    name: 'Aveia',
    localName: 'Aveia',
    category: 'cereais',
    icon: '🌾',
    season: 'seca',
    growthPeriod: 100,
    waterRequirement: 'médio',
    temperatureRange: { min: 12, max: 25 },
    idealRegions: ['Manica', 'Tete (zonas altas)', 'Niassa (planaltos)'],
    compatibleRegions: ['Zambézia (zonas altas)'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Sofala (baixadas)'],
    climate: {
      temperatureOptimal: 18,
      rainfallRequirement: '400-700mm',
      altitudeRange: { min: 800, max: 2200 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Bem drenado'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'baixa',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 10000,
      fertiliserCostPerHa: 18000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 12000,
      machineryDepreciationPerHa: 8000,
      otherCostsPerHa: 4000,
      averageYieldPerHa: 2500,
      pricePerKg: 30,
      priceVariability: 0.15
    },
    risks: {
      mainPests: ['Pulgão', 'Lagarta cortadeira', 'Trips'],
      mainDiseases: ['Ferrugem', 'Oídio', 'Mancha foliar'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Trigo', 'Canola']
    },
    agronomy: {
      plantingDensity: '3.500.000-4.000.000 plantas/ha',
      spacingRecommendation: '17cm entre fileiras',
      fertiliserProgram: ['NPK base', 'Ureia cobertura'],
      harvestMethod: 'mecanizada',
      postHarvestHandling: ['Secagem', 'Limpeza', 'Armazenamento']
    }
  },

  {
    id: 'cevada',
    name: 'Cevada',
    localName: 'Cevada',
    category: 'cereais',
    icon: '🌾',
    season: 'seca',
    growthPeriod: 95,
    waterRequirement: 'baixo',
    temperatureRange: { min: 10, max: 22 },
    idealRegions: ['Manica (zonas altas)', 'Tete (planaltos)'],
    compatibleRegions: ['Niassa (zonas frias)'],
    incompatibleRegions: ['Todas as zonas baixas e quentes'],
    climate: {
      temperatureOptimal: 16,
      rainfallRequirement: '350-500mm',
      altitudeRange: { min: 1000, max: 2500 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.5, max: 7.8 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso', 'Calcário'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'estável',
      laborRequirement: 'baixo',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'baixa',
      exportPotential: 'baixo',
      processingNeed: 'avançado',
      seedCostPerHa: 12000,
      fertiliserCostPerHa: 20000,
      pesticideCostPerHa: 10000,
      laborCostPerHa: 15000,
      machineryDepreciationPerHa: 12000,
      otherCostsPerHa: 6000,
      averageYieldPerHa: 3200,
      pricePerKg: 28,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Pulgão', 'Lagarta cortadeira', 'Gorgulho'],
      mainDiseases: ['Ferrugem', 'Oídio', 'Mancha reticular'],
      climateVulnerability: 'alta',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Oleaginosas', 'Trigo']
    },
    agronomy: {
      plantingDensity: '4.000.000-4.500.000 plantas/ha',
      spacingRecommendation: '15cm entre fileiras',
      fertiliserProgram: ['NPK base', 'Fósforo adicional'],
      harvestMethod: 'mecanizada',
      postHarvestHandling: ['Secagem', 'Malteação', 'Armazenamento']
    }
  },

  // LEGUMINOSAS ADICIONAIS
  {
    id: 'grao_bico',
    name: 'Grão-de-bico',
    localName: 'Grão-de-bico',
    category: 'leguminosas',
    icon: '🫛',
    season: 'seca',
    growthPeriod: 110,
    waterRequirement: 'baixo',
    temperatureRange: { min: 15, max: 30 },
    idealRegions: ['Tete', 'Manica', 'Gaza (zonas frescas)'],
    compatibleRegions: ['Inhambane', 'Niassa', 'Cabo Delgado'],
    incompatibleRegions: ['Zambézia (zonas húmidas)', 'Sofala (baixadas)'],
    climate: {
      temperatureOptimal: 22,
      rainfallRequirement: '400-600mm',
      altitudeRange: { min: 200, max: 1800 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Calcário'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'média',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'média',
      exportPotential: 'médio',
      processingNeed: 'básico',
      seedCostPerHa: 15000,
      fertiliserCostPerHa: 10000,
      pesticideCostPerHa: 8000,
      laborCostPerHa: 20000,
      machineryDepreciationPerHa: 5000,
      otherCostsPerHa: 7000,
      averageYieldPerHa: 1800,
      pricePerKg: 70,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Pulgão', 'Trips', 'Gorgulho'],
      mainDiseases: ['Murcha fusáriana', 'Antracnose', 'Ascoquitose'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cereais', 'Oleaginosas', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '300.000-400.000 plantas/ha',
      spacingRecommendation: '30cm entre fileiras, 10cm entre plantas',
      fertiliserProgram: ['Fósforo base', 'Inoculante'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem', 'Debulha', 'Classificação']
    }
  },

  {
    id: 'lentilha',
    name: 'Lentilha',
    localName: 'Lentilha',
    category: 'leguminosas',
    icon: '🫘',
    season: 'seca',
    growthPeriod: 85,
    waterRequirement: 'baixo',
    temperatureRange: { min: 12, max: 28 },
    idealRegions: ['Manica', 'Tete (zonas altas)', 'Niassa'],
    compatibleRegions: ['Gaza (zonas frescas)'],
    incompatibleRegions: ['Zambézia', 'Sofala (zonas húmidas)'],
    climate: {
      temperatureOptimal: 20,
      rainfallRequirement: '350-500mm',
      altitudeRange: { min: 500, max: 2000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-arenoso', 'Bem estruturado'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'baixa',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'baixo',
      profitabilityPotential: 'baixa',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 18000,
      fertiliserCostPerHa: 8000,
      pesticideCostPerHa: 6000,
      laborCostPerHa: 25000,
      machineryDepreciationPerHa: 4000,
      otherCostsPerHa: 5000,
      averageYieldPerHa: 1200,
      pricePerKg: 90,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Pulgão', 'Trips', 'Gorgulho'],
      mainDiseases: ['Antracnose', 'Ferrugem', 'Murcha'],
      climateVulnerability: 'média',
      marketRisk: 'alto',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cereais', 'Tubérculos', 'Oleaginosas']
    },
    agronomy: {
      plantingDensity: '1.000.000-1.200.000 plantas/ha',
      spacingRecommendation: '25cm entre fileiras, 3cm entre plantas',
      fertiliserProgram: ['Fósforo base', 'Inoculante específico'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem cuidadosa', 'Debulha', 'Peneiramento']
    }
  },

  // HORTALIÇAS ADICIONAIS
  {
    id: 'repolho',
    name: 'Repolho',
    localName: 'Couve-repolho',
    category: 'hortaliças',
    icon: '🥬',
    season: 'seca',
    growthPeriod: 90,
    waterRequirement: 'alto',
    temperatureRange: { min: 15, max: 25 },
    idealRegions: ['Maputo', 'Manica', 'Sofala'],
    compatibleRegions: ['Zambézia', 'Tete', 'Nampula'],
    incompatibleRegions: ['Gaza (zonas muito quentes)'],
    climate: {
      temperatureOptimal: 20,
      rainfallRequirement: '600-800mm',
      altitudeRange: { min: 0, max: 1500 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso', 'Rico em matéria orgânica'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 20000,
      fertiliserCostPerHa: 50000,
      pesticideCostPerHa: 30000,
      laborCostPerHa: 70000,
      machineryDepreciationPerHa: 12000,
      otherCostsPerHa: 18000,
      averageYieldPerHa: 40000,
      pricePerKg: 6,
      priceVariability: 0.35
    },
    risks: {
      mainPests: ['Pulgão', 'Lagarta da couve', 'Trips'],
      mainDiseases: ['Hérnia da couve', 'Podridão negra', 'Míldio'],
      climateVulnerability: 'alta',
      marketRisk: 'médio',
      cycloneVulnerability: 'alta',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Leguminosas', 'Tomate', 'Cenoura']
    },
    agronomy: {
      plantingDensity: '40.000-50.000 plantas/ha',
      spacingRecommendation: '50cm entre fileiras, 40cm entre plantas',
      fertiliserProgram: ['NPK base rico', 'Ureia cobertura', 'Cálcio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Limpeza', 'Embalagem', 'Refrigeração']
    }
  },

  {
    id: 'cenoura',
    name: 'Cenoura',
    localName: 'Cenoura',
    category: 'hortaliças',
    icon: '🥕',
    season: 'seca',
    growthPeriod: 100,
    waterRequirement: 'médio',
    temperatureRange: { min: 16, max: 28 },
    idealRegions: ['Maputo', 'Manica', 'Sofala'],
    compatibleRegions: ['Gaza', 'Inhambane', 'Tete'],
    incompatibleRegions: ['Zambézia (solos encharcados)'],
    climate: {
      temperatureOptimal: 22,
      rainfallRequirement: '500-700mm',
      altitudeRange: { min: 0, max: 1200 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco-arenoso', 'Arenoso', 'Solto e profundo'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'média',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'alta',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 35000,
      fertiliserCostPerHa: 45000,
      pesticideCostPerHa: 25000,
      laborCostPerHa: 80000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 20000,
      averageYieldPerHa: 30000,
      pricePerKg: 10,
      priceVariability: 0.30
    },
    risks: {
      mainPests: ['Mosca da cenoura', 'Pulgão', 'Nematóides'],
      mainDiseases: ['Queima das folhas', 'Podridão mole', 'Alternária'],
      climateVulnerability: 'média',
      marketRisk: 'médio',
      cycloneVulnerability: 'média',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'médio',
      soilConservation: 'moderada',
      carbonSequestration: 'baixa',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Repolho', 'Cebola', 'Leguminosas']
    },
    agronomy: {
      plantingDensity: '1.000.000-1.200.000 plantas/ha',
      spacingRecommendation: '25cm entre fileiras, 3cm entre plantas',
      fertiliserProgram: ['NPK base', 'Boro', 'Potássio cobertura'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Limpeza', 'Classificação', 'Embalagem']
    }
  },

  // FRUTÍFERAS ADICIONAIS
  {
    id: 'abacaxi',
    name: 'Ananás',
    localName: 'Ananás',
    category: 'frutíferas',
    icon: '🍍',
    season: 'todo_ano',
    growthPeriod: 540, // 18 meses
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 32 },
    idealRegions: ['Gaza', 'Inhambane', 'Sofala'],
    compatibleRegions: ['Zambézia', 'Nampula', 'Cabo Delgado'],
    incompatibleRegions: ['Tete (zonas secas)', 'Niassa (zonas frias)'],
    climate: {
      temperatureOptimal: 26,
      rainfallRequirement: '1000-1500mm',
      altitudeRange: { min: 0, max: 800 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 4.5, max: 6.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco-arenoso', 'Arenoso', 'Bem drenado'],
      fertilityRequirement: 'média'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'alta'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'moderada',
      laborRequirement: 'alto',
      infrastructureNeed: 'moderada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'básico',
      seedCostPerHa: 80000,
      fertiliserCostPerHa: 40000,
      pesticideCostPerHa: 30000,
      laborCostPerHa: 100000,
      machineryDepreciationPerHa: 25000,
      otherCostsPerHa: 25000,
      averageYieldPerHa: 35000,
      pricePerKg: 15,
      priceVariability: 0.35
    },
    risks: {
      mainPests: ['Cochonilha', 'Broca do ananás', 'Ácaros'],
      mainDiseases: ['Podridão do coração', 'Fusariose', 'Manchas foliares'],
      climateVulnerability: 'baixa',
      marketRisk: 'médio',
      cycloneVulnerability: 'alta',
      droughtRisk: 'baixo'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Culturas intercalares de ciclo curto']
    },
    agronomy: {
      plantingDensity: '30.000-40.000 plantas/ha',
      spacingRecommendation: '1,2m x 0,4m ou fileiras duplas',
      fertiliserProgram: ['NPK base', 'Ureia mensal', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Seleção', 'Embalagem', 'Refrigeração']
    }
  },

  {
    id: 'coco',
    name: 'Coqueiro',
    localName: 'Coco',
    category: 'frutíferas',
    icon: '🥥',
    season: 'todo_ano',
    growthPeriod: 2555, // 7 anos para produção
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Gaza', 'Inhambane', 'Sofala (costa)'],
    compatibleRegions: ['Zambézia (costa)', 'Nampula (costa)', 'Cabo Delgado (costa)'],
    incompatibleRegions: ['Tete', 'Niassa', 'Manica (interior)'],
    climate: {
      temperatureOptimal: 28,
      rainfallRequirement: '1500-2500mm',
      altitudeRange: { min: 0, max: 200 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.0, max: 8.0 },
      drainageRequirement: 'boa',
      soilTypes: ['Arenoso', 'Franco-arenoso', 'Costeiro'],
      fertilityRequirement: 'baixa'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'alta',
      priceStability: 'estável',
      laborRequirement: 'médio',
      infrastructureNeed: 'básica',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 60000,
      fertiliserCostPerHa: 35000,
      pesticideCostPerHa: 20000,
      laborCostPerHa: 50000,
      machineryDepreciationPerHa: 15000,
      otherCostsPerHa: 20000,
      averageYieldPerHa: 8000,
      pricePerKg: 8,
      priceVariability: 0.20
    },
    risks: {
      mainPests: ['Broca do coqueiro', 'Ácaro', 'Rinoceronte'],
      mainDiseases: ['Amarelecimento letal', 'Podridão do caule', 'Mancha anelar'],
      climateVulnerability: 'baixa',
      marketRisk: 'baixo',
      cycloneVulnerability: 'alta',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Culturas intercalares tolerantes à sombra']
    },
    agronomy: {
      plantingDensity: '140-200 palmeiras/ha',
      spacingRecommendation: '7m x 7m ou 8m x 8m triangular',
      fertiliserProgram: ['NPK anual', 'Cloreto de potássio', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Descascamento', 'Secagem', 'Processamento']
    }
  },

  // TUBÉRCULOS ADICIONAIS
  {
    id: 'cara',
    name: 'Cará',
    localName: 'Cará',
    category: 'tubérculos',
    icon: '🍠',
    season: 'chuvosa',
    growthPeriod: 300,
    waterRequirement: 'alto',
    temperatureRange: { min: 20, max: 30 },
    idealRegions: ['Zambézia', 'Sofala', 'Nampula'],
    compatibleRegions: ['Cabo Delgado', 'Manica', 'Niassa'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete (zonas secas)'],
    climate: {
      temperatureOptimal: 25,
      rainfallRequirement: '1200-1800mm',
      altitudeRange: { min: 0, max: 1200 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 5.5, max: 7.0 },
      drainageRequirement: 'moderada',
      soilTypes: ['Franco', 'Franco-argiloso', 'Rico em matéria orgânica'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'estável',
      laborRequirement: 'alto',
      infrastructureNeed: 'básica',
      investmentLevel: 'médio',
      profitabilityPotential: 'baixa',
      exportPotential: 'baixo',
      processingNeed: 'básico',
      seedCostPerHa: 50000,
      fertiliserCostPerHa: 35000,
      pesticideCostPerHa: 18000,
      laborCostPerHa: 55000,
      machineryDepreciationPerHa: 10000,
      otherCostsPerHa: 12000,
      averageYieldPerHa: 15000,
      pricePerKg: 18,
      priceVariability: 0.25
    },
    risks: {
      mainPests: ['Gorgulho', 'Nematóides', 'Escaravelhos'],
      mainDiseases: ['Antracnose', 'Podridão seca', 'Viroses'],
      climateVulnerability: 'média',
      marketRisk: 'baixo',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'moderada',
      carbonSequestration: 'média',
      biodiversityImpact: 'neutro',
      rotationCompatibility: ['Cereais', 'Leguminosas', 'Hortaliças']
    },
    agronomy: {
      plantingDensity: '8.000-12.000 plantas/ha',
      spacingRecommendation: '1,5m x 1m com tutores altos',
      fertiliserProgram: ['NPK base', 'Matéria orgânica abundante', 'Potássio'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Cura ao ar', 'Limpeza', 'Armazenamento ventilado']
    }
  },

  // OLEAGINOSAS ADICIONAIS
  {
    id: 'canola',
    name: 'Canola',
    localName: 'Colza',
    category: 'oleaginosas',
    icon: '🌻',
    season: 'seca',
    growthPeriod: 110,
    waterRequirement: 'médio',
    temperatureRange: { min: 12, max: 25 },
    idealRegions: ['Manica', 'Tete (zonas altas)', 'Niassa (planaltos)'],
    compatibleRegions: ['Zambézia (zonas altas)'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Sofala (baixadas)'],
    climate: {
      temperatureOptimal: 18,
      rainfallRequirement: '500-800mm',
      altitudeRange: { min: 800, max: 2000 },
      photoperiodSensitive: true
    },
    soil: {
      phOptimal: { min: 6.0, max: 7.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Franco-argiloso', 'Bem estruturado'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'moderada',
      waterEfficiency: 'alta',
      droughtTolerance: 'média'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'moderada',
      laborRequirement: 'baixo',
      infrastructureNeed: 'moderada',
      investmentLevel: 'médio',
      profitabilityPotential: 'média',
      exportPotential: 'médio',
      processingNeed: 'avançado',
      seedCostPerHa: 20000,
      fertiliserCostPerHa: 30000,
      pesticideCostPerHa: 25000,
      laborCostPerHa: 15000,
      machineryDepreciationPerHa: 18000,
      otherCostsPerHa: 8000,
      averageYieldPerHa: 1500,
      pricePerKg: 95,
      priceVariability: 0.40
    },
    risks: {
      mainPests: ['Pulgão', 'Altíca', 'Lagarta'],
      mainDiseases: ['Esclerotínia', 'Blackleg', 'Alternária'],
      climateVulnerability: 'alta',
      marketRisk: 'alto',
      cycloneVulnerability: 'baixa',
      droughtRisk: 'médio'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'boa',
      carbonSequestration: 'média',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cereais', 'Leguminosas', 'Cevada']
    },
    agronomy: {
      plantingDensity: '80-120 plantas/m²',
      spacingRecommendation: '15cm entre fileiras, sementes espaçadas',
      fertiliserProgram: ['NPK base alto', 'Boro', 'Enxofre'],
      harvestMethod: 'mecanizada',
      postHarvestHandling: ['Secagem', 'Limpeza', 'Extração de óleo']
    }
  },

  // ESPECIARIAS ADICIONAIS
  {
    id: 'cardamomo',
    name: 'Cardamomo',
    localName: 'Cardamomo',
    category: 'especiarias',
    icon: '🌿',
    season: 'todo_ano',
    growthPeriod: 1095, // 3 anos para produção
    waterRequirement: 'alto',
    temperatureRange: { min: 18, max: 28 },
    idealRegions: ['Zambézia (zonas sombreadas)', 'Sofala (montanhas)'],
    compatibleRegions: ['Manica (zonas húmidas)', 'Nampula (florestas)'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete', 'Cabo Delgado'],
    climate: {
      temperatureOptimal: 23,
      rainfallRequirement: '1500-2500mm',
      altitudeRange: { min: 600, max: 1500 },
      photoperiodSensitive: false
    },
    soil: {
      phOptimal: { min: 5.0, max: 6.5 },
      drainageRequirement: 'boa',
      soilTypes: ['Franco', 'Rico em matéria orgânica', 'Florestal'],
      fertilityRequirement: 'alta'
    },
    water: {
      irrigationDependency: 'essencial',
      waterEfficiency: 'baixa',
      droughtTolerance: 'baixa'
    },
    economic: {
      marketDemand: 'baixa',
      priceStability: 'volátil',
      laborRequirement: 'alto',
      infrastructureNeed: 'avançada',
      investmentLevel: 'alto',
      profitabilityPotential: 'alta',
      exportPotential: 'alto',
      processingNeed: 'avançado',
      seedCostPerHa: 100000,
      fertiliserCostPerHa: 60000,
      pesticideCostPerHa: 40000,
      laborCostPerHa: 120000,
      machineryDepreciationPerHa: 20000,
      otherCostsPerHa: 30000,
      averageYieldPerHa: 200,
      pricePerKg: 2500,
      priceVariability: 0.60
    },
    risks: {
      mainPests: ['Trips', 'Cochonilha', 'Nematóides'],
      mainDiseases: ['Podridão radicular', 'Mancha foliar', 'Viroses'],
      climateVulnerability: 'alta',
      marketRisk: 'alto',
      cycloneVulnerability: 'média',
      droughtRisk: 'alto'
    },
    sustainability: {
      environmentalImpact: 'baixo',
      soilConservation: 'excelente',
      carbonSequestration: 'alta',
      biodiversityImpact: 'positivo',
      rotationCompatibility: ['Cultivo agroflorestal']
    },
    agronomy: {
      plantingDensity: '2.500-4.000 plantas/ha',
      spacingRecommendation: '2m x 2m sob sombra',
      fertiliserProgram: ['Matéria orgânica rica', 'NPK especializado', 'Micronutrientes'],
      harvestMethod: 'manual',
      postHarvestHandling: ['Secagem controlada', 'Processamento especializado']
    }
  }
];

// Categorias expandidas
export const EXPANDED_CATEGORY_LABELS = {
  'cereais': 'Cereais',
  'leguminosas': 'Leguminosas', 
  'tubérculos': 'Tubérculos',
  'frutíferas': 'Frutíferas',
  'hortaliças': 'Hortaliças',
  'industriais': 'Industriais',
  'oleaginosas': 'Oleaginosas',
  'especiarias': 'Especiarias'
};

// Compatibilidade com o sistema existente
export interface SimpleCropData {
  id: string;
  name: string;
  category: 'cereais' | 'leguminosas' | 'hortaliças' | 'frutíferas' | 'tubérculos' | 'industriais' | 'oleaginosas' | 'especiarias';
  icon: string;
  season: 'chuvosa' | 'seca' | 'todo_ano';
  growthPeriod: number;
  waterRequirement: 'baixo' | 'médio' | 'alto';
  temperatureRange: { min: number; max: number };
  idealRegions: string[];
  compatibleRegions: string[];
  incompatibleRegions: string[];
  climate: any;
  soil: any;
  water: any;
  economic: any;
  risks: any;
  sustainability: any;
  plantingTime: string;
}

export const SIMPLE_CROPS_DATABASE_EXPANDED: SimpleCropData[] = MOZAMBIQUE_CROPS.map(crop => ({
  id: crop.id,
  name: crop.name,
  category: crop.category,
  icon: crop.icon,
  season: crop.season,
  growthPeriod: crop.growthPeriod,
  waterRequirement: crop.waterRequirement,
  temperatureRange: crop.temperatureRange,
  idealRegions: crop.idealRegions,
  compatibleRegions: crop.compatibleRegions,
  incompatibleRegions: crop.incompatibleRegions,
  climate: crop.climate,
  soil: crop.soil,
  water: crop.water,
  economic: crop.economic,
  risks: crop.risks,
  sustainability: crop.sustainability,
  plantingTime: `${crop.growthPeriod} dias`
}));

export { EXPANDED_CATEGORY_LABELS as CATEGORY_LABELS };
export { SIMPLE_CROPS_DATABASE_EXPANDED as SIMPLE_CROPS_DATABASE };
