'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE as CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData as CropData } from '@/data/simpleCropsDatabase';

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
  
  // Novos campos para análise profissional
  climate: {
    precipitationRange: { min: number; max: number }; // mm/ano
    humidityRange: { min: number; max: number }; // %
    frostTolerance: 'alta' | 'média' | 'baixa' | 'nenhuma';
    droughtTolerance: 'alta' | 'média' | 'baixa';
    windTolerance: 'alta' | 'média' | 'baixa';
  };
  
  soil: {
    preferredTexture: ('arenoso' | 'franco' | 'argiloso')[];
    phRange: { min: number; max: number };
    organicMatterRequirement: 'baixo' | 'médio' | 'alto';
    drainageRequirement: 'boa' | 'moderada' | 'tolerante_encharcamento';
    depthRequirement: 'raso' | 'médio' | 'profundo'; // cm
    fertilityRequirement: 'baixa' | 'média' | 'alta';
  };
  
  water: {
    irrigationDependency: 'essencial' | 'recomendada' | 'opcional' | 'desnecessária';
    waterEfficiency: 'alta' | 'média' | 'baixa'; // produção por mm de água
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

const CROPS_DATABASE: CropData[] = [
  // Cereais
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
    incompatibleRegions: ['Gaza', 'Inhambane'], // Regiões muito secas
    
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
    }
  },
  
  // Leguminosas
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
    incompatibleRegions: ['Inhambane'], // Muito seco
    
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
    idealRegions: ['Gaza', 'Inhambane', 'Tete', 'Nampula'],
    compatibleRegions: ['Maputo', 'Sofala', 'Cabo Delgado', 'Niassa'],
    incompatibleRegions: []
  },

  // Hortaliças
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'hortaliças',
    icon: '🍅',
    season: 'todo_ano',
    growthPeriod: 85,
    waterRequirement: 'alto',
    temperatureRange: { min: 18, max: 26 },
    idealRegions: ['Manica', 'Maputo'],
    compatibleRegions: ['Sofala', 'Zambézia'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete'] // Muito quente
  },
  {
    id: 'couve',
    name: 'Couve',
    category: 'hortaliças',
    icon: '🥬',
    season: 'seca',
    growthPeriod: 60,
    waterRequirement: 'médio',
    temperatureRange: { min: 12, max: 24 },
    idealRegions: ['Manica', 'Maputo'],
    compatibleRegions: ['Sofala'],
    incompatibleRegions: ['Gaza', 'Inhambane', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado']
  },

  // Frutíferas
  {
    id: 'coco',
    name: 'Coco',
    category: 'frutíferas',
    icon: '🥥',
    season: 'todo_ano',
    growthPeriod: 2555, // 7 anos
    waterRequirement: 'alto',
    temperatureRange: { min: 22, max: 32 },
    idealRegions: ['Inhambane', 'Cabo Delgado', 'Zambézia'],
    compatibleRegions: ['Sofala', 'Nampula'],
    incompatibleRegions: ['Gaza', 'Manica', 'Tete', 'Niassa', 'Maputo']
  },
  {
    id: 'caju',
    name: 'Caju',
    category: 'frutíferas',
    icon: '🌰',
    season: 'todo_ano',
    growthPeriod: 1095, // 3 anos
    waterRequirement: 'médio',
    temperatureRange: { min: 20, max: 30 },
    idealRegions: ['Inhambane', 'Cabo Delgado', 'Nampula'],
    compatibleRegions: ['Gaza', 'Zambézia'],
    incompatibleRegions: ['Manica', 'Tete', 'Niassa']
  },

  // Tubérculos
  {
    id: 'mandioca',
    name: 'Mandioca',
    category: 'tubérculos',
    icon: '🍠',
    season: 'todo_ano',
    growthPeriod: 365,
    waterRequirement: 'baixo',
    temperatureRange: { min: 20, max: 35 },
    idealRegions: ['Gaza', 'Inhambane', 'Zambézia', 'Nampula', 'Cabo Delgado'],
    compatibleRegions: ['Maputo', 'Sofala', 'Tete', 'Niassa'],
    incompatibleRegions: []
  },
  {
    id: 'batata_doce',
    name: 'Batata-doce',
    category: 'tubérculos',
    icon: '🍠',
    season: 'chuvosa',
    growthPeriod: 120,
    waterRequirement: 'médio',
    temperatureRange: { min: 18, max: 28 },
    idealRegions: ['Gaza', 'Manica', 'Sofala'],
    compatibleRegions: ['Maputo', 'Zambézia', 'Tete'],
    incompatibleRegions: ['Inhambane', 'Nampula', 'Cabo Delgado']
  },

  // Industriais
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
    incompatibleRegions: ['Gaza', 'Inhambane', 'Nampula', 'Cabo Delgado']
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
    incompatibleRegions: ['Gaza', 'Inhambane', 'Maputo', 'Nampula', 'Cabo Delgado']
  }
];

const CATEGORY_LABELS = {
  cereais: 'Cereais',
  leguminosas: 'Leguminosas',
  hortaliças: 'Hortaliças',
  frutíferas: 'Frutíferas',
  industriais: 'Industriais',
  tubérculos: 'Tubérculos'
};

interface CropSelectorProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

export default function CropSelector({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion,
  className = '' 
}: CropSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCrops = CROPS_DATABASE.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedCrops = filteredCrops.reduce((acc, crop) => {
    if (!acc[crop.category]) acc[crop.category] = [];
    acc[crop.category].push(crop);
    return acc;
  }, {} as Record<string, CropData[]>);

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  const getRegionCompatibility = (crop: CropData) => {
    if (!currentRegion) return 'unknown';
    if (crop.idealRegions.includes(currentRegion)) return 'ideal';
    if (crop.compatibleRegions.includes(currentRegion)) return 'compatible';
    if (crop.incompatibleRegions.includes(currentRegion)) return 'incompatible';
    return 'unknown';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Seleção de Culturas
              </h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Escolha as culturas para receber recomendações personalizadas baseadas 
              nas condições climáticas da sua região
            </p>
          </div>
        </div>

        {/* Dropdown Button */}
        <div className="p-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="text-green-600 dark:text-green-400">
                  {selectedCrops.length === 0 ? '🌾' : '✅'}
                </span>
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedCrops.length === 0 
                    ? 'Selecione suas culturas' 
                    : `${selectedCrops.length} cultura${selectedCrops.length > 1 ? 's' : ''} selecionada${selectedCrops.length > 1 ? 's' : ''}`
                  }
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {selectedCrops.length === 0 
                    ? 'Clique para escolher suas culturas' 
                    : 'Clique para editar seleção'
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedCrops.length > 0 && (
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                  {selectedCrops.length}
                </span>
              )}
              <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Selected Crops Preview */}
          {selectedCrops.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 dark:text-green-400">🌾</span>
                <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Culturas Selecionadas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCrops.map(cropId => {
                  const crop = CROPS_DATABASE.find(c => c.id === cropId);
                  if (!crop) return null;
                  
                  const compatibility = getRegionCompatibility(crop);
                  
                  return (
                    <span 
                      key={cropId}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium shadow-sm border transition-all hover:scale-105 ${
                        compatibility === 'ideal' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700' :
                        compatibility === 'compatible' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' :
                        compatibility === 'incompatible' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span className="text-lg">{crop.icon}</span>
                      <span>{crop.name}</span>
                      {compatibility === 'ideal' && <span className="text-green-600">✨</span>}
                      {compatibility === 'incompatible' && <span className="text-red-600">⚠️</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
            {/* Search and Filter */}
            <div className="p-6 space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar culturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🏷️</span>
                  Filtrar por categoria
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-sm ${
                      selectedCategory === 'all' 
                        ? 'bg-green-600 text-white shadow-green-200 dark:shadow-green-900' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    Todas
                  </button>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 shadow-sm ${
                        selectedCategory === key 
                          ? 'bg-green-600 text-white shadow-green-200 dark:shadow-green-900' 
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Crops List */}
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedCrops).map(([category, crops]) => (
                <div key={category} className="p-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <span className="text-green-600 dark:text-green-400">
                        {category === 'cereais' && '🌾'}
                        {category === 'leguminosas' && '🫘'}
                        {category === 'hortaliças' && '🥬'}
                        {category === 'frutíferas' && '🍎'}
                        {category === 'industriais' && '🏭'}
                        {category === 'tubérculos' && '🥔'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h4>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                      {crops.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {crops.map(crop => {
                      const compatibility = getRegionCompatibility(crop);
                      const isSelected = selectedCrops.includes(crop.id);
                      
                      return (
                        <div
                          key={crop.id}
                          onClick={() => handleCropToggle(crop.id)}
                          className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-100 dark:shadow-green-900/20' 
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-green-100 group-hover:dark:bg-green-900/30 transition-colors">
                                <span className="text-xl">{crop.icon}</span>
                              </div>
                              <div>
                                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                                  {crop.name}
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {crop.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="p-1 bg-green-600 rounded-full">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              {currentRegion && (
                                <div className="flex items-center">
                                  {compatibility === 'ideal' && (
                                    <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                      <span className="text-green-600 text-xs">✨</span>
                                    </div>
                                  )}
                                  {compatibility === 'compatible' && (
                                    <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                      <span className="text-yellow-600 text-xs">~</span>
                                    </div>
                                  )}
                                  {compatibility === 'incompatible' && (
                                    <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                                      <span className="text-red-600 text-xs">⚠️</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <span>🌡️</span>
                              <span>{crop.temperatureRange.min}-{crop.temperatureRange.max}°C</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>💧</span>
                              <span className="capitalize">{crop.waterRequirement}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📅</span>
                              <span>{crop.growthPeriod < 365 ? `${crop.growthPeriod}d` : `${Math.round(crop.growthPeriod/365)}a`}</span>
                            </div>
                          </div>
                          
                          {currentRegion && compatibility === 'incompatible' && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center gap-2">
                                <span className="text-red-600">⚠️</span>
                                <span className="text-xs font-medium text-red-700 dark:text-red-400">
                                  Não recomendado para {currentRegion}
                                </span>
                              </div>
                            </div>
                          )}

                          {currentRegion && compatibility === 'ideal' && (
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600">✨</span>
                                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                  Ideal para {currentRegion}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { CROPS_DATABASE, type CropData };
