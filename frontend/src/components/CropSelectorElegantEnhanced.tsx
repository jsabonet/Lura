'use client';

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  CheckIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData } from '@/data/mozambiqueCropsDatabase';

interface CropSelectorElegantEnhancedProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorElegantEnhanced({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorElegantEnhancedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar culturas
  const filteredCrops = useMemo(() => {
    return SIMPLE_CROPS_DATABASE.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           CATEGORY_LABELS[crop.category].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Agrupar por categoria
  const groupedCrops = useMemo(() => {
    return filteredCrops.reduce((acc, crop) => {
      if (!acc[crop.category]) {
        acc[crop.category] = [];
      }
      acc[crop.category].push(crop);
      return acc;
    }, {} as Record<string, SimpleCropData[]>);
  }, [filteredCrops]);

  // Estatísticas por categoria
  const categoryStats = useMemo(() => {
    return Object.entries(CATEGORY_LABELS).map(([key, label]) => {
      const count = SIMPLE_CROPS_DATABASE.filter(crop => crop.category === key).length;
      const selectedCount = selectedCrops.filter(cropId => {
        const crop = SIMPLE_CROPS_DATABASE.find(c => c.id === cropId);
        return crop?.category === key;
      }).length;
      return { key, label, count, selectedCount };
    });
  }, [selectedCrops]);

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const getCompatibilityStatus = (crop: SimpleCropData): 'ideal' | 'boa' | 'regular' => {
    if (!currentRegion) return 'ideal';
    
    if (crop.idealRegions.some(region => 
      region.toLowerCase().includes(currentRegion.toLowerCase())
    )) {
      return 'ideal';
    }
    
    if (crop.compatibleRegions.some(region => 
      region.toLowerCase().includes(currentRegion.toLowerCase())
    )) {
      return 'boa';
    }
    
    return 'regular';
  };

  const getCompatibilityBadge = (status: string) => {
    switch (status) {
      case 'ideal': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Ideal</span>;
      case 'boa': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Compatível</span>;
      case 'regular': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Regular</span>;
      default: 
        return null;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-semibold">Culturas Disponíveis</h3>
              <p className="text-green-100 text-sm">
                Escolha as culturas para análise personalizada
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{selectedCrops.length}</div>
            <div className="text-xs text-green-100">selecionadas</div>
          </div>
        </div>
      </div>

      {/* Filtros rápidos de categoria */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por categoria:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todas ({SIMPLE_CROPS_DATABASE.length})
          </button>
          {categoryStats.map(({ key, label, count, selectedCount }) => (
            <button
              key={key}
              onClick={() => handleCategorySelect(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedCategory === key
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label} ({count})
              {selectedCount > 0 && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold ${
                  selectedCategory === key ? 'bg-white text-green-500' : 'bg-green-500 text-white'
                }`}>
                  {selectedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Busca elegante */}
      <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar culturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de culturas por categoria */}
      <div className="px-6 pb-6">
        {Object.entries(groupedCrops).map(([category, crops]) => (
          <div key={category} className="mb-6 last:mb-0">
            {/* Título da categoria */}
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {CATEGORY_LABELS[category]}
              <span className="text-xs text-gray-500 dark:text-gray-400 normal-case">
                ({crops.length})
              </span>
            </h4>
            
            {/* Grid de culturas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {crops.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                const compatibility = getCompatibilityStatus(crop);
                
                return (
                  <div
                    key={crop.id}
                    onClick={() => handleCropToggle(crop.id)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-400 shadow-lg'
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                    }`}
                  >
                    {/* Checkbox flutuante */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-green-500 bg-green-500 shadow-lg'
                        : 'border-gray-300 dark:border-gray-500 group-hover:border-green-400'
                    }`}>
                      {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{crop.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {crop.name}
                        </h5>
                        
                        {/* Badge de compatibilidade */}
                        <div className="mb-2">
                          {getCompatibilityBadge(compatibility)}
                        </div>
                        
                        {/* Info adicional */}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {crop.plantingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Nenhuma cultura encontrada</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Tente ajustar o termo de busca ou categoria
            </p>
          </div>
        )}
      </div>

      {/* Footer com estatísticas */}
      {selectedCrops.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCrops.length} cultura{selectedCrops.length !== 1 ? 's' : ''} selecionada{selectedCrops.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => onCropSelect([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors font-medium"
            >
              Limpar todas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropSelectorElegantEnhanced;
