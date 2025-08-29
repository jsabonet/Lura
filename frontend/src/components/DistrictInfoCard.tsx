import React from 'react';
import { District } from '../data/mozambiqueRegions';

interface DistrictInfoCardProps {
  district: District;
  provinceName: string;
  onSelect: () => void;
  isSelected: boolean;
}

const DistrictInfoCard: React.FC<DistrictInfoCardProps> = ({
  district,
  provinceName,
  onSelect,
  isSelected
}) => {
  const getActivityIcon = (activity: string) => {
    const act = activity.toLowerCase();
    if (act.includes('pesca')) return '🐟';
    if (act.includes('turismo')) return '🏖️';
    if (act.includes('mineração') || act.includes('carvão')) return '⛏️';
    if (act.includes('arroz')) return '🌾';
    if (act.includes('caju')) return '🥜';
    if (act.includes('coco')) return '🥥';
    if (act.includes('milho')) return '🌽';
    if (act.includes('mandioca')) return '🥔';
    if (act.includes('algodão')) return '🌿';
    if (act.includes('cana')) return '🎋';
    if (act.includes('café')) return '☕';
    if (act.includes('chá')) return '🍵';
    if (act.includes('horticultura')) return '🥬';
    if (act.includes('pecuária') || act.includes('gado')) return '🐄';
    if (act.includes('comércio')) return '🏪';
    if (act.includes('porto')) return '🚢';
    if (act.includes('indústria')) return '🏭';
    return '🌱';
  };

  const getPriorityIcon = (activities: string[]) => {
    // Determinar a atividade principal baseada na economia do distrito
    const hasAgriculture = activities.some(a => 
      ['milho', 'arroz', 'mandioca', 'algodão', 'caju', 'coco'].some(crop => 
        a.toLowerCase().includes(crop)
      )
    );
    
    const hasFishing = activities.some(a => a.toLowerCase().includes('pesca'));
    const hasTourism = activities.some(a => a.toLowerCase().includes('turismo'));
    const hasMining = activities.some(a => 
      a.toLowerCase().includes('mineração') || a.toLowerCase().includes('carvão')
    );

    if (hasMining) return '⛏️';
    if (hasTourism) return '🏖️';
    if (hasFishing) return '🐟';
    if (hasAgriculture) return '🌾';
    return '🏘️';
  };

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
          : 'bg-white border-gray-200 hover:border-green-300'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">{getPriorityIcon(district.economicActivity || [])}</span>
            <h4 className="font-semibold text-gray-900">{district.name}</h4>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {provinceName}
            </span>
          </div>
          
          {district.description && (
            <p className="text-sm text-gray-600 mb-2">{district.description}</p>
          )}
          
          <div className="text-xs text-gray-500 mb-3">
            📍 {district.coords.lat.toFixed(3)}, {district.coords.lng.toFixed(3)}
          </div>
          
          {district.economicActivity && district.economicActivity.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700">Atividades Econômicas:</h5>
              <div className="flex flex-wrap gap-1">
                {district.economicActivity.slice(0, 4).map((activity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  >
                    <span>{getActivityIcon(activity)}</span>
                    <span>{activity}</span>
                  </span>
                ))}
                {district.economicActivity.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{district.economicActivity.length - 4} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DistrictInfoCard;
