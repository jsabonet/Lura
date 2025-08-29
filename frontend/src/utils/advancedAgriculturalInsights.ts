// Sistema Avançado de Análise Agrícola com Ciclo de Plantas e Timing Sazonal
// Incorpora: Clima + Solo + Água + Mercado + Riscos + Sustentabilidade + Fenologia + Timing

import { SIMPLE_CROPS_DATABASE as CROPS_DATABASE, type SimpleCropData as CropData } from '../data/mozambiqueCropsDatabase';
import { calculateInvestment, formatCurrency, REGIONAL_FACTORS } from './investmentCalculator';
import { MOZAMBIQUE_CROPS } from '@/data/mozambiqueCropsDatabase';

// Interfaces avançadas para análise completa
interface WeatherData {
  temperature?: number;
  humidity?: number;
  precipitation?: number;
  windSpeed?: number;
  conditions?: string;
  region?: string;
}

interface CurrentSeason {
  month: number; // 1-12
  season: 'dry' | 'wet' | 'transition';
  daylength: number; // horas de luz solar
}

interface PhenologyStage {
  stage: 'planning' | 'planting' | 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'maturation' | 'harvest';
  daysFromPlanting: number;
  requirements: {
    temperature: { min: number; max: number };
    water: 'baixo' | 'médio' | 'alto' | 'crítico';
    nutrients: string[];
    management: string[];
  };
  risks: string[];
}

interface TimingAnalysis {
  currentStage: PhenologyStage | null;
  nextCriticalPeriod: { stage: string; daysUntil: number; preparation: string[] };
  plantingRecommendation: {
    status: 'ideal' | 'adequado' | 'tardio' | 'fora_da_epoca';
    timeWindow: string;
    consequences: string[];
  };
  harvestPrediction: {
    estimatedDate: string;
    marketTiming: 'ótimo' | 'bom' | 'regular' | 'ruim';
    storageRequirements: string[];
  };
}

interface AdvancedCropRecommendation {
  cropId: string;
  cropName: string;
  overallScore: number;
  viabilityLevel: 'alta' | 'média' | 'baixa' | 'não_recomendada';
  
  // Scores detalhados
  scores: {
    climate: number;
    soil: number;
    water: number;
    economic: number;
    risk: number;
    sustainability: number;
    cultural: number;
    timing: number; // NOVO: Score de timing sazonal
    phenology: number; // NOVO: Score de adequação fenológica
  };
  
  // Análise temporal
  timingAnalysis: TimingAnalysis;
  
  // Análise fenológica
  phenologyInsights: {
    currentSuitability: string;
    criticalUpcoming: string[];
    seasonalChallenges: string[];
    optimizationTips: string[];
  };
  
  // Análise de stress térmico e hídrico
  stressAnalysis: {
    thermalStress: {
      risk: 'baixo' | 'médio' | 'alto';
      criticalPeriods: string[];
      mitigation: string[];
    };
    waterStress: {
      risk: 'baixo' | 'médio' | 'alto';
      criticalPeriods: string[];
      irrigationNeeds: string[];
    };
  };
  
  // Análise de índices bioclimáticos
  bioclimaticIndices: {
    degreeDay: { accumulated: number; required: number; deficit: number };
    waterBalance: { supply: number; demand: number; deficit: number };
    stressIndex: number; // 0-1 (0 = sem stress, 1 = stress máximo)
  };
  
  // Recomendações específicas por fase
  phaseSpecificRecommendations: {
    prePlanting: string[];
    planting: string[];
    vegetative: string[];
    reproductive: string[];
    harvest: string[];
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
    expectedProfit?: string;
    profitMargin?: string;
    paybackPeriod: string;
    profitabilityRisk: 'baixo' | 'médio' | 'alto';
    riskAdjustedReturn?: string;
    confidenceLevel?: string;
  };
  
  sustainability: {
    environmentalImpact: string;
    soilHealth: string;
    rotationBenefits: string[];
  };
}

// Funções para análise temporal e fenológica

export function getCurrentSeason(month: number): CurrentSeason {
  // Para Moçambique (Hemisfério Sul)
  let season: 'dry' | 'wet' | 'transition';
  let daylength: number;
  
  if (month >= 11 || month <= 3) {
    season = 'wet'; // Estação chuvosa
    daylength = month === 12 || month === 1 ? 13.5 : 13; // Dias mais longos no verão
  } else if (month >= 5 && month <= 9) {
    season = 'dry'; // Estação seca
    daylength = month === 6 || month === 7 ? 11 : 11.5; // Dias mais curtos no inverno
  } else {
    season = 'transition'; // Transição
    daylength = 12; // Equinócio
  }
  
  return { month, season, daylength };
}

export function analyzeCurrentTiming(crop: CropData, currentSeason: CurrentSeason): number {
  let score = 100;
  
  // Verificar se estamos na época ideal de plantio
  if (crop.season === 'chuvosa' && currentSeason.season !== 'wet') {
    score -= 40; // Plantio fora da estação chuvosa
  } else if (crop.season === 'seca' && currentSeason.season !== 'dry') {
    score -= 40; // Plantio fora da estação seca
  }
  
  // Considerar fotoperíodo para culturas sensíveis
  // (Este seria expandido com dados reais de cada cultura)
  if (currentSeason.daylength < 11 && ['tomate', 'milho'].includes(crop.id)) {
    score -= 15; // Dias muito curtos podem afetar desenvolvimento
  }
  
  return Math.max(0, score);
}

export function analyzePhenologyCompatibility(crop: CropData, weather: WeatherData, currentSeason: CurrentSeason): number {
  let score = 100;
  
  // Análise baseada na fase de crescimento atual
  // (Seria expandido com dados específicos de fenologia)
  
  // Verificar se condições atuais são adequadas para início do ciclo
  if (weather.temperature && (weather.temperature < crop.temperatureRange.min || weather.temperature > crop.temperatureRange.max)) {
    score -= 30; // Temperatura inadequada para germinação/crescimento inicial
  }
  
  // Verificar disponibilidade hídrica para estabelecimento
  if (crop.waterRequirement === 'alto' && weather.precipitation && weather.precipitation < 50) {
    score -= 25; // Precipitação insuficiente para culturas exigentes
  }
  
  return Math.max(0, score);
}

export function calculateDegreeDay(crop: CropData, weather: WeatherData): { accumulated: number; required: number; deficit: number } {
  // Cálculo simplificado - seria expandido com dados históricos
  const baseTemp = 10; // Temperatura base genérica
  const maxTemp = 30; // Temperatura máxima genérica
  
  const currentTemp = weather.temperature || 25;
  const dailyDD = Math.max(0, Math.min(currentTemp - baseTemp, maxTemp - baseTemp));
  
  // Estimativa para o período de crescimento (seria baseado em dados reais)
  const requiredDD = crop.growthPeriod * 8; // Estimativa baseada no período de crescimento
  const accumulated = dailyDD * 30; // Estimativa para o mês atual
  
  return {
    accumulated,
    required: requiredDD,
    deficit: Math.max(0, requiredDD - accumulated)
  };
}

export function calculateWaterBalance(crop: CropData, weather: WeatherData): { supply: number; demand: number; deficit: number } {
  // Cálculo simplificado de balanço hídrico
  const precipitation = weather.precipitation || 0;
  const temperature = weather.temperature || 25;
  const humidity = weather.humidity || 70;
  
  // Estimativa de evapotranspiração (fórmula simplificada)
  const et0 = 2 + (temperature - 20) * 0.1 + (100 - humidity) * 0.05; // mm/dia
  
  // Coeficiente de cultura (estimativa)
  const kc = crop.waterRequirement === 'alto' ? 1.2 : crop.waterRequirement === 'médio' ? 0.8 : 0.5;
  const demand = et0 * kc * 30; // Demanda mensal
  
  const supply = precipitation * 30; // Oferta mensal (precipitação)
  
  return {
    supply,
    demand,
    deficit: Math.max(0, demand - supply)
  };
}

export function analyzeStressFactors(crop: CropData, weather: WeatherData): {
  thermalStress: { risk: 'baixo' | 'médio' | 'alto'; criticalPeriods: string[]; mitigation: string[] };
  waterStress: { risk: 'baixo' | 'médio' | 'alto'; criticalPeriods: string[]; irrigationNeeds: string[] };
} {
  const temperature = weather.temperature || 25;
  const precipitation = weather.precipitation || 0;
  
  // Análise de stress térmico
  let thermalRisk: 'baixo' | 'médio' | 'alto' = 'baixo';
  const thermalCritical: string[] = [];
  const thermalMitigation: string[] = [];
  
  if (temperature > crop.temperatureRange.max + 5) {
    thermalRisk = 'alto';
    thermalCritical.push('Temperatura excessiva durante floração');
    thermalMitigation.push('Implementar sombreamento', 'Irrigação por aspersão para resfriamento');
  } else if (temperature > crop.temperatureRange.max) {
    thermalRisk = 'médio';
    thermalMitigation.push('Monitorar temperatura do solo', 'Cobertura morta');
  }
  
  // Análise de stress hídrico
  let waterRisk: 'baixo' | 'médio' | 'alto' = 'baixo';
  const waterCritical: string[] = [];
  const irrigationNeeds: string[] = [];
  
  if (crop.waterRequirement === 'alto' && precipitation < 20) {
    waterRisk = 'alto';
    waterCritical.push('Deficit hídrico severo');
    irrigationNeeds.push('Irrigação diária necessária', 'Sistema de gotejamento recomendado');
  } else if (precipitation < 50) {
    waterRisk = 'médio';
    irrigationNeeds.push('Irrigação suplementar recomendada');
  }
  
  return {
    thermalStress: { risk: thermalRisk, criticalPeriods: thermalCritical, mitigation: thermalMitigation },
    waterStress: { risk: waterRisk, criticalPeriods: waterCritical, irrigationNeeds }
  };
}

export function generateTimingAnalysis(crop: CropData, currentSeason: CurrentSeason): TimingAnalysis {
  // Análise de timing baseada na estação atual
  let plantingStatus: 'ideal' | 'adequado' | 'tardio' | 'fora_da_epoca';
  let timeWindow: string;
  let consequences: string[] = [];
  
  // Determinar status do plantio baseado na estação
  if (crop.season === 'chuvosa') {
    if (currentSeason.season === 'wet') {
      plantingStatus = currentSeason.month <= 1 ? 'ideal' : 'adequado';
      timeWindow = 'Outubro - Janeiro';
    } else if (currentSeason.season === 'transition' && currentSeason.month === 10) {
      plantingStatus = 'adequado';
      timeWindow = 'Próximas semanas';
    } else {
      plantingStatus = 'fora_da_epoca';
      timeWindow = 'Aguardar próxima estação chuvosa';
      consequences.push('Plantio fora da época pode reduzir produtividade');
    }
  } else if (crop.season === 'seca') {
    if (currentSeason.season === 'dry') {
      plantingStatus = 'ideal';
      timeWindow = 'Maio - Agosto';
    } else {
      plantingStatus = 'fora_da_epoca';
      timeWindow = 'Aguardar estação seca';
      consequences.push('Risco de doenças fúngicas na estação chuvosa');
    }
  } else { // todo_ano
    plantingStatus = 'adequado';
    timeWindow = 'Qualquer época com irrigação';
  }
  
  // Estimativa da próxima fase crítica
  const nextCritical = {
    stage: 'Floração',
    daysUntil: Math.floor(crop.growthPeriod * 0.6), // Estimativa: floração aos 60% do ciclo
    preparation: ['Ajustar irrigação', 'Monitorar pragas', 'Aplicar fertilizante']
  };
  
  // Previsão de colheita
  const harvestMonth = (currentSeason.month + Math.floor(crop.growthPeriod / 30)) % 12;
  const marketTiming = harvestMonth >= 3 && harvestMonth <= 6 ? 'ótimo' : 'bom'; // Estimativa
  
  return {
    currentStage: null, // Seria calculado baseado na data de plantio
    nextCriticalPeriod: nextCritical,
    plantingRecommendation: {
      status: plantingStatus,
      timeWindow,
      consequences
    },
    harvestPrediction: {
      estimatedDate: `${harvestMonth}/2025`,
      marketTiming,
      storageRequirements: ['Secagem adequada', 'Armazenamento seco']
    }
  };
}

export function generatePhaseSpecificRecommendations(crop: CropData, weather: WeatherData): {
  prePlanting: string[];
  planting: string[];
  vegetative: string[];
  reproductive: string[];
  harvest: string[];
} {
  return {
    prePlanting: [
      'Preparar o solo com análise de pH e nutrientes',
      'Verificar disponibilidade de sementes certificadas',
      'Planejar sistema de irrigação se necessário'
    ],
    planting: [
      'Plantar após as primeiras chuvas consistentes',
      'Usar espaçamento recomendado para a cultivar',
      'Aplicar fertilizante de base conforme análise de solo'
    ],
    vegetative: [
      'Monitorar pragas e doenças semanalmente',
      'Realizar adubação de cobertura conforme necessidade',
      'Manter controle de ervas daninhas'
    ],
    reproductive: [
      'Aumentar frequência de irrigação durante floração',
      'Aplicar micronutrientes se necessário',
      'Proteger contra pragas específicas da fase reprodutiva'
    ],
    harvest: [
      'Determinar ponto ideal de colheita',
      'Planejar secagem e armazenamento',
      'Preparar para comercialização imediata ou estocagem'
    ]
  };
}

// Função principal atualizada
export function generateAdvancedCropRecommendations(
  selectedCrops: string[],
  weather: WeatherData,
  currentDate: Date = new Date()
): AdvancedCropRecommendation[] {
  
  const currentSeason = getCurrentSeason(currentDate.getMonth() + 1);
  const recommendations: AdvancedCropRecommendation[] = [];
  
  for (const cropId of selectedCrops) {
    const crop = CROPS_DATABASE.find(c => c.id === cropId);
    if (!crop) continue;
    
    // Análises básicas (reutilizando funções existentes)
    const climateScore = 85; // Simplificado - usaria função existente
    const soilScore = 75;
    const waterScore = 80;
    const economicScore = 70;
    const riskScore = 65;
    const sustainabilityScore = 90;
    const culturalScore = 85;
    
    // NOVAS análises temporais
    const timingScore = analyzeCurrentTiming(crop, currentSeason);
    const phenologyScore = analyzePhenologyCompatibility(crop, weather, currentSeason);
    
    // Pesos atualizados incluindo timing e fenologia
    const weights = {
      climate: 0.15,
      soil: 0.12,
      water: 0.12,
      economic: 0.15,
      risk: 0.12,
      sustainability: 0.08,
      cultural: 0.04,
      timing: 0.12, // NOVO: Peso do timing sazonal
      phenology: 0.10  // NOVO: Peso da adequação fenológica
    };
    
    const overallScore = Math.round(
      climateScore * weights.climate +
      soilScore * weights.soil +
      waterScore * weights.water +
      economicScore * weights.economic +
      riskScore * weights.risk +
      sustainabilityScore * weights.sustainability +
      culturalScore * weights.cultural +
      timingScore * weights.timing +
      phenologyScore * weights.phenology
    );
    
    // Determinar viabilidade
    let viabilityLevel: 'alta' | 'média' | 'baixa' | 'não_recomendada';
    if (overallScore >= 80) viabilityLevel = 'alta';
    else if (overallScore >= 60) viabilityLevel = 'média';
    else if (overallScore >= 40) viabilityLevel = 'baixa';
    else viabilityLevel = 'não_recomendada';
    
    // Análises avançadas
    const timingAnalysis = generateTimingAnalysis(crop, currentSeason);
    const stressAnalysis = analyzeStressFactors(crop, weather);
    const degreeDay = calculateDegreeDay(crop, weather);
    const waterBalance = calculateWaterBalance(crop, weather);
    const phaseRecommendations = generatePhaseSpecificRecommendations(crop, weather);
    
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
        cultural: culturalScore,
        timing: timingScore,
        phenology: phenologyScore
      },
      timingAnalysis,
      phenologyInsights: {
        currentSuitability: timingScore >= 80 ? 'Época ideal para plantio' : 
                           timingScore >= 60 ? 'Época adequada com cuidados' : 'Fora da época recomendada',
        criticalUpcoming: [`Floração em ${Math.floor(crop.growthPeriod * 0.6)} dias`, 'Período de maior demanda hídrica'],
        seasonalChallenges: currentSeason.season === 'wet' ? ['Excesso de umidade', 'Risco de doenças fúngicas'] : 
                           ['Deficit hídrico', 'Stress térmico'],
        optimizationTips: ['Monitoramento constante do clima', 'Ajuste de irrigação conforme fenologia']
      },
      stressAnalysis,
      bioclimaticIndices: {
        degreeDay,
        waterBalance,
        stressIndex: Math.max(
          stressAnalysis.thermalStress.risk === 'alto' ? 0.8 : stressAnalysis.thermalStress.risk === 'médio' ? 0.4 : 0.1,
          stressAnalysis.waterStress.risk === 'alto' ? 0.8 : stressAnalysis.waterStress.risk === 'médio' ? 0.4 : 0.1
        )
      },
      phaseSpecificRecommendations: phaseRecommendations,
      analysis: {
        strengths: ['Cultura adaptada à região', 'Conhecimento técnico disponível'],
        challenges: ['Manejo de pragas específicas', 'Controle de irrigação'],
        requirements: ['Solo bem drenado', 'Sementes certificadas'],
        recommendations: ['Plantio em época adequada', 'Monitoramento constante']
      },
      timeline: {
        plantingWindow: timingAnalysis.plantingRecommendation.timeWindow,
        criticalPeriods: ['Germinação (7-14 dias)', 'Floração', 'Enchimento de grãos'],
        harvestPeriod: timingAnalysis.harvestPrediction.estimatedDate
      },
      economics: (() => {
        try {
          const region = weather.region || 'Sofala';
          const calculation = calculateInvestment(crop.id, region, 1);
          return {
            estimatedInvestment: formatCurrency(calculation.totalInvestment),
            expectedReturn: formatCurrency(calculation.expectedRevenue),
            expectedProfit: formatCurrency(calculation.expectedProfit),
            profitMargin: `${calculation.profitMargin.toFixed(1)}%`,
            paybackPeriod: `${Math.round(calculation.paybackPeriod * 10) / 10} safras`,
            profitabilityRisk: calculation.confidenceLevel > 0.7 ? 'baixo' : calculation.confidenceLevel > 0.5 ? 'médio' : 'alto',
            riskAdjustedReturn: formatCurrency(calculation.riskAdjustedReturn),
            confidenceLevel: `${(calculation.confidenceLevel * 100).toFixed(0)}%`
          };
        } catch (error) {
          return {
            estimatedInvestment: '190.000 - 510.000 MZN/ha',
            expectedReturn: '510.000 - 960.000 MZN/ha',
            paybackPeriod: '1 safra',
            profitabilityRisk: 'médio'
          };
        }
      })(),
      sustainability: {
        environmentalImpact: 'Baixo com práticas adequadas',
        soilHealth: 'Melhora com rotação adequada',
        rotationBenefits: ['Fixação de nitrogênio', 'Quebra de ciclo de pragas']
      }
    });
  }
  
  return recommendations.sort((a, b) => b.overallScore - a.overallScore);
}

// Função atualizada para insights baseados em timing
export function generateSeasonalWeatherInsights(weather: WeatherData, selectedCrops?: string[], currentDate: Date = new Date()): string[] {
  const insights: string[] = [];
  const currentSeason = getCurrentSeason(currentDate.getMonth() + 1);
  
  // Insights sazonais gerais
  if (currentSeason.season === 'wet') {
    insights.push("🌧️ Estação chuvosa: Período ideal para culturas dependentes de chuva");
    if (weather.humidity && weather.humidity > 85) {
      insights.push("⚠️ Alta umidade: Reforce medidas preventivas contra doenças fúngicas");
    }
  } else if (currentSeason.season === 'dry') {
    insights.push("☀️ Estação seca: Período crítico para irrigação e culturas de inverno");
    insights.push("💧 Planeje irrigação eficiente para culturas em desenvolvimento");
  }
  
  if (!selectedCrops || selectedCrops.length === 0) {
    return insights;
  }
  
  // Insights específicos por cultura considerando timing
  const recommendations = generateAdvancedCropRecommendations(selectedCrops, weather, currentDate);
  
  recommendations.forEach(rec => {
    // Insight de timing
    const status = rec.timingAnalysis.plantingRecommendation.status;
    if (status === 'ideal') {
      insights.push(`✅ ${rec.cropName}: Época IDEAL para plantio - aproveite agora!`);
    } else if (status === 'adequado') {
      insights.push(`⏰ ${rec.cropName}: Ainda adequado para plantio com cuidados extras`);
    } else if (status === 'tardio') {
      insights.push(`🕐 ${rec.cropName}: Plantio tardio - redução de produtividade esperada`);
    } else {
      insights.push(`🔴 ${rec.cropName}: Fora da época - aguarde período adequado`);
    }
    
    // Insights de stress
    if (rec.stressAnalysis.thermalStress.risk === 'alto') {
      insights.push(`🌡️ ${rec.cropName}: ALERTA térmico - implemente medidas de proteção`);
    }
    
    if (rec.stressAnalysis.waterStress.risk === 'alto') {
      insights.push(`💧 ${rec.cropName}: DEFICIT hídrico crítico - irrigação urgente`);
    }
    
    // Insights fenológicos
    if (rec.scores.phenology < 60) {
      insights.push(`🌱 ${rec.cropName}: Condições inadequadas para desenvolvimento ótimo`);
    }
  });
  
  return insights;
}

export default {
  generateAdvancedCropRecommendations,
  generateSeasonalWeatherInsights,
  getCurrentSeason,
  analyzeCurrentTiming,
  analyzePhenologyCompatibility,
  calculateDegreeDay,
  calculateWaterBalance,
  analyzeStressFactors
};
