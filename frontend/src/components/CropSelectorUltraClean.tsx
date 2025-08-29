'use client';

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { SIMPLE_CROPS_DATABASE, type SimpleCropData } from '@/data/simpleCropsDatabase';

interface CropSelectorUltraCleanProps {
  selectedCrops: string[];
  onCropSelect: (cropIds: string[]) => void;
  currentRegion?: string;
  className?: string;
}

function CropSelectorUltraClean({ 
  selectedCrops, 
  onCropSelect, 
  currentRegion = '',
  className = '' 
}: CropSelectorUltraCleanProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar culturas
  const filteredCrops = useMemo(() => {
    return SIMPLE_CROPS_DATABASE.filter(crop => {
      return crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const handleCropToggle = (cropId: string) => {
    const newSelection = selectedCrops.includes(cropId)
      ? selectedCrops.filter(id => id !== cropId)
      : [...selectedCrops, cropId];
    onCropSelect(newSelection);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header minimalista */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Selecionar Culturas
        </h3>
      </div>

      {/* Busca */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lista simples */}
      <div className="p-4">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrops.includes(crop.id);
            
            return (
              <label
                key={crop.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCropToggle(crop.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-lg">{crop.icon}</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {crop.name}
                </span>
              </label>
            );
          })}
        </div>
        
        {filteredCrops.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma cultura encontrada
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedCrops.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCrops.length} selecionada{selectedCrops.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => onCropSelect([])}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropSelectorUltraClean;
