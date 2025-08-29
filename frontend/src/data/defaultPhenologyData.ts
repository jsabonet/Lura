// Script para adicionar campos faltantes a todas as culturas
// Este script será usado para completar automaticamente os dados

const defaultPhenologyData = {
  phenology: {
    stages: {
      germination: 7,
      vegetative: 30,
      flowering: 20,
      fruiting: 30,
      maturation: 10
    },
    criticalPeriods: {
      waterStress: ['floração', 'frutificação'],
      heatStress: ['floração'],
      coldStress: ['germinação']
    },
    photoperiod: {
      sensitivity: 'média' as const
    }
  },
  
  timing: {
    plantingWindows: {
      primary: { start: 'novembro', end: 'dezembro', description: 'Época principal' },
      secondary: { start: 'janeiro', end: 'fevereiro', description: 'Época secundária' }
    },
    criticalMonths: ['dezembro', 'janeiro'],
    harvestMonths: ['março', 'abril'],
    offSeasonViability: 'limitada' as const
  },
  
  microclimate: {
    temperatureStress: {
      heatThreshold: 32,
      coldThreshold: 12,
      degreeDay: { base: 10, max: 30 }
    },
    humidityStress: {
      lowThreshold: 45,
      highThreshold: 80
    }
  },
  
  waterDynamics: {
    evapotranspiration: {
      kc_initial: 0.4,
      kc_development: 0.7,
      kc_mid: 1.0,
      kc_late: 0.6
    },
    waterStressSensitivity: {
      germination: 'média' as const,
      flowering: 'alta' as const,
      fruiting: 'alta' as const
    }
  },
  
  management: {
    plantingDensity: { min: 30000, max: 50000, unit: 'plantas/ha' as const },
    spacing: { row: 50, plant: 30, unit: 'cm' as const },
    cultivationSystem: ['monocultivo' as const],
    mechanizationLevel: 'manual' as const
  }
};

export default defaultPhenologyData;
