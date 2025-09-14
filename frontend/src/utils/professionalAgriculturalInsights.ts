// Sistema de Análise Agrícola Profissional Multidimensional
// Incorpora: Clima + Solo + Água + Mercado + Riscos + Sustentabilidade + Aspectos Culturais

import { COMPREHENSIVE_CROPS_DATABASE as CROPS_DATABASE, type CropData } from '../data/cropsDatabase';

// Interfaces para análise multidimensional
interface WeatherData {
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  windSpeed?: number;
  conditions?: string;
  region?: string;
}

interface SoilAnalysis {
  texture: 'arenoso' | 'franco' | 'argiloso';
  ph: number;
  organicMatter: 'baixo' | 'médio' | 'alto';
  drainage: 'boa' | 'moderada' | 'ruim';
  depth: 'raso' | 'médio' | 'profundo';
  fertility: 'baixa' | 'média' | 'alta';
}

interface WaterAvailability {
  irrigationAccess: boolean;
  waterSources: ('rio' | 'lencol' | 'barragem' | 'chuva')[];
  irrigationCost: 'baixo' | 'médio' | 'alto';
  reliability: 'alta' | 'média' | 'baixa';
}

interface MarketConditions {
  localDemand: 'alta' | 'média' | 'baixa';
  priceLevel: 'alto' | 'médio' | 'baixo';
  infrastructure: 'boa' | 'moderada' | 'ruim';
  laborAvailability: 'abundante' | 'moderada' | 'escassa';
  creditAccess: 'fácil' | 'moderado' | 'difícil';
}

interface RiskFactors {
  climaticRisks: string[];
  biologicalRisks: string[];
  marketRisks: string[];
  financialRisks: string[];
}

// Tipos de recomendação
interface CropRecommendation {
  cropId: string;
  cropName: string;
  overallScore: number; // 0-100
  viabilityLevel: 'alta' | 'média' | 'baixa' | 'não_recomendada';
  
  scores: {
    climate: number;
    soil: number;
    water: number;
    economic: number;
    risk: number;
    sustainability: number;
    cultural: number;
  };
  
  analysis: {
    strengths: string[];
    challenges: string[];
    requirements: string[];
    recommendations: string[];
  };
  
  timeline: {
    plantingWindow: string;
    criticalPeriods: string[];
    harvestPeriod: string;
  };
  
  economics: {
    estimatedInvestment: string;
    expectedReturn: string;
    paybackPeriod: string;
    profitabilityRisk: 'baixo' | 'médio' | 'alto';
  };
  
  sustainability: {
    environmentalImpact: string;
    soilHealth: string;
    rotationBenefits: string[];
  };
}

// Funções de análise multidimensional

export function analyzeClimateCompatibility(crop: CropData, weather: WeatherData): number {
  let score = 100;
  
  // Análise de temperatura
  if (weather.temperature !== undefined) {
    if (weather.temperature < crop.temperatureRange.min || weather.temperature > crop.temperatureRange.max) {
      score -= 30;
    } else if (weather.temperature < crop.temperatureRange.min + 2 || weather.temperature > crop.temperatureRange.max - 2) {
      score -= 15;
    }
  }
  
  // Análise de precipitação
  if (weather.precipitation !== undefined) {
    const annualPrecipitation = weather.precipitation * 12; // Estimativa anual
    if (annualPrecipitation < crop.climate.precipitationRange.min) {
      score -= 25;
    } else if (annualPrecipitation > crop.climate.precipitationRange.max) {
      score -= 15;
    }
  }
  
  // Análise de umidade
  if (weather.humidity !== undefined) {
    if (weather.humidity < crop.climate.humidityRange.min || weather.humidity > crop.climate.humidityRange.max) {
      score -= 20;
    }
  }
  
  // Análise de vento
  if (weather.windSpeed !== undefined && weather.windSpeed > 20) {
    if (crop.climate.windTolerance === 'baixa') score -= 25;
    else if (crop.climate.windTolerance === 'média') score -= 10;
  }
  
  return Math.max(0, score);
}

export function analyzeSoilCompatibility(crop: CropData, soil: SoilAnalysis): number {
  let score = 100;
  
  // Textura do solo
  if (!crop.soil.preferredTexture.includes(soil.texture)) {
    score -= 25;
  }
  
  // pH do solo
  if (soil.ph < crop.soil.phRange.min || soil.ph > crop.soil.phRange.max) {
    score -= 20;
  }
  
  // Matéria orgânica
  const organicMatterLevels = { 'baixo': 1, 'médio': 2, 'alto': 3 };
  const requiredLevel = organicMatterLevels[crop.soil.organicMatterRequirement];
  const actualLevel = organicMatterLevels[soil.organicMatter];
  if (actualLevel < requiredLevel) {
    score -= 15;
  }
  
  // Drenagem
  if (crop.soil.drainageRequirement === 'boa' && soil.drainage !== 'boa') {
    score -= 20;
  }
  
  // Fertilidade
  const fertilityLevels = { 'baixa': 1, 'média': 2, 'alta': 3 };
  const requiredFertility = fertilityLevels[crop.soil.fertilityRequirement];
  const actualFertility = fertilityLevels[soil.fertility];
  if (actualFertility < requiredFertility) {
    score -= 15;
  }
  
  return Math.max(0, score);
}

export function analyzeWaterAvailability(crop: CropData, water: WaterAvailability): number {
  let score = 100;
  
  // Dependência de irrigação
  if (crop.water.irrigationDependency === 'essencial' && !water.irrigationAccess) {
    return 0; // Inviável sem irrigação
  }
  
  if (crop.water.irrigationDependency === 'recomendada' && !water.irrigationAccess) {
    score -= 40;
  }
  
  // Custo da irrigação vs necessidade hídrica
  if (crop.waterRequirement === 'alto' && water.irrigationCost === 'alto') {
    score -= 25;
  }
  
  // Confiabilidade da fonte
  if (water.reliability === 'baixa' && crop.climate.droughtTolerance === 'baixa') {
    score -= 30;
  }
  
  return Math.max(0, score);
}

export function analyzeEconomicViability(crop: CropData, market: MarketConditions): number {
  let score = 100;
  
  // Demanda vs oferta de mercado
  const demandLevels = { 'baixa': 1, 'média': 2, 'alta': 3 };
  const marketDemand = demandLevels[crop.economic.marketDemand];
  const localDemand = demandLevels[market.localDemand];
  
  if (localDemand < marketDemand) {
    score -= 20;
  }
  
  // Necessidade de infraestrutura vs disponibilidade
  if (crop.economic.infrastructureNeed === 'avançada' && market.infrastructure !== 'boa') {
    score -= 30;
  }
  
  // Necessidade de mão de obra vs disponibilidade
  if (crop.economic.laborRequirement === 'alto' && market.laborAvailability === 'escassa') {
    score -= 25;
  }
  
  // Investimento vs acesso a crédito
  if (crop.economic.investmentLevel === 'alto' && market.creditAccess === 'difícil') {
    score -= 35;
  }
  
  // Estabilidade de preços
  if (crop.economic.priceStability === 'volátil') {
    score -= 15;
  }
  
  return Math.max(0, score);
}

export function analyzeRiskFactors(crop: CropData, risks: RiskFactors): number {
  let score = 100;
  
  // Vulnerabilidade climática
  if (crop.risks.climateVulnerability === 'alta') {
    score -= 25;
  } else if (crop.risks.climateVulnerability === 'média') {
    score -= 10;
  }
  
  // Riscos de mercado
  if (crop.risks.marketRisk === 'alto') {
    score -= 20;
  } else if (crop.risks.marketRisk === 'médio') {
    score -= 10;
  }
  
  // Presença de pragas e doenças na região
  const localPestRisks = risks.biologicalRisks.filter(risk => 
    crop.risks.mainPests.some(pest => pest.toLowerCase().includes(risk.toLowerCase()))
  );
  score -= localPestRisks.length * 5;
  
  return Math.max(0, score);
}

export function analyzeSustainability(crop: CropData): number {
  let score = 100;
  
  // Impacto ambiental
  if (crop.sustainability.environmentalImpact === 'alto') {
    score -= 30;
  } else if (crop.sustainability.environmentalImpact === 'médio') {
    score -= 15;
  }
  
  // Uso de pesticidas
  if (crop.sustainability.pesticidesUse === 'intensivo') {
    score -= 25;
  } else if (crop.sustainability.pesticidesUse === 'moderado') {
    score -= 10;
  }
  
  // Conservação do solo
  if (crop.sustainability.soilConservation === 'excelente') {
    score += 10;
  } else if (crop.sustainability.soilConservation === 'ruim') {
    score -= 20;
  }
  
  return Math.max(0, Math.min(100, score));
}

export function analyzeCulturalFactors(crop: CropData): number {
  let score = 100;
  
  // Conhecimento local
  if (crop.cultural.localKnowledge === 'amplo') {
    score += 10;
  } else if (crop.cultural.localKnowledge === 'limitado') {
    score -= 20;
  }
  
  // Aceitação cultural
  if (crop.cultural.culturalAcceptance === 'baixa') {
    score -= 25;
  } else if (crop.cultural.culturalAcceptance === 'alta') {
    score += 5;
  }
  
  // Segurança alimentar
  if (crop.cultural.foodSecurity === 'essencial') {
    score += 15;
  } else if (crop.cultural.foodSecurity === 'básica') {
    score -= 5;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Função principal de análise multidimensional
export function generateProfessionalCropRecommendations(
  selectedCrops: string[],
  weather: WeatherData,
  soil?: SoilAnalysis,
  water?: WaterAvailability,
  market?: MarketConditions,
  risks?: RiskFactors
): CropRecommendation[] {
  
  const defaultSoil: SoilAnalysis = {
    texture: 'franco',
    ph: 6.5,
    organicMatter: 'médio',
    drainage: 'boa',
    depth: 'médio',
    fertility: 'média'
  };
  
  const defaultWater: WaterAvailability = {
    irrigationAccess: false,
    waterSources: ['chuva'],
    irrigationCost: 'médio',
    reliability: 'média'
  };
  
  const defaultMarket: MarketConditions = {
    localDemand: 'média',
    priceLevel: 'médio',
    infrastructure: 'moderada',
    laborAvailability: 'moderada',
    creditAccess: 'moderado'
  };
  
  const defaultRisks: RiskFactors = {
    climaticRisks: ['seca', 'chuvas_excessivas'],
    biologicalRisks: ['pragas_comuns'],
    marketRisks: ['volatilidade_precos'],
    financialRisks: ['credito_limitado']
  };
  
  const soilData = soil || defaultSoil;
  const waterData = water || defaultWater;
  const marketData = market || defaultMarket;
  const riskData = risks || defaultRisks;
  
  const recommendations: CropRecommendation[] = [];
  
  for (const cropId of selectedCrops) {
    const crop = CROPS_DATABASE.find(c => c.id === cropId);
    if (!crop) continue;
    
    // Análises por dimensão
    const climateScore = analyzeClimateCompatibility(crop, weather);
    const soilScore = analyzeSoilCompatibility(crop, soilData);
    const waterScore = analyzeWaterAvailability(crop, waterData);
    const economicScore = analyzeEconomicViability(crop, marketData);
    const riskScore = analyzeRiskFactors(crop, riskData);
    const sustainabilityScore = analyzeSustainability(crop);
    const culturalScore = analyzeCulturalFactors(crop);
    
    // Peso das dimensões (pode ser customizado)
    const weights = {
      climate: 0.20,
      soil: 0.15,
      water: 0.15,
      economic: 0.20,
      risk: 0.15,
      sustainability: 0.10,
      cultural: 0.05
    };
    
    // Score global ponderado
    const overallScore = Math.round(
      climateScore * weights.climate +
      soilScore * weights.soil +
      waterScore * weights.water +
      economicScore * weights.economic +
      riskScore * weights.risk +
      sustainabilityScore * weights.sustainability +
      culturalScore * weights.cultural
    );
    
    // Determinar nível de viabilidade
    let viabilityLevel: 'alta' | 'média' | 'baixa' | 'não_recomendada';
    if (overallScore >= 80) viabilityLevel = 'alta';
    else if (overallScore >= 60) viabilityLevel = 'média';
    else if (overallScore >= 40) viabilityLevel = 'baixa';
    else viabilityLevel = 'não_recomendada';
    
    // Gerar análises detalhadas
    const strengths = generateStrengths(crop, { climateScore, soilScore, waterScore, economicScore, sustainabilityScore });
    const challenges = generateChallenges(crop, { climateScore, soilScore, waterScore, economicScore, riskScore });
    const requirements = generateRequirements(crop, soilData, waterData);
    const recommendations_list = generateRecommendations(crop, overallScore, { soilData, waterData, marketData });
    
    recommendations.push({
      cropId,
      cropName: crop.name,
      overallScore,
      viabilityLevel,
      scores: {
        climate: climateScore,
        soil: soilScore,
        water: waterScore,
        economic: economicScore,
        risk: riskScore,
        sustainability: sustainabilityScore,
        cultural: culturalScore
      },
      analysis: {
        strengths,
        challenges,
        requirements,
        recommendations: recommendations_list
      },
      timeline: generateTimeline(crop),
      economics: generateEconomics(crop, marketData),
      sustainability: generateSustainabilityAnalysis(crop)
    });
  }
  
  // Ordenar por score geral
  return recommendations.sort((a, b) => b.overallScore - a.overallScore);
}

// Funções auxiliares para gerar análises detalhadas

function generateStrengths(crop: CropData, scores: any): string[] {
  const strengths: string[] = [];
  
  if (scores.climateScore >= 80) {
    strengths.push(`Excelente adaptação às condições climáticas locais`);
  }
  
  if (scores.soilScore >= 80) {
    strengths.push(`Solo adequado para o desenvolvimento da cultura`);
  }
  
  if (scores.economicScore >= 80) {
    strengths.push(`Boa viabilidade econômica e demanda de mercado`);
  }
  
  if (crop.cultural.localKnowledge === 'amplo') {
    strengths.push(`Amplo conhecimento técnico disponível na região`);
  }
  
  if (crop.sustainability.soilConservation === 'excelente') {
    strengths.push(`Contribui para a conservação e melhoria do solo`);
  }
  
  if (crop.economic.profitabilityPotential === 'alta') {
    strengths.push(`Alto potencial de rentabilidade`);
  }
  
  return strengths;
}

function generateChallenges(crop: CropData, scores: any): string[] {
  const challenges: string[] = [];
  
  if (scores.climateScore < 60) {
    challenges.push(`Condições climáticas podem ser limitantes`);
  }
  
  if (scores.waterScore < 60) {
    challenges.push(`Necessidades hídricas podem exigir irrigação`);
  }
  
  if (scores.riskScore < 70) {
    challenges.push(`Presença de pragas e doenças na região`);
  }
  
  if (crop.economic.investmentLevel === 'alto') {
    challenges.push(`Requer investimento inicial significativo`);
  }
  
  if (crop.economic.laborRequirement === 'alto') {
    challenges.push(`Demanda alta intensidade de mão de obra`);
  }
  
  return challenges;
}

function generateRequirements(crop: CropData, soil: SoilAnalysis, water: WaterAvailability): string[] {
  const requirements: string[] = [];
  
  if (crop.water.irrigationDependency === 'essencial') {
    requirements.push(`Sistema de irrigação obrigatório`);
  }
  
  if (crop.soil.fertilityRequirement === 'alta' && soil.fertility !== 'alta') {
    requirements.push(`Adubação para melhorar fertilidade do solo`);
  }
  
  if (crop.economic.infrastructureNeed === 'avançada') {
    requirements.push(`Infraestrutura de armazenamento e transporte`);
  }
  
  if (crop.sustainability.pesticidesUse === 'intensivo') {
    requirements.push(`Programa de maneio integrado de pragas`);
  }
  
  return requirements;
}

function generateRecommendations(crop: CropData, score: number, context: any): string[] {
  const recommendations: string[] = [];
  
  if (score >= 80) {
    recommendations.push(`Cultura altamente recomendada para a região`);
  } else if (score >= 60) {
    recommendations.push(`Cultura viável com maneio adequado`);
  } else {
    recommendations.push(`Requer cuidados especiais e monitoramento constante`);
  }
  
  if (crop.sustainability.rotationCompatibility.length > 0) {
    recommendations.push(`Considere rotação com: ${crop.sustainability.rotationCompatibility.join(', ')}`);
  }
  
  if (crop.climate.droughtTolerance === 'baixa') {
    recommendations.push(`Planeje sistema de irrigação suplementar`);
  }
  
  return recommendations;
}

function generateTimeline(crop: CropData): any {
  return {
    plantingWindow: crop.season === 'chuvosa' ? 'Outubro - Dezembro' : 
                   crop.season === 'seca' ? 'Maio - Julho' : 'Todo o ano',
    criticalPeriods: ['Plantio', 'Floração', 'Enchimento de grãos'],
    harvestPeriod: `${crop.growthPeriod} dias após plantio`
  };
}

function generateEconomics(crop: CropData, market: MarketConditions): any {
  const investmentLevels = {
    'baixo': '64.000 - 192.000 MZN/ha',
    'médio': '192.000 - 510.000 MZN/ha',
    'alto': '510.000 - 960.000 MZN/ha'
  };
  
  const returnLevels = {
    'baixa': '128.000 - 320.000 MZN/ha',
    'média': '320.000 - 770.000 MZN/ha',
    'alta': '770.000 - 1.600.000 MZN/ha'
  };
  
  return {
    estimatedInvestment: investmentLevels[crop.economic.investmentLevel],
    expectedReturn: returnLevels[crop.economic.profitabilityPotential],
    paybackPeriod: crop.growthPeriod > 365 ? '2-3 anos' : '1 ano',
    profitabilityRisk: crop.risks.marketRisk
  };
}

function generateSustainabilityAnalysis(crop: CropData): any {
  return {
    environmentalImpact: crop.sustainability.environmentalImpact === 'baixo' ? 
      'Baixo impacto ambiental' : 'Impacto ambiental moderado a alto',
    soilHealth: crop.sustainability.soilConservation === 'excelente' ? 
      'Melhora a saúde do solo' : 'Neutro para a saúde do solo',
    rotationBenefits: crop.sustainability.rotationCompatibility.map(c => 
      `Beneficia cultivo subsequente de ${c}`)
  };
}

// Função para gerar insights baseados em weather + culturas selecionadas
export function generateWeatherInsights(weather: WeatherData, selectedCrops?: string[]): string[] {
  const insights: string[] = [];
  
  if (!selectedCrops || selectedCrops.length === 0) {
    // Insights gerais sem culturas específicas
    if (weather.temperature && weather.temperature > 30) {
      insights.push("🌡️ Temperaturas elevadas: Monitore irrigação e considere culturas resistentes ao calor");
    }
    
    if (weather.humidity && weather.humidity > 80) {
      insights.push("💧 Alta umidade: Risco aumentado de doenças fúngicas - intensifique monitoramento");
    }
    
    return insights;
  }
  
  // Gerar recomendações profissionais para as culturas selecionadas
  const recommendations = generateProfessionalCropRecommendations(selectedCrops, weather);
  
  // Converter recomendações em insights acionáveis
  recommendations.forEach(rec => {
    if (rec.viabilityLevel === 'alta') {
      insights.push(`✅ ${rec.cropName}: Condições ideais para cultivo (Score: ${rec.overallScore}%)`);
    } else if (rec.viabilityLevel === 'média') {
      insights.push(`⚠️ ${rec.cropName}: Viável com cuidados especiais (Score: ${rec.overallScore}%)`);
    } else if (rec.viabilityLevel === 'baixa') {
      insights.push(`🔴 ${rec.cropName}: Alto risco - considere alternativas (Score: ${rec.overallScore}%)`);
    }
    
    // Adicionar recomendações específicas
    rec.analysis.recommendations.slice(0, 2).forEach(recommendation => {
      insights.push(`💡 ${rec.cropName}: ${recommendation}`);
    });
  });
  
  return insights;
}

export default {
  generateProfessionalCropRecommendations,
  generateWeatherInsights,
  analyzeClimateCompatibility,
  analyzeSoilCompatibility,
  analyzeWaterAvailability,
  analyzeEconomicViability,
  analyzeRiskFactors,
  analyzeSustainability,
  analyzeCulturalFactors
};
