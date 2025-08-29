'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData } from '@/data/simpleCropsDatabase';

interface CropSelectorProfessionalProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorProfessional({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorProfessionalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Análise de compatibilidade e estatísticas
  const cropsAnalysis = useMemo(() => {
    let idealCount = 0;
    let compatibleCount = 0;
    let inadequateCount = 0;

    const analyzedCrops = SIMPLE_CROPS_DATABASE.map(crop => {
      const compatibility = getCompatibilityStatus(crop);
      
      if (compatibility === 'ideal') idealCount++;
      else if (compatibility === 'compatível') compatibleCount++;
      else inadequateCount++;

      return {
        ...crop,
        compatibility,
        seasonScore: getSeasonScore(crop),
        economicScore: getEconomicScore(crop)
      };
    });

    return {
      crops: analyzedCrops,
      stats: { idealCount, compatibleCount, inadequateCount }
    };
  }, [currentRegion]);

  // Filtrar culturas baseado na busca e categoria
  const filteredCrops = useMemo(() => {
    return cropsAnalysis.crops.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [cropsAnalysis.crops, searchTerm, selectedCategory]);

  // Agrupar por categoria
  const groupedCrops = useMemo(() => {
    return filteredCrops.reduce((acc, crop) => {
      if (!acc[crop.category]) {
        acc[crop.category] = [];
      }
      acc[crop.category].push(crop);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredCrops]);

  function getCompatibilityStatus(crop: SimpleCropData): 'ideal' | 'compatível' | 'inadequada' {
    if (!currentRegion) return 'ideal';
    
    if (crop.idealRegions.some(region => 
      region.toLowerCase().includes(currentRegion.toLowerCase())
    )) {
      return 'ideal';
    }
    
    if (crop.compatibleRegions.some(region => 
      region.toLowerCase().includes(currentRegion.toLowerCase())
    )) {
      return 'compatível';
    }
    
    return 'inadequada';
  }

  function getSeasonScore(crop: SimpleCropData): number {
    // Simulação de score sazonal (em produção seria baseado na data atual)
    const currentMonth = new Date().getMonth() + 1;
    if (crop.season === 'chuvosa' && (currentMonth >= 10 || currentMonth <= 3)) return 95;
    if (crop.season === 'seca' && currentMonth >= 4 && currentMonth <= 9) return 95;
    if (crop.season === 'todo_ano') return 85;
    return 60;
  }

  function getEconomicScore(crop: SimpleCropData): number {
    let score = 70;
    if (crop.economic.marketDemand === 'alta') score += 15;
    if (crop.economic.priceStability === 'estável') score += 10;
    if (crop.economic.profitabilityPotential === 'alta') score += 5;
    return Math.min(100, score);
  }

  const getCompatibilityIcon = (status: string) => {
    switch (status) {
      case 'ideal': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'compatível': return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'inadequada': return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default: return <InformationCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCompatibilityColor = (status: string) => {
    switch (status) {
      case 'ideal': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'compatível': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'inadequada': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 75) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  const quickFilters = [
    { key: 'all', label: 'Todas', count: filteredCrops.length },
    { key: 'ideal', label: 'Ideais', count: filteredCrops.filter(c => c.compatibility === 'ideal').length },
    { key: 'high-season', label: 'Época Ideal', count: filteredCrops.filter(c => c.seasonScore >= 90).length },
    { key: 'profitable', label: 'Lucrativas', count: filteredCrops.filter(c => c.economicScore >= 80).length }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header Profissional */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Seleção Inteligente de Culturas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recomendações baseadas em análise multidimensional
              </p>
            </div>
          </div>
          
          {currentRegion && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Região Ativa</p>
              <p className="font-medium text-gray-900 dark:text-white">{currentRegion}</p>
            </div>
          )}
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {cropsAnalysis.stats.idealCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Ideais</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {cropsAnalysis.stats.compatibleCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Compatíveis</div>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {selectedCrops.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Selecionadas</div>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map(filter => (
            <button
              key={filter.key}
              className="px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
        
        {/* Search Bar Avançada */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, categoria ou características..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500"
          />
        </div>

        {/* Category Filter Profissional */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-3 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between transition-colors"
          >
            <span className="text-gray-900 dark:text-white font-medium">
              {selectedCategory === 'all' ? 'Todas as categorias' : CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <button
                onClick={() => { setSelectedCategory('all'); setShowDropdown(false); }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
              >
                Todas as categorias
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedCategory(key); setShowDropdown(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Culturas Profissional */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {Object.entries(groupedCrops).map(([category, crops]) => (
          <div key={category} className="mb-8 last:mb-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="text-2xl">
                  {category === 'cereais' ? '🌾' : 
                   category === 'leguminosas' ? '🫘' :
                   category === 'hortaliças' ? '🥬' :
                   category === 'frutíferas' ? '🥥' :
                   category === 'tubérculos' ? '🍠' : '🌼'}
                </span>
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {crops.length} cultura{crops.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crops.map((crop: any) => {
                const isSelected = selectedCrops.includes(crop.id);
                
                return (
                  <div
                    key={crop.id}
                    onClick={() => handleCropToggle(crop.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                        : `border-gray-200 dark:border-gray-600 hover:border-green-300 ${getCompatibilityColor(crop.compatibility)}`
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{crop.icon}</span>
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {crop.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {crop.season} • {crop.growthPeriod} dias
                            </span>
                            {currentRegion && (
                              <div className="flex items-center gap-1">
                                {getCompatibilityIcon(crop.compatibility)}
                                <span className="text-xs font-medium capitalize">
                                  {crop.compatibility}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Scores e Indicadores */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Época</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(crop.seasonScore)}`}>
                          {crop.seasonScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Econômico</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(crop.economicScore)}`}>
                          {crop.economicScore}%
                        </span>
                      </div>
                    </div>

                    {/* Tags de Características */}
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        {crop.waterRequirement} água
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                        {crop.economic.marketDemand} demanda
                      </span>
                      {crop.economic.priceStability === 'estável' && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          preço estável
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Nenhuma cultura encontrada
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </div>

      {/* Footer com Resumo */}
      {selectedCrops.length > 0 && (
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-gray-200 dark:border-gray-600 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {selectedCrops.length} cultura{selectedCrops.length !== 1 ? 's' : ''} selecionada{selectedCrops.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => onCropSelect([])}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Limpar seleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropSelectorProfessional;
