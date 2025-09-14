'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MOZAMBIQUE_CROPS as CROPS_DATABASE, type MozambiqueCropData as CropData } from '@/data/mozambiqueCropsDatabase';
import { 
  getSmartDisplayConfig, 
  sortCropsByRelevance, 
  calculateOverallPriority 
} from '@/utils/smartCropDisplay';

// Category labels for the Mozambique crops
const CATEGORY_LABELS = {
  cereais: 'Cereais',
  leguminosas: 'Leguminosas',
  hortaliças: 'Hortaliças',
  frutíferas: 'Frutíferas',
  tubérculos: 'Tubérculos',
  industriais: 'Industriais',
  oleaginosas: 'Oleaginosas',
  especiarias: 'Especiarias'
} as const;

interface CropSelectorProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
  userProfile?: 'beginner' | 'commercial' | 'subsistence';
}

export default function CropSelector({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion,
  className = '',
  userProfile = 'beginner' // Padrão para iniciantes
}: CropSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAllMode, setShowAllMode] = useState<boolean>(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  
  // Número inicial de culturas a mostrar por categoria (modo inteligente)
  const INITIAL_CROPS_PER_CATEGORY = 3;

  const filteredCrops = CROPS_DATABASE.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar culturas com ordenação inteligente
  const groupedCrops = filteredCrops.reduce((acc, crop) => {
    if (!acc[crop.category]) acc[crop.category] = [];
    acc[crop.category].push(crop);
    return acc;
  }, {} as Record<string, CropData[]>);

  // Ordenar culturas dentro de cada categoria por relevância
  Object.keys(groupedCrops).forEach(category => {
    const cropIds = groupedCrops[category].map(crop => crop.id);
    const sortedIds = sortCropsByRelevance(cropIds, userProfile);
    groupedCrops[category] = sortedIds.map(id => 
      groupedCrops[category].find(crop => crop.id === id)!
    );
  });

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleClearAllCrops = () => {
    if (selectedCrops.length > 3) {
      setShowClearAllModal(true);
    } else {
      onCropSelect([]);
    }
  };

  const confirmClearAll = () => {
    onCropSelect([]);
    setShowClearAllModal(false);
  };

  const cancelClearAll = () => {
    setShowClearAllModal(false);
  };

  const getCropsToShow = (crops: CropData[], category: string) => {
    // Se há busca ativa, categoria específica selecionada, ou modo "mostrar todas", mostrar todas
    if (searchTerm.trim() !== '' || selectedCategory !== 'all' || showAllMode) {
      return crops;
    }

    // Se a categoria está expandida, mostrar todas as culturas desta categoria
    if (expandedCategories.has(category)) {
      return crops;
    }

    // Modo inteligente: mostrar culturas prioritárias primeiro
    if (!showAllMode) {
      // Separar culturas por prioridade
      const highPriorityCrops = crops.filter(crop => {
        const config = getSmartDisplayConfig(crop.id, userProfile);
        return config.showByDefault || config.priority === 'high';
      });

      const otherCrops = crops.filter(crop => {
        const config = getSmartDisplayConfig(crop.id, userProfile);
        return !config.showByDefault && config.priority !== 'high';
      });

      // Mostrar culturas de alta prioridade + algumas outras até o limite
      const cropsToShow = [...highPriorityCrops];
      const remainingSlots = Math.max(0, INITIAL_CROPS_PER_CATEGORY - highPriorityCrops.length);
      cropsToShow.push(...otherCrops.slice(0, remainingSlots));

      return cropsToShow;
    }

    return crops.slice(0, INITIAL_CROPS_PER_CATEGORY);
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
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <span className="text-xl sm:text-2xl">🌱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Selecção de Culturas
              </h3>
            </div>
            <p className="text-green-100 text-xs sm:text-sm leading-relaxed">
              Escolha as culturas para receber recomendações personalizadas baseadas 
              nas condições climáticas da sua região
            </p>
          </div>
        </div>

        {/* Dropdown Button - Mobile Optimized */}
        <div className="p-4 sm:p-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 text-sm sm:text-base">
                  {selectedCrops.length === 0 ? '🌾' : '✅'}
                </span>
              </div>
              <div className="text-left min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {selectedCrops.length === 0 
                    ? 'Selecione suas culturas' 
                    : `${selectedCrops.length} cultura${selectedCrops.length > 1 ? 's' : ''} selecionada${selectedCrops.length > 1 ? 's' : ''}`
                  }
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                  <span className="hidden sm:inline">
                    {selectedCrops.length === 0 
                      ? 'Clique para escolher suas culturas' 
                      : 'Clique para editar selecção'
                    }
                  </span>
                  <span className="sm:hidden">
                    {selectedCrops.length === 0 ? 'Escolher' : 'Editar'}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {selectedCrops.length > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                  {selectedCrops.length}
                </span>
              )}
              <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Selected Crops Preview - Mobile Optimized */}
          {selectedCrops.length > 0 && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400 text-sm sm:text-base">🌾</span>
                  <span className="text-xs sm:text-sm font-semibold text-green-800 dark:text-green-300">
                    Culturas Seleccionadas ({selectedCrops.length})
                  </span>
                </div>
                {selectedCrops.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearAllCrops();
                    }}
                    className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:hover:text-red-300 rounded-md transition-all duration-200 flex items-center gap-1"
                    title="Remover todas as culturas"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline">Limpar Todas</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {selectedCrops.map(cropId => {
                  const crop = CROPS_DATABASE.find(c => c.id === cropId);
                  if (!crop) return null;
                  
                  const compatibility = getRegionCompatibility(crop);
                  
                  return (
                    <div 
                      key={cropId}
                      className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-sm border transition-all group ${
                        compatibility === 'ideal' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-700' :
                        compatibility === 'compatible' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' :
                        compatibility === 'incompatible' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span className="text-sm sm:text-lg">{crop.icon}</span>
                      <span className="truncate max-w-16 sm:max-w-none">{crop.name}</span>
                      {compatibility === 'ideal' && <span className="text-green-600 hidden sm:inline">✨</span>}
                      {compatibility === 'incompatible' && <span className="text-red-600 hidden sm:inline">⚠️</span>}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSelection = selectedCrops.filter(id => id !== cropId);
                          onCropSelect(newSelection);
                        }}
                        className="ml-1 w-4 h-4 rounded-full bg-red-200 hover:bg-red-300 dark:bg-red-800/50 dark:hover:bg-red-700/50 flex items-center justify-center opacity-60 hover:opacity-100 transition-all group-hover:opacity-100"
                        title={`Remover ${crop.name}`}
                      >
                        <span className="text-red-600 dark:text-red-400 text-xs">×</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
            {/* Search and Filter - Mobile Optimized */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar culturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🏷️</span>
                  Filtrar por categoria
                </h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all transform hover:scale-105 shadow-sm ${
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
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all transform hover:scale-105 shadow-sm ${
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

              {/* Smart Display Toggle - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm sm:text-base">🧠</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Exibição Inteligente
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 leading-tight">
                      <span className="hidden sm:inline">
                        {showAllMode ? 'Mostrando todas as culturas' : 'Prioriza culturas recomendadas para você'}
                      </span>
                      <span className="sm:hidden">
                        {showAllMode ? 'Todas culturas' : 'Recomendadas'}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllMode(!showAllMode)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ${
                    showAllMode 
                      ? 'bg-gray-400 dark:bg-gray-600' 
                      : 'bg-blue-600 dark:bg-blue-500'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      showAllMode ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Crops List - Mobile Optimized */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              {Object.entries(groupedCrops).map(([category, crops]) => {
                const cropsToShow = getCropsToShow(crops, category);
                const hasMoreCrops = crops.length > INITIAL_CROPS_PER_CATEGORY;
                const isExpanded = expandedCategories.has(category);
                const showingAll = searchTerm.trim() !== '' || selectedCategory !== 'all' || isExpanded;

                return (
                  <div key={category} className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <span className="text-green-600 dark:text-green-400 text-sm sm:text-base">
                          {category === 'cereais' && '🌾'}
                          {category === 'leguminosas' && '🫘'}
                          {category === 'hortaliças' && '🥬'}
                          {category === 'frutíferas' && '🍎'}
                          {category === 'tubérculos' && '🥔'}
                          {category === 'industriais' && '🏭'}
                          {category === 'oleaginosas' && '🌻'}
                          {category === 'especiarias' && '🌿'}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
                        {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {cropsToShow.map(crop => {
                      const compatibility = getRegionCompatibility(crop);
                      const isSelected = selectedCrops.includes(crop.id);
                      const displayConfig = getSmartDisplayConfig(crop.id, userProfile);
                      const overallPriority = calculateOverallPriority(crop.id);
                      
                      return (
                        <div
                          key={crop.id}
                          onClick={() => handleCropToggle(crop.id)}
                          className={`group p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 relative ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-100 dark:shadow-green-900/20' 
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 hover:shadow-md'
                          }`}
                        >
                          {/* Priority Indicator - Mobile Optimized */}
                          {!showAllMode && (
                            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-1">
                              {displayConfig.priority === 'high' && (
                                <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                                  ⭐ <span className="hidden sm:inline">Top</span>
                                </div>
                              )}
                              {displayConfig.showByDefault && displayConfig.priority !== 'high' && (
                                <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-sm">
                                  🎯 <span className="hidden sm:inline">Recomendada</span>
                                </div>
                              )}
                              {userProfile && displayConfig.targetAudience === userProfile && (
                                <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-sm">
                                  👤 <span className="hidden sm:inline">Para você</span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pr-2">
                              <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-green-100 group-hover:dark:bg-green-900/30 transition-colors flex-shrink-0">
                                <span className="text-lg sm:text-xl">{crop.icon}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {crop.name}
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                  {crop.category}
                                  {!showAllMode && (
                                    <span className="ml-1 text-blue-600 dark:text-blue-400 hidden sm:inline">
                                      • Score: {overallPriority.toFixed(1)}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              {isSelected && (
                                <div className="p-1 bg-green-600 rounded-full">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                              {currentRegion && (
                                <div className="flex items-center">
                                  {compatibility === 'ideal' && (
                                    <div className="p-0.5 sm:p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                      <span className="text-green-600 text-xs">✨</span>
                                    </div>
                                  )}
                                  {compatibility === 'compatible' && (
                                    <div className="p-0.5 sm:p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                      <span className="text-yellow-600 text-xs">~</span>
                                    </div>
                                  )}
                                  {compatibility === 'incompatible' && (
                                    <div className="p-0.5 sm:p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                                      <span className="text-red-600 text-xs">⚠️</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
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
                  
                  {/* Botão Ver Mais */}
                  {hasMoreCrops && !showingAll && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => toggleCategoryExpansion(category)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span>Ver mais {crops.length - INITIAL_CROPS_PER_CATEGORY} culturas</span>
                        <ChevronDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Botão Ver Menos */}
                  {hasMoreCrops && isExpanded && searchTerm.trim() === '' && selectedCategory === 'all' && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => toggleCategoryExpansion(category)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span>Ver menos</span>
                        <ChevronDownIcon className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmação para limpar todas */}
      {showClearAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Acção
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tem a certeza de que deseja remover todas as {selectedCrops.length} culturas seleccionadas? Esta acção não pode ser desfeita.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelClearAll}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sim, Remover Todas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CROPS_DATABASE, type CropData };
