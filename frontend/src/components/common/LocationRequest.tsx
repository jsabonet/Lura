'use client';

import React from 'react';
import { useGeolocation } from '@/contexts/GeolocationContext';

interface LocationRequestProps {
  onLocationObtained?: (latitude: number, longitude: number) => void;
  className?: string;
}

export default function LocationRequest({ onLocationObtained, className = '' }: LocationRequestProps) {
  const {
    location,
    isLoading,
    error,
    hasPermission,
    requestLocation,
    clearLocation,
    isSupported
  } = useGeolocation();

  const handleRequestLocation = async () => {
    await requestLocation();
  };

  // Chamar callback quando localização for obtida
  React.useEffect(() => {
    if (location && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location, onLocationObtained]);

  if (!isSupported) {
    return (
      <div className={`p-4 bg-yellow-100 border border-yellow-400 rounded-lg ${className}`}>
        <div className="flex items-center">
          <div className="text-yellow-600 mr-3">⚠️</div>
          <div>
            <p className="font-medium text-yellow-800">GPS não suportado</p>
            <p className="text-sm text-yellow-700">
              Seu navegador não suporta geolocalização
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-100 border border-red-400 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">❌</div>
            <div>
              <p className="font-medium text-red-800">Erro de localização</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRequestLocation}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (location) {
    return (
      <div className={`p-4 bg-green-100 border border-green-400 rounded-lg ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">📍</div>
            <div>
              <p className="font-medium text-green-800">Localização obtida</p>
              <p className="text-sm text-green-700">
                Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-green-600">
                Precisão: ±{location.accuracy.toFixed(0)}m
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRequestLocation}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              Atualizar
            </button>
            <button
              onClick={clearLocation}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-blue-100 border border-blue-400 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-blue-600 mr-3">🗺️</div>
          <div>
            <p className="font-medium text-blue-800">Usar minha localização</p>
            <p className="text-sm text-blue-700">
              Obtenha dados climáticos precisos para sua localização atual
            </p>
          </div>
        </div>
        <button
          onClick={handleRequestLocation}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Obtendo...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>Obter localização</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
