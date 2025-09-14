'use client';

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData } from '@/data/simpleCropsDatabase';

interface CropSelectorMinimalProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorMinimal({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorMinimalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar culturas
  const filteredCrops = useMemo(() => {
    return SIMPLE_CROPS_DATABASE.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Compatibilidade simples
  function getCompatibilityStatus(crop: SimpleCropData): 'ideal' | 'boa' | 'regular' {
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
  }

  const getCompatibilityBadge = (status: string) => {
    switch (status) {
      case 'ideal': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Ideal</span>;
      case 'boa': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Boa</span>;
      case 'regular': 
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Regular</span>;
      default: 
        return null;
    }
  };

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header simples */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Selecção de Culturas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedCrops.length} culturas selecionadas
        </p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          {/* Busca */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar culturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtro de categoria */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              Filtros
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => { setSelectedCategory('all'); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    Todas as categorias
                  </button>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedCategory(key); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === key 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de culturas */}
      <div className="p-6">
        <div className="space-y-3">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrops.includes(crop.id);
            const compatibility = getCompatibilityStatus(crop);
            
            return (
              <div
                key={crop.id}
                onClick={() => handleCropToggle(crop.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Checkbox visual */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                    
                    {/* Ícone da cultura */}
                    <span className="text-2xl">{crop.icon}</span>
                    
                    {/* Nome e categoria */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {crop.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {CATEGORY_LABELS[crop.category]}
                      </p>
                    </div>
                  </div>
                  
                  {/* Badge de compatibilidade */}
                  <div className="flex items-center gap-2">
                    {getCompatibilityBadge(compatibility)}
                  </div>
                </div>
                
                {/* Informações básicas */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                    {crop.plantingTime}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                    {crop.season === 'todo_ano' ? 'Todo ano' : 
                     crop.season === 'chuvosa' ? 'Época chuvosa' : 'Época seca'}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                    {crop.economic.marketDemand === 'alta' ? 'Alta demanda' : 
                     crop.economic.marketDemand === 'média' ? 'Demanda média' : 'Baixa demanda'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Nenhuma cultura encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </div>

      {/* Footer com ações */}
      {selectedCrops.length > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCrops.length} cultura{selectedCrops.length !== 1 ? 's' : ''} selecionada{selectedCrops.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => onCropSelect([])}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Limpar selecção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropSelectorMinimal;
