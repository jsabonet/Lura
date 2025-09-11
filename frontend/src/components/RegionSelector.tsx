import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Building2, TreePine, Search } from 'lucide-react';
import { MOZAMBIQUE_PROVINCES, Province, District } from '../data/mozambiqueRegions';
import DistrictInfoCard from './DistrictInfoCard';

interface RegionSelectorProps {
  onRegionSelect: (province: string, district?: string, coords?: { lat: number; lng: number }) => void;
  selectedProvince?: string;
  selectedDistrict?: string;
  className?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  onRegionSelect,
  selectedProvince,
  selectedDistrict,
  className = ''
}) => {
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [currentProvince, setCurrentProvince] = useState<Province | null>(null);
  const [districtSearch, setDistrictSearch] = useState('');
  
  // Filtrar distritos baseado na pesquisa
  const filteredDistricts = currentProvince?.districts.filter(district =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    district.description?.toLowerCase().includes(districtSearch.toLowerCase()) ||
    district.economicActivity?.some(activity => 
      activity.toLowerCase().includes(districtSearch.toLowerCase())
    )
  ) || [];

  // Atualizar província atual quando selectedProvince muda
  useEffect(() => {
    if (selectedProvince) {
      const province = MOZAMBIQUE_PROVINCES.find(p => p.name === selectedProvince);
      setCurrentProvince(province || null);
    } else {
      setCurrentProvince(null);
    }
  }, [selectedProvince]);

  const handleProvinceSelect = (province: Province) => {
    setCurrentProvince(province);
    setIsProvinceOpen(false);
    setIsDistrictOpen(false);
    setDistrictSearch('');
    // Selecionar apenas província (dados gerais da província)
    onRegionSelect(province.name, undefined, province.coords);
  };

  const handleDistrictSelect = (district: District) => {
    if (currentProvince) {
      setIsDistrictOpen(false);
      setDistrictSearch('');
      // Selecionar distrito específico
      onRegionSelect(currentProvince.name, district.name, district.coords);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Seletor de Província - Mobile Optimized */}
      <div className="relative">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          <Building2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Província
        </label>
        <button
          onClick={() => setIsProvinceOpen(!isProvinceOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base"
        >
          <span className={`${currentProvince ? 'text-gray-900' : 'text-gray-500'} truncate pr-2`}>
            {currentProvince ? currentProvince.name : 'Selecione uma província'}
          </span>
          <ChevronDown 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform flex-shrink-0 ${
              isProvinceOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </button>

        {isProvinceOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {MOZAMBIQUE_PROVINCES.map((province) => (
              <button
                key={province.name}
                onClick={() => handleProvinceSelect(province)}
                className={`w-full px-4 py-3 text-left hover:bg-green-50 focus:outline-none focus:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                  currentProvince?.name === province.name ? 'bg-green-100 text-green-800' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{province.name}</div>
                    <div className="text-sm text-gray-500">{province.description}</div>
                  </div>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Seletor de Distrito - só aparece se uma província estiver selecionada - Mobile Optimized */}
      {currentProvince && (
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <TreePine className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Distrito (Opcional - para dados mais específicos)</span>
            <span className="sm:hidden">Distrito (Opcional)</span>
          </label>
          <button
            onClick={() => setIsDistrictOpen(!isDistrictOpen)}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-sm sm:text-base"
          >
            <span className={`${selectedDistrict ? 'text-gray-900' : 'text-gray-500'} truncate pr-2`}>
              <span className="hidden sm:inline">{selectedDistrict || 'Selecione um distrito (opcional)'}</span>
              <span className="sm:hidden">{selectedDistrict || 'Selecionar distrito'}</span>
            </span>
            <ChevronDown 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform flex-shrink-0 ${
                isDistrictOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </button>

          {isDistrictOpen && (
            <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
              {/* Campo de pesquisa - Mobile Optimized */}
              <div className="p-2 sm:p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    placeholder="Pesquisar distritos..."
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {/* Opção para dados gerais da província */}
                <button
                  onClick={() => {
                    onRegionSelect(currentProvince.name, undefined, currentProvince.coords);
                    setIsDistrictOpen(false);
                    setDistrictSearch('');
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 border-b border-gray-100 transition-colors ${
                    !selectedDistrict ? 'bg-blue-100 text-blue-800' : 'text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">📍 Dados Gerais da Província</div>
                      <div className="text-sm text-gray-500">Informações regionais amplas de {currentProvince.name}</div>
                    </div>
                  </div>
                </button>

                {filteredDistricts.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {filteredDistricts.map((district) => (
                      <DistrictInfoCard
                        key={district.name}
                        district={district}
                        provinceName={currentProvince.name}
                        onSelect={() => handleDistrictSelect(district)}
                        isSelected={selectedDistrict === district.name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <div className="text-sm">
                      {districtSearch ? 
                        `Nenhum distrito encontrado para "${districtSearch}"` :
                        'Nenhum distrito disponível'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informações da seleção atual */}
      {currentProvince && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Seleção Atual:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>📍 <strong>Província:</strong> {currentProvince.name}</div>
            {selectedDistrict && (
              <div>🏘️ <strong>Distrito:</strong> {selectedDistrict}</div>
            )}
            <div>🌍 <strong>Coordenadas:</strong> 
              {selectedDistrict ? 
                (() => {
                  const district = currentProvince.districts.find(d => d.name === selectedDistrict);
                  return district ? ` ${district.coords.lat.toFixed(3)}, ${district.coords.lng.toFixed(3)}` : '';
                })() :
                ` ${currentProvince.coords.lat.toFixed(3)}, ${currentProvince.coords.lng.toFixed(3)}`
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
