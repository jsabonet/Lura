// Sistema de Cálculo Inteligente de Investimentos Agrícolas
// Adaptado para Moçambique com dados realistas e variáveis regionais

import { MozambiqueCropData, MOZAMBIQUE_CROPS } from '@/data/mozambiqueCropsDatabase';

export interface WeatherConditions {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
}

export interface RegionalFactors {
  name: string;
  laborCostMultiplier: number; // Multiplicador baseado na região
  transportCostMultiplier: number;
  inputAvailabilityMultiplier: number;
  marketAccessMultiplier: number;
  infrastructureLevel: 'básica' | 'moderada' | 'avançada';
  averageRainfall: number;
  soilQualityIndex: number; // 0-1
  altitudeRange: { min: number; max: number };
}

export interface SeasonalFactors {
  month: number;
  seasonType: 'chuvosa' | 'seca' | 'transição';
  rainfallExpected: number;
  temperatureAverage: number;
  laborAvailability: number; // 0-1
  inputPriceMultiplier: number;
  marketDemandMultiplier: number;
}

export interface InvestmentCalculation {
  totalInvestment: number;
  breakdown: {
    seeds: number;
    fertilisers: number;
    pesticides: number;
    labor: number;
    machinery: number;
    other: number;
  };
  expectedRevenue: number;
  expectedProfit: number;
  profitMargin: number;
  paybackPeriod: number;
  riskAdjustedReturn: number;
  confidenceLevel: number;
  seasonalAdjustment: number;
  regionalAdjustment: number;
  recommendations: string[];
  warnings: string[];
}

// Dados regionais de Moçambique
export const REGIONAL_FACTORS: Record<string, RegionalFactors> = {
  'Maputo': {
    name: 'Maputo',
    laborCostMultiplier: 1.4,
    transportCostMultiplier: 0.8,
    inputAvailabilityMultiplier: 1.2,
    marketAccessMultiplier: 1.5,
    infrastructureLevel: 'avançada',
    averageRainfall: 800,
    soilQualityIndex: 0.7,
    altitudeRange: { min: 0, max: 200 }
  },
  'Gaza': {
    name: 'Gaza',
    laborCostMultiplier: 0.8,
    transportCostMultiplier: 1.2,
    inputAvailabilityMultiplier: 0.9,
    marketAccessMultiplier: 0.9,
    infrastructureLevel: 'básica',
    averageRainfall: 600,
    soilQualityIndex: 0.6,
    altitudeRange: { min: 0, max: 500 }
  },
  'Inhambane': {
    name: 'Inhambane',
    laborCostMultiplier: 0.9,
    transportCostMultiplier: 1.1,
    inputAvailabilityMultiplier: 1.0,
    marketAccessMultiplier: 1.1,
    infrastructureLevel: 'moderada',
    averageRainfall: 900,
    soilQualityIndex: 0.8,
    altitudeRange: { min: 0, max: 300 }
  },
  'Sofala': {
    name: 'Sofala',
    laborCostMultiplier: 1.0,
    transportCostMultiplier: 1.0,
    inputAvailabilityMultiplier: 1.1,
    marketAccessMultiplier: 1.2,
    infrastructureLevel: 'moderada',
    averageRainfall: 1200,
    soilQualityIndex: 0.9,
    altitudeRange: { min: 0, max: 1000 }
  },
  'Manica': {
    name: 'Manica',
    laborCostMultiplier: 0.9,
    transportCostMultiplier: 1.3,
    inputAvailabilityMultiplier: 0.9,
    marketAccessMultiplier: 0.8,
    infrastructureLevel: 'básica',
    averageRainfall: 1100,
    soilQualityIndex: 0.9,
    altitudeRange: { min: 200, max: 2500 }
  },
  'Tete': {
    name: 'Tete',
    laborCostMultiplier: 0.8,
    transportCostMultiplier: 1.4,
    inputAvailabilityMultiplier: 0.8,
    marketAccessMultiplier: 0.7,
    infrastructureLevel: 'básica',
    averageRainfall: 800,
    soilQualityIndex: 0.7,
    altitudeRange: { min: 100, max: 1500 }
  },
  'Zambézia': {
    name: 'Zambézia',
    laborCostMultiplier: 0.9,
    transportCostMultiplier: 1.1,
    inputAvailabilityMultiplier: 1.0,
    marketAccessMultiplier: 1.0,
    infrastructureLevel: 'moderada',
    averageRainfall: 1400,
    soilQualityIndex: 0.8,
    altitudeRange: { min: 0, max: 800 }
  },
  'Nampula': {
    name: 'Nampula',
    laborCostMultiplier: 1.0,
    transportCostMultiplier: 1.2,
    inputAvailabilityMultiplier: 1.1,
    marketAccessMultiplier: 1.1,
    infrastructureLevel: 'moderada',
    averageRainfall: 1000,
    soilQualityIndex: 0.7,
    altitudeRange: { min: 0, max: 1500 }
  },
  'Cabo Delgado': {
    name: 'Cabo Delgado',
    laborCostMultiplier: 0.9,
    transportCostMultiplier: 1.3,
    inputAvailabilityMultiplier: 0.9,
    marketAccessMultiplier: 0.8,
    infrastructureLevel: 'básica',
    averageRainfall: 1100,
    soilQualityIndex: 0.8,
    altitudeRange: { min: 0, max: 1000 }
  },
  'Niassa': {
    name: 'Niassa',
    laborCostMultiplier: 0.7,
    transportCostMultiplier: 1.5,
    inputAvailabilityMultiplier: 0.7,
    marketAccessMultiplier: 0.6,
    infrastructureLevel: 'básica',
    averageRainfall: 1200,
    soilQualityIndex: 0.8,
    altitudeRange: { min: 300, max: 2000 }
  }
};

// Fatores sazonais
export const SEASONAL_FACTORS: SeasonalFactors[] = [
  { month: 1, seasonType: 'chuvosa', rainfallExpected: 200, temperatureAverage: 28, laborAvailability: 0.8, inputPriceMultiplier: 1.2, marketDemandMultiplier: 1.1 },
  { month: 2, seasonType: 'chuvosa', rainfallExpected: 180, temperatureAverage: 28, laborAvailability: 0.8, inputPriceMultiplier: 1.2, marketDemandMultiplier: 1.1 },
  { month: 3, seasonType: 'chuvosa', rainfallExpected: 150, temperatureAverage: 27, laborAvailability: 0.9, inputPriceMultiplier: 1.1, marketDemandMultiplier: 1.2 },
  { month: 4, seasonType: 'transição', rainfallExpected: 80, temperatureAverage: 25, laborAvailability: 1.0, inputPriceMultiplier: 1.0, marketDemandMultiplier: 1.3 },
  { month: 5, seasonType: 'seca', rainfallExpected: 20, temperatureAverage: 23, laborAvailability: 1.0, inputPriceMultiplier: 0.9, marketDemandMultiplier: 1.4 },
  { month: 6, seasonType: 'seca', rainfallExpected: 10, temperatureAverage: 21, laborAvailability: 1.0, inputPriceMultiplier: 0.9, marketDemandMultiplier: 1.3 },
  { month: 7, seasonType: 'seca', rainfallExpected: 5, temperatureAverage: 20, laborAvailability: 1.0, inputPriceMultiplier: 0.8, marketDemandMultiplier: 1.2 },
  { month: 8, seasonType: 'seca', rainfallExpected: 10, temperatureAverage: 22, laborAvailability: 1.0, inputPriceMultiplier: 0.8, marketDemandMultiplier: 1.1 },
  { month: 9, seasonType: 'seca', rainfallExpected: 20, temperatureAverage: 25, laborAvailability: 1.0, inputPriceMultiplier: 0.9, marketDemandMultiplier: 1.0 },
  { month: 10, seasonType: 'transição', rainfallExpected: 60, temperatureAverage: 27, laborAvailability: 0.9, inputPriceMultiplier: 1.0, marketDemandMultiplier: 1.0 },
  { month: 11, seasonType: 'chuvosa', rainfallExpected: 120, temperatureAverage: 28, laborAvailability: 0.8, inputPriceMultiplier: 1.1, marketDemandMultiplier: 1.0 },
  { month: 12, seasonType: 'chuvosa', rainfallExpected: 160, temperatureAverage: 29, laborAvailability: 0.7, inputPriceMultiplier: 1.2, marketDemandMultiplier: 1.0 }
];

export function calculateInvestment(
  cropId: string,
  region: string,
  hectares: number = 1,
  currentMonth: number = new Date().getMonth() + 1,
  weatherConditions?: WeatherConditions,
  customFactors?: Partial<RegionalFactors>
): InvestmentCalculation {
  
  // Encontrar dados da cultura
  const crop = MOZAMBIQUE_CROPS.find(c => c.id === cropId);
  if (!crop) {
    throw new Error(`Cultura ${cropId} não encontrada`);
  }

  // Obter fatores regionais
  const regionalFactor = REGIONAL_FACTORS[region] || REGIONAL_FACTORS['Sofala'];
  const seasonalFactor = SEASONAL_FACTORS[currentMonth - 1];

  // Calcular custos base por hectare
  const baseCosts = {
    seeds: crop.economic.seedCostPerHa,
    fertilisers: crop.economic.fertiliserCostPerHa,
    pesticides: crop.economic.pesticideCostPerHa,
    labor: crop.economic.laborCostPerHa,
    machinery: crop.economic.machineryDepreciationPerHa,
    other: crop.economic.otherCostsPerHa
  };

  // Aplicar ajustes regionais
  const regionallyAdjustedCosts = {
    seeds: baseCosts.seeds * regionalFactor.inputAvailabilityMultiplier,
    fertilisers: baseCosts.fertilisers * regionalFactor.inputAvailabilityMultiplier,
    pesticides: baseCosts.pesticides * regionalFactor.inputAvailabilityMultiplier,
    labor: baseCosts.labor * regionalFactor.laborCostMultiplier,
    machinery: baseCosts.machinery * (regionalFactor.infrastructureLevel === 'avançada' ? 1.2 : regionalFactor.infrastructureLevel === 'moderada' ? 1.0 : 0.8),
    other: baseCosts.other * regionalFactor.transportCostMultiplier
  };

  // Aplicar ajustes sazonais
  const seasonallyAdjustedCosts = {
    seeds: regionallyAdjustedCosts.seeds * seasonalFactor.inputPriceMultiplier,
    fertilisers: regionallyAdjustedCosts.fertilisers * seasonalFactor.inputPriceMultiplier,
    pesticides: regionallyAdjustedCosts.pesticides * seasonalFactor.inputPriceMultiplier,
    labor: regionallyAdjustedCosts.labor * (1 / seasonalFactor.laborAvailability),
    machinery: regionallyAdjustedCosts.machinery,
    other: regionallyAdjustedCosts.other
  };

  // Calcular investimento total
  const totalCostPerHa = Object.values(seasonallyAdjustedCosts).reduce((sum, cost) => sum + cost, 0);
  const totalInvestment = totalCostPerHa * hectares;

  // Calcular receita esperada
  let yieldAdjustment = 1.0;
  
  // Ajuste por qualidade do solo
  yieldAdjustment *= regionalFactor.soilQualityIndex;
  
  // Ajuste por época de plantio
  const optimalSeason = crop.season;
  if (optimalSeason === seasonalFactor.seasonType) {
    yieldAdjustment *= 1.0;
  } else if (optimalSeason === 'todo_ano') {
    yieldAdjustment *= 0.95;
  } else {
    yieldAdjustment *= 0.7; // Penalização por época inadequada
  }

  // Ajuste por condições climáticas (se fornecidas)
  if (weatherConditions) {
    const tempOptimal = crop.climate.temperatureOptimal;
    const tempDiff = Math.abs(weatherConditions.temperature - tempOptimal);
    if (tempDiff > 5) {
      yieldAdjustment *= Math.max(0.6, 1 - (tempDiff - 5) * 0.05);
    }
  }

  const adjustedYield = crop.economic.averageYieldPerHa * yieldAdjustment;
  const pricePerKg = crop.economic.pricePerKg * regionalFactor.marketAccessMultiplier * seasonalFactor.marketDemandMultiplier;
  const expectedRevenue = adjustedYield * pricePerKg * hectares;

  // Calcular lucro e métricas
  const expectedProfit = expectedRevenue - totalInvestment;
  const profitMargin = (expectedProfit / expectedRevenue) * 100;
  const paybackPeriod = totalInvestment / (expectedProfit > 0 ? expectedProfit : expectedRevenue * 0.1);

  // Calcular risco
  const marketRiskFactor = crop.risks.marketRisk === 'alto' ? 0.3 : crop.risks.marketRisk === 'médio' ? 0.15 : 0.05;
  const climateRiskFactor = crop.risks.climateVulnerability === 'alta' ? 0.25 : crop.risks.climateVulnerability === 'média' ? 0.15 : 0.05;
  const totalRisk = marketRiskFactor + climateRiskFactor;
  const riskAdjustedReturn = expectedProfit * (1 - totalRisk);

  // Calcular nível de confiança
  const confidenceLevel = Math.max(0.3, Math.min(0.95, 
    0.8 * yieldAdjustment * 
    (regionalFactor.infrastructureLevel === 'avançada' ? 1.1 : regionalFactor.infrastructureLevel === 'moderada' ? 1.0 : 0.9) *
    (1 - totalRisk)
  ));

  // Gerar recomendações
  const recommendations: string[] = [];
  const warnings: string[] = [];

  if (yieldAdjustment < 0.8) {
    warnings.push('Condições não ideais para esta cultura na época/região atual');
  }

  if (optimalSeason !== seasonalFactor.seasonType && optimalSeason !== 'todo_ano') {
    recommendations.push(`Considere plantar na época ${optimalSeason} para melhor rendimento`);
  }

  if (regionalFactor.infrastructureLevel === 'básica' && crop.economic.infrastructureNeed === 'avançada') {
    warnings.push('Infraestrutura regional limitada pode afetar o sucesso da cultura');
  }

  if (crop.water.irrigationDependency === 'essencial' && seasonalFactor.rainfallExpected < 50) {
    recommendations.push('Investir em sistema de irrigação é essencial para esta época');
  }

  if (profitMargin > 30) {
    recommendations.push('Excelente potencial de lucratividade para esta cultura');
  } else if (profitMargin < 10) {
    warnings.push('Margem de lucro baixa - considere culturas alternativas');
  }

  return {
    totalInvestment,
    breakdown: {
      seeds: seasonallyAdjustedCosts.seeds * hectares,
      fertilisers: seasonallyAdjustedCosts.fertilisers * hectares,
      pesticides: seasonallyAdjustedCosts.pesticides * hectares,
      labor: seasonallyAdjustedCosts.labor * hectares,
      machinery: seasonallyAdjustedCosts.machinery * hectares,
      other: seasonallyAdjustedCosts.other * hectares
    },
    expectedRevenue,
    expectedProfit,
    profitMargin,
    paybackPeriod,
    riskAdjustedReturn,
    confidenceLevel,
    seasonalAdjustment: seasonalFactor.inputPriceMultiplier,
    regionalAdjustment: regionalFactor.inputAvailabilityMultiplier,
    recommendations,
    warnings
  };
}

export function formatCurrency(value: number): string {
  // Força a exibição da moeda para MZN (moeda atual de Moçambique)
  const formatted = new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  // Garantir que sempre exiba "MZN" e não "MTn" (formato antigo)
  // Força substituição e formatação consistente
  return formatted
    .replace(/MTn/g, 'MZN')
    .replace(/MT/g, 'MZN')
    .replace(/\s*MZN/, ' MZN'); // Garante espaço antes da moeda
}

// Função auxiliar para formatar valores monetários com unidade explícita
export function formatCurrencyWithUnit(value: number, unit: string = '/ha'): string {
  return `${formatCurrency(value)}${unit}`;
}

export function calculateMultipleCrops(
  cropIds: string[],
  region: string,
  hectares: number = 1,
  currentMonth: number = new Date().getMonth() + 1
): InvestmentCalculation[] {
  return cropIds.map(cropId => calculateInvestment(cropId, region, hectares, currentMonth));
}
