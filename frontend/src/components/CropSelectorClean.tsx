'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData } from '@/data/simpleCropsDatabase';

interface CropSelectorProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorClean({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtrar culturas baseado na busca e categoria
  const filteredCrops = SIMPLE_CROPS_DATABASE.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupar por categoria
  const groupedCrops = filteredCrops.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = [];
    }
    acc[crop.category].push(crop);
    return acc;
  }, {} as Record<string, SimpleCropData[]>);

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  const getCompatibilityStatus = (crop: SimpleCropData): 'ideal' | 'compatível' | 'inadequada' => {
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
  };

  const getCompatibilityColor = (status: string) => {
    switch (status) {
      case 'ideal': return 'text-green-600 bg-green-100';
      case 'compatível': return 'text-yellow-600 bg-yellow-100';
      case 'inadequada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seleção de Culturas
        </h3>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar culturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between"
          >
            <span className="text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? 'Todas as categorias' : CATEGORY_LABELS[selectedCategory as keyof typeof CATEGORY_LABELS]}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
              <button
                onClick={() => { setSelectedCategory('all'); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              >
                Todas as categorias
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedCategory(key); setShowDropdown(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Crops List */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {Object.entries(groupedCrops).map(([category, crops]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {crops.map((crop) => {
                const compatibility = getCompatibilityStatus(crop);
                const isSelected = selectedCrops.includes(crop.id);
                
                return (
                  <div
                    key={crop.id}
                    onClick={() => handleCropToggle(crop.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{crop.icon}</span>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {crop.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {crop.season} • {crop.growthPeriod} dias
                            </span>
                            {currentRegion && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(compatibility)}`}>
                                {compatibility}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma cultura encontrada com os filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Selected Count */}
      {selectedCrops.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCrops.length} cultura{selectedCrops.length !== 1 ? 's' : ''} selecionada{selectedCrops.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

export default CropSelectorClean;
