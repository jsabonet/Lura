'use client';

import React from 'react';
import { formatMetical, getCropPrice, CROP_PRICES_MZN } from '@/utils/currency';
import { SIMPLE_CROPS_DATABASE } from '@/data/simpleCropsDatabase';

interface MarketPricesProps {
  selectedCrops?: string[];
  className?: string;
}

function MarketPrices({ selectedCrops = [], className = '' }: MarketPricesProps) {
  // Se não há culturas selecionadas, mostrar preços das principais
  const cropsToShow = selectedCrops.length > 0 
    ? selectedCrops 
    : ['milho', 'arroz', 'feijao', 'tomate', 'cebola', 'mandioca'];

  const getCropName = (cropId: string) => {
    const crop = SIMPLE_CROPS_DATABASE.find(c => c.id === cropId);
    return crop?.name || cropId;
  };

  const getCropIcon = (cropId: string) => {
    const crop = SIMPLE_CROPS_DATABASE.find(c => c.id === cropId);
    return crop?.icon || '🌾';
  };

  const getPriceLevel = (cropId: string) => {
    const price = getCropPrice(cropId);
    if (!price) return 'médio';
    
    if (price.average >= 50) return 'alto';
    if (price.average >= 25) return 'médio';
    return 'baixo';
  };

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'alto': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'médio': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'baixo': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preços de Mercado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valores atualizados em Metical (MT)
            </p>
          </div>
        </div>
      </div>

      {/* Lista de preços */}
      <div className="p-4">
        <div className="space-y-3">
          {cropsToShow.map((cropId) => {
            const price = getCropPrice(cropId);
            const priceLevel = getPriceLevel(cropId);
            
            if (!price) return null;
            
            return (
              <div
                key={cropId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCropIcon(cropId)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {getCropName(cropId)}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      por kg
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatMetical(price.average)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatMetical(price.min)} - {formatMetical(price.max)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriceLevelColor(priceLevel)}`}>
                    {priceLevel === 'alto' && '📈 Alto'}
                    {priceLevel === 'médio' && '📊 Médio'}
                    {priceLevel === 'baixo' && '📉 Baixo'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {cropsToShow.filter(id => getCropPrice(id)).length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Nenhum preço disponível para as culturas selecionadas</p>
          </div>
        )}
      </div>

      {/* Footer com informação */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>💡 Preços baseados no mercado local</span>
          <span>🇲🇿 Moeda: Metical (MT)</span>
        </div>
      </div>
    </div>
  );
}

export default MarketPrices;
