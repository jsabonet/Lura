/**
 * Sistema de Insights Agrícolas Profissionais
 * ==========================================
 * 
 * Gera recomendações específicas baseadas em:
 * - Condições climáticas atuais e previsão
 * - Região geográfica específica (Moçambique)
 * - Culturas selecionadas pelo agricultor
 * - Análise de adequação regional
 * - Fases de cultivo e calendário agrícola
 */

import { CROPS_DATABASE, type CropData } from '@/components/CropSelector';

interface WeatherConditions {
  temperature: number;
  humidity: number;
  wind: { speed: number; direction: string };
  pressure: number;
  uvIndex?: number;
  description: string;
}

interface LocationData {
  name: string;
  lat: number;
  lng: number;
}

interface ForecastData {
  temperature: { min: number; max: number };
  description: string;
  precipitation?: number;
  humidity: number;
}

interface AgricultureInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'ideal' | 'info' | 'critical';
  category: 'planting' | 'irrigation' | 'protection' | 'harvest' | 'pest' | 'general' | 'compatibility';
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  crops?: string[];
  actionable: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timeline?: string;
}

// Análise de adequação regional para culturas
function analyzeCropCompatibility(
  cropIds: string[], 
  regionName: string, 
  weather: WeatherConditions
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  
  // Determinar província
  const province = Object.keys(REGIONAL_CROPS).find(p => 
    regionName.toLowerCase().includes(p.toLowerCase())
  ) || extractProvinceFromName(regionName) || 'Maputo';

  cropIds.forEach(cropId => {
    const crop = CROPS_DATABASE.find(c => c.id === cropId);
    if (!crop) return;

    // Análise de compatibilidade regional
    const compatibility = getCropRegionCompatibility(crop, province);
    
    if (compatibility === 'incompatible') {
      insights.push({
        id: `incompatible-${cropId}`,
        type: 'critical',
        category: 'compatibility',
        icon: '🚫',
        title: `${crop.name} - Região Não Adequada`,
        description: `${crop.name} não é recomendado para ${province}. Esta cultura requer condições específicas não disponíveis nesta região. Considere alternativas adequadas.`,
        priority: 'high',
        crops: [crop.name],
        actionable: true,
        severity: 'critical',
        timeline: 'Imediato'
      });
      
      // Sugerir alternativas
      const alternatives = findAlternativeCrops(crop, province);
      if (alternatives.length > 0) {
        insights.push({
          id: `alternative-${cropId}`,
          type: 'recommendation',
          category: 'planting',
          icon: '💡',
          title: `Alternativas para ${crop.name}`,
          description: `Para ${province}, recomendamos: ${alternatives.slice(0, 3).join(', ')}. Estas culturas têm melhor adaptação regional.`,
          priority: 'medium',
          crops: alternatives.slice(0, 3),
          actionable: true,
          timeline: 'Próximo plantio'
        });
      }
    } else if (compatibility === 'compatible') {
      insights.push({
        id: `compatible-${cropId}`,
        type: 'warning',
        category: 'compatibility',
        icon: '⚠️',
        title: `${crop.name} - Compatível com Cuidados`,
        description: `${crop.name} pode ser cultivado em ${province}, mas requer manejo especial. Monitore temperatura e irrigação cuidadosamente.`,
        priority: 'medium',
        crops: [crop.name],
        actionable: true,
        severity: 'medium'
      });
    } else if (compatibility === 'ideal') {
      insights.push({
        id: `ideal-${cropId}`,
        type: 'ideal',
        category: 'compatibility',
        icon: '🎯',
        title: `${crop.name} - Região Ideal`,
        description: `${crop.name} é perfeitamente adequado para ${province}. Condições regionais favorecem excelente produtividade.`,
        priority: 'low',
        crops: [crop.name],
        actionable: false,
        severity: 'low'
      });
    }

    // Análise climática específica para a cultura
    const climateInsights = analyzeCropClimate(crop, weather, province);
    insights.push(...climateInsights);
  });

  return insights;
}

// Analisar condições climáticas específicas para cada cultura
function analyzeCropClimate(
  crop: CropData, 
  weather: WeatherConditions, 
  province: string
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  const temp = weather.temperature;
  const humidity = weather.humidity;

  // Análise de temperatura
  if (temp < crop.temperatureRange.min) {
    const deficit = crop.temperatureRange.min - temp;
    insights.push({
      id: `temp-low-${crop.id}`,
      type: 'warning',
      category: 'protection',
      icon: '🥶',
      title: `${crop.name} - Temperatura Baixa`,
      description: `${temp}°C está ${deficit.toFixed(1)}°C abaixo do ideal para ${crop.name} (${crop.temperatureRange.min}-${crop.temperatureRange.max}°C). Use estufas ou aguarde aquecimento.`,
      priority: 'high',
      crops: [crop.name],
      actionable: true,
      severity: 'high',
      timeline: 'Próximos dias'
    });
  } else if (temp > crop.temperatureRange.max) {
    const excess = temp - crop.temperatureRange.max;
    insights.push({
      id: `temp-high-${crop.id}`,
      type: 'warning',
      category: 'protection',
      icon: '🔥',
      title: `${crop.name} - Temperatura Elevada`,
      description: `${temp}°C está ${excess.toFixed(1)}°C acima do ideal para ${crop.name}. Aumente irrigação, use sombreamento e evite transplantes.`,
      priority: 'high',
      crops: [crop.name],
      actionable: true,
      severity: 'high',
      timeline: 'Imediato'
    });
  } else {
    insights.push({
      id: `temp-ideal-${crop.id}`,
      type: 'ideal',
      category: 'general',
      icon: '🌡️',
      title: `${crop.name} - Temperatura Perfeita`,
      description: `${temp}°C é ideal para ${crop.name}. Condições perfeitas para crescimento vigoroso e desenvolvimento saudável.`,
      priority: 'low',
      crops: [crop.name],
      actionable: false
    });
  }

  // Análise de necessidade hídrica
  const waterNeeds = {
    'baixo': { min: 30, max: 50 },
    'médio': { min: 50, max: 75 },
    'alto': { min: 70, max: 85 }
  };

  const needs = waterNeeds[crop.waterRequirement];
  
  if (humidity < needs.min) {
    insights.push({
      id: `water-deficit-${crop.id}`,
      type: 'warning',
      category: 'irrigation',
      icon: '💧',
      title: `${crop.name} - Déficit Hídrico`,
      description: `Umidade ${humidity}% é insuficiente para ${crop.name} (necessário: ${needs.min}-${needs.max}%). Aumente frequência de irrigação.`,
      priority: 'high',
      crops: [crop.name],
      actionable: true,
      severity: 'high',
      timeline: 'Imediato'
    });
  } else if (humidity > needs.max) {
    insights.push({
      id: `water-excess-${crop.id}`,
      type: 'warning',
      category: 'pest',
      icon: '🍄',
      title: `${crop.name} - Excesso de Umidade`,
      description: `Umidade ${humidity}% pode causar doenças fúngicas em ${crop.name}. Melhore drenagem e ventilação.`,
      priority: 'medium',
      crops: [crop.name],
      actionable: true,
      severity: 'medium'
    });
  }

  // Recomendações específicas por cultura
  const specificInsights = getCropSpecificInsights(crop, weather, province);
  insights.push(...specificInsights);

  return insights;
}

// Recomendações específicas por tipo de cultura
function getCropSpecificInsights(
  crop: CropData, 
  weather: WeatherConditions, 
  province: string
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  const season = getCurrentSeason();

  switch (crop.id) {
    case 'milho':
      if (season === 'wet' && weather.humidity > 70) {
        insights.push({
          id: 'milho-planting-season',
          type: 'recommendation',
          category: 'planting',
          icon: '🌽',
          title: 'Milho - Época Ideal de Plantio',
          description: 'Estação chuvosa é perfeita para plantio de milho. Prepare canteiros com boa drenagem para evitar encharcamento.',
          priority: 'medium',
          crops: ['Milho'],
          actionable: true,
          timeline: 'Próximas 2 semanas'
        });
      }
      
      if (weather.wind.speed > 20) {
        insights.push({
          id: 'milho-wind-protection',
          type: 'warning',
          category: 'protection',
          icon: '💨',
          title: 'Milho - Proteger do Vento',
          description: `Vento forte (${Math.round(weather.wind.speed * 3.6)} km/h) pode quebrar hastes de milho. Use quebra-ventos ou tutoramento.`,
          priority: 'high',
          crops: ['Milho'],
          actionable: true,
          timeline: 'Imediato'
        });
      }
      break;

    case 'arroz':
      if (crop.incompatibleRegions.includes(province)) {
        insights.push({
          id: 'rice-region-warning',
          type: 'critical',
          category: 'compatibility',
          icon: '🌾',
          title: 'Arroz - Região Inadequada',
          description: `${province} é muito seca para arroz irrigado. Esta cultura requer abundant água. Considere milho ou sorgo como alternativas.`,
          priority: 'high',
          crops: ['Arroz'],
          actionable: true,
          severity: 'critical'
        });
      }
      break;

    case 'tomate':
      if (weather.temperature > 28) {
        insights.push({
          id: 'tomato-heat-stress',
          type: 'warning',
          category: 'protection',
          icon: '🍅',
          title: 'Tomate - Estresse Térmico',
          description: `${weather.temperature}°C é muito quente para tomate. Use sombreamento 30-50% e irrigação frequente nas horas mais frescas.`,
          priority: 'high',
          crops: ['Tomate'],
          actionable: true,
          severity: 'high'
        });
      }
      
      if (weather.humidity > 80) {
        insights.push({
          id: 'tomato-disease-risk',
          type: 'warning',
          category: 'pest',
          icon: '🦠',
          title: 'Tomate - Risco de Doenças',
          description: 'Alta umidade favorece míldio e outras doenças. Evite irrigação foliar e melhore ventilação entre plantas.',
          priority: 'medium',
          crops: ['Tomate'],
          actionable: true
        });
      }
      break;

    case 'coco':
      if (province === 'Tete' || province === 'Niassa') {
        insights.push({
          id: 'coconut-inland-warning',
          type: 'critical',
          category: 'compatibility',
          icon: '🥥',
          title: 'Coco - Região Interior Inadequada',
          description: 'Coco requer proximidade ao mar e alta umidade. Regiões interiores como Tete são inadequadas. Considere culturas adaptadas ao clima continental.',
          priority: 'high',
          crops: ['Coco'],
          actionable: true,
          severity: 'critical'
        });
      }
      break;
  }

  return insights;
}

// Encontrar culturas alternativas adequadas à região
function findAlternativeCrops(originalCrop: CropData, province: string): string[] {
  return CROPS_DATABASE
    .filter(crop => 
      crop.id !== originalCrop.id &&
      crop.category === originalCrop.category &&
      (crop.idealRegions.includes(province) || crop.compatibleRegions.includes(province))
    )
    .map(crop => crop.name);
}

// Determinar compatibilidade cultura-região
function getCropRegionCompatibility(crop: CropData, province: string): 'ideal' | 'compatible' | 'incompatible' {
  if (crop.idealRegions.includes(province)) return 'ideal';
  if (crop.compatibleRegions.includes(province)) return 'compatible';
  if (crop.incompatibleRegions.includes(province)) return 'incompatible';
  return 'compatible'; // Default para regiões não mapeadas
}

// Extrair província do nome da localização
function extractProvinceFromName(locationName: string): string | null {
  const provinces = Object.keys(REGIONAL_CROPS);
  return provinces.find(p => 
    locationName.toLowerCase().includes(p.toLowerCase())
  ) || null;
}

// Culturas principais por região em Moçambique (mantido do código original)
const REGIONAL_CROPS = {
  'Maputo': ['milho', 'feijão', 'mandioca', 'tomate', 'couve'],
  'Gaza': ['milho', 'feijão', 'mandioca', 'amendoim', 'batata-doce'],
  'Inhambane': ['milho', 'feijão', 'mandioca', 'coco', 'caju'],
  'Sofala': ['milho', 'arroz', 'algodão', 'cana-de-açúcar', 'feijão'],
  'Manica': ['milho', 'feijão', 'batata', 'tomate', 'hortaliças'],
  'Tete': ['milho', 'algodão', 'tabaco', 'feijão', 'amendoim'],
  'Zambézia': ['milho', 'arroz', 'mandioca', 'feijão', 'coco'],
  'Nampula': ['milho', 'mandioca', 'feijão', 'amendoim', 'gergelim'],
  'Cabo Delgado': ['milho', 'mandioca', 'feijão', 'amendoim', 'coco'],
  'Niassa': ['milho', 'feijão', 'mandioca', 'amendoim', 'tabaco'],
  'Cidade de Maputo': ['hortaliças', 'tomate', 'couve', 'alface', 'pimento']
};

// Estações do ano em Moçambique (Hemisfério Sul)
function getCurrentSeason(): 'dry' | 'wet' | 'transition' {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 5 && month <= 9) return 'dry'; // Maio-Setembro (seca)
  if (month >= 11 || month <= 3) return 'wet'; // Nov-Março (chuvosa)
  return 'transition'; // Abril, Outubro (transição)
}

// Gerar insights baseados nas condições climáticas e culturas selecionadas
function generateWeatherInsights(
  weather: WeatherConditions,
  location: LocationData,
  forecast?: ForecastData[],
  selectedCrops?: string[]
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  const season = getCurrentSeason();
  
  // Determinar província baseada no nome da localização
  const province = Object.keys(REGIONAL_CROPS).find(p => 
    location.name.toLowerCase().includes(p.toLowerCase())
  ) || extractProvinceFromName(location.name) || 'Maputo';
  
  // Se há culturas selecionadas, usar análise personalizada
  if (selectedCrops && selectedCrops.length > 0) {
    const cropCompatibilityInsights = analyzeCropCompatibility(selectedCrops, province, weather);
    insights.push(...cropCompatibilityInsights);
    
    // Análise de previsão para culturas específicas
    if (forecast && forecast.length > 0) {
      const forecastInsights = analyzeForecastForCrops(selectedCrops, forecast, weather);
      insights.push(...forecastInsights);
    }
  } else {
    // Fallback: usar culturas regionais padrão
    const regionalCrops = REGIONAL_CROPS[province as keyof typeof REGIONAL_CROPS] || REGIONAL_CROPS['Maputo'];
    const defaultCropIds = regionalCrops.map(cropName => 
      CROPS_DATABASE.find(c => c.name.toLowerCase() === cropName.toLowerCase())?.id
    ).filter(Boolean) as string[];
    
    if (defaultCropIds.length > 0) {
      const cropInsights = analyzeCropCompatibility(defaultCropIds.slice(0, 3), province, weather);
      insights.push(...cropInsights);
    }
  }

  // Insights gerais sempre aplicáveis
  const generalInsights = getGeneralWeatherInsights(weather, season, province);
  insights.push(...generalInsights);

  // Ordenar por prioridade e severity
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    const aSeverity = severityOrder[a.severity || 'low'];
    const bSeverity = severityOrder[b.severity || 'low'];
    
    // Primeiro por severity, depois por priority
    if (bSeverity !== aSeverity) return bSeverity - aSeverity;
    return bPriority - aPriority;
  });
}

// Análise de previsão para culturas específicas
function analyzeForecastForCrops(
  cropIds: string[], 
  forecast: ForecastData[], 
  currentWeather: WeatherConditions
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  const nextDays = forecast.slice(0, 7);
  
  // Análise de chuva prevista
  const hasRain = nextDays.some(day => 
    day.description.toLowerCase().includes('chuva') || 
    (day.precipitation && day.precipitation > 30)
  );
  
  const avgTemp = nextDays.reduce((sum, day) => 
    sum + (day.temperature.max + day.temperature.min) / 2, 0
  ) / nextDays.length;
  
  cropIds.forEach(cropId => {
    const crop = CROPS_DATABASE.find(c => c.id === cropId);
    if (!crop) return;
    
    // Análise de chuva para a cultura
    if (hasRain) {
      if (crop.waterRequirement === 'alto') {
        insights.push({
          id: `rain-benefit-${cropId}`,
          type: 'ideal',
          category: 'irrigation',
          icon: '🌧️',
          title: `${crop.name} - Chuva Benéfica`,
          description: `Chuva prevista é excelente para ${crop.name} que requer muita água. Reduza irrigação artificial.`,
          priority: 'medium',
          crops: [crop.name],
          actionable: true,
          timeline: 'Próximos dias'
        });
      } else if (crop.waterRequirement === 'baixo') {
        insights.push({
          id: `rain-excess-${cropId}`,
          type: 'warning',
          category: 'protection',
          icon: '☔',
          title: `${crop.name} - Excesso de Chuva`,
          description: `Chuva prevista pode ser excessiva para ${crop.name}. Melhore drenagem e proteja de encharcamento.`,
          priority: 'medium',
          crops: [crop.name],
          actionable: true,
          timeline: 'Antes da chuva'
        });
      }
    }
    
    // Análise de temperatura futura
    if (avgTemp > crop.temperatureRange.max) {
      insights.push({
        id: `heat-forecast-${cropId}`,
        type: 'warning',
        category: 'protection',
        icon: '🌡️',
        title: `${crop.name} - Calor Intenso Previsto`,
        description: `Temperatura média de ${avgTemp.toFixed(1)}°C nos próximos dias. Prepare sombreamento e irrigação extra para ${crop.name}.`,
        priority: 'high',
        crops: [crop.name],
        actionable: true,
        severity: 'high',
        timeline: 'Próximos dias'
      });
    } else if (avgTemp < crop.temperatureRange.min) {
      insights.push({
        id: `cold-forecast-${cropId}`,
        type: 'warning',
        category: 'protection',
        icon: '❄️',
        title: `${crop.name} - Frio Previsto`,
        description: `Temperatura baixa prevista (${avgTemp.toFixed(1)}°C) pode prejudicar ${crop.name}. Considere proteção térmica.`,
        priority: 'high',
        crops: [crop.name],
        actionable: true,
        severity: 'medium',
        timeline: 'Próximos dias'
      });
    }
  });
  
  return insights;
}

// Insights gerais sobre condições climáticas
function getGeneralWeatherInsights(
  weather: WeatherConditions, 
  season: 'dry' | 'wet' | 'transition', 
  province: string
): AgricultureInsight[] {
  const insights: AgricultureInsight[] = [];
  
  // Insights sazonais
  if (season === 'wet') {
    insights.push({
      id: 'wet-season-general',
      type: 'info',
      category: 'general',
      icon: '🌧️',
      title: 'Estação Chuvosa - Oportunidades',
      description: `Época ideal para plantio principal em ${province}. Aproveite a umidade natural para estabelecer culturas.`,
      priority: 'medium',
      actionable: true,
      timeline: 'Esta estação'
    });
  } else if (season === 'dry') {
    insights.push({
      id: 'dry-season-general',
      type: 'recommendation',
      category: 'irrigation',
      icon: '☀️',
      title: 'Estação Seca - Manejo Hídrico',
      description: `Foque em conservação de água e culturas resistentes à seca. Otimize sistemas de irrigação.`,
      priority: 'high',
      actionable: true,
      timeline: 'Esta estação'
    });
  }
  
  // Insights sobre vento
  if (weather.wind.speed > 25) {
    insights.push({
      id: 'strong-wind-general',
      type: 'warning',
      category: 'protection',
      icon: '💨',
      title: 'Vento Forte - Cuidados Gerais',
      description: `Vento de ${Math.round(weather.wind.speed * 3.6)} km/h requer proteção. Evite pulverizações e apoie plantas jovens.`,
      priority: 'high',
      actionable: true,
      severity: 'medium',
      timeline: 'Imediato'
    });
  }
  
  // Insights sobre UV
  if (weather.uvIndex && weather.uvIndex > 9) {
    insights.push({
      id: 'extreme-uv-general',
      type: 'warning',
      category: 'protection',
      icon: '☀️',
      title: 'UV Extremo - Proteção Necessária',
      description: `Índice UV ${weather.uvIndex} requer cuidados especiais. Use sombreamento para plantas sensíveis e evite trabalhos ao meio-dia.`,
      priority: 'medium',
      actionable: true,
      timeline: 'Durante o dia'
    });
  }
  
  return insights;
}

// Obter cor do tema baseado no tipo
function getInsightTheme(type: AgricultureInsight['type']) {
  switch (type) {
    case 'critical':
      return {
        bg: 'from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30',
        border: 'border-red-300 dark:border-red-700',
        text: 'text-red-900 dark:text-red-200',
        subtext: 'text-red-800 dark:text-red-300',
        iconBg: 'bg-red-200 dark:bg-red-800/70'
      };
    case 'warning':
      return {
        bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-300',
        subtext: 'text-red-700 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-800/50'
      };
    case 'recommendation':
      return {
        bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-300',
        subtext: 'text-blue-700 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-800/50'
      };
    case 'ideal':
      return {
        bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-300',
        subtext: 'text-green-700 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-800/50'
      };
    case 'info':
      return {
        bg: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
        border: 'border-gray-200 dark:border-gray-800',
        text: 'text-gray-800 dark:text-gray-300',
        subtext: 'text-gray-700 dark:text-gray-400',
        iconBg: 'bg-gray-100 dark:bg-gray-800/50'
      };
  }
}

export {
  generateWeatherInsights,
  getInsightTheme,
  analyzeCropCompatibility,
  type AgricultureInsight,
  type WeatherConditions,
  type LocationData,
  type ForecastData
};
