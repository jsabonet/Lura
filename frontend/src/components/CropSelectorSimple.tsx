'use client';

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, CATEGORY_LABELS, type SimpleCropData } from '@/data/simpleCropsDatabase';

interface CropSelectorSimpleProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorSimple({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorSimpleProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar culturas
  const filteredCrops = useMemo(() => {
    return SIMPLE_CROPS_DATABASE.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           CATEGORY_LABELS[crop.category].toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Culturas Disponíveis
        </h3>
        {selectedCrops.length > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {selectedCrops.length} selecionada{selectedCrops.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Busca */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar culturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Lista de culturas */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrops.includes(crop.id);
            
            return (
              <div
                key={crop.id}
                onClick={() => handleCropToggle(crop.id)}
                className={`relative p-3 border rounded-md cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {isSelected && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                  </div>
                  
                  {/* Ícone */}
                  <span className="text-xl flex-shrink-0">{crop.icon}</span>
                  
                  {/* Informações */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {crop.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {CATEGORY_LABELS[crop.category]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Nenhuma cultura encontrada</p>
          </div>
        )}
      </div>

      {/* Footer com ação de limpar */}
      {selectedCrops.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => onCropSelect([])}
            className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Limpar todas as seleções
          </button>
        </div>
      )}
    </div>
  );
}

export default CropSelectorSimple;
