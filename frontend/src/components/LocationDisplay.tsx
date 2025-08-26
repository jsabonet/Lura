'use client';

import React, { useState, useEffect } from 'react';
import { useTriangulation } from '@/contexts/TriangulationContext';

interface LocationDisplayProps {
  showDetails?: boolean;
}

export function LocationDisplay({ showDetails = true }: LocationDisplayProps) {
  const { 
    location, 
    isLoading, 
    error, 
    isTriangulationAvailable,
    requestTriangulation, 
    requestLocationHybrid, 
    clearLocation 
  } = useTriangulation();

  const [showTowerDetails, setShowTowerDetails] = useState(false);

  const formatAccuracy = (accuracy: number): string => {
    if (accuracy < 1000) {
      return `±${Math.round(accuracy)}m`;
    }
    return `±${(accuracy / 1000).toFixed(1)}km`;
  };

  const getMethodIcon = (method: string): string => {
    switch (method) {
      case 'gps': return '🛰️';
      case 'cell_triangulation': return '📡';
      case 'ip_fallback': return '🌐';
      default: return '📍';
    }
  };

  const getMethodName = (method: string): string => {
    switch (method) {
      case 'gps': return 'GPS Nativo';
      case 'cell_triangulation': return 'Triangulação Celular';
      case 'ip_fallback': return 'Localização por IP';
      default: return 'Desconhecido';
    }
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy <= 100) return 'text-green-600';
    if (accuracy <= 500) return 'text-yellow-600';
    if (accuracy <= 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          📍 Sistema de Localização
        </h3>
        {isTriangulationAvailable && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            📡 Triangulação Disponível
          </span>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={requestLocationHybrid}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Localizando...
            </>
          ) : (
            <>
              🎯 Localização Inteligente
            </>
          )}
        </button>

        <button
          onClick={requestTriangulation}
          disabled={isLoading || !isTriangulationAvailable}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          📡 Triangulação Celular
        </button>

        {location && (
          <button
            onClick={clearLocation}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            🗑️ Limpar
          </button>
        )}
      </div>

      {/* Resultado da Localização */}
      {location && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMethodIcon(location.method)}</span>
              <div>
                <h4 className="font-medium text-gray-800">
                  {getMethodName(location.method)}
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(location.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className={`text-right ${getAccuracyColor(location.accuracy)}`}>
              <div className="font-medium">{formatAccuracy(location.accuracy)}</div>
              <div className="text-xs">Precisão</div>
            </div>
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Latitude:</span>
              <div className="font-mono font-medium">{location.latitude.toFixed(6)}</div>
            </div>
            <div>
              <span className="text-gray-600">Longitude:</span>
              <div className="font-mono font-medium">{location.longitude.toFixed(6)}</div>
            </div>
          </div>

          {/* Detalhes da Triangulação */}
          {location.method === 'cell_triangulation' && showDetails && (
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Detalhes da Triangulação
                </span>
                <button
                  onClick={() => setShowTowerDetails(!showTowerDetails)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showTowerDetails ? 'Ocultar' : 'Mostrar'} Torres
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {location.towersUsed && (
                  <div>
                    <span className="text-gray-600">Torres:</span>
                    <div className="font-medium">{location.towersUsed}</div>
                  </div>
                )}
                {location.confidence && (
                  <div>
                    <span className="text-gray-600">Confiança:</span>
                    <div className="font-medium">{(location.confidence * 100).toFixed(1)}%</div>
                  </div>
                )}
              </div>

              {/* Detalhes das Torres */}
              {showTowerDetails && location.towers && location.towers.length > 0 && (
                <div className="bg-white rounded p-3 space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Torres Detectadas:</h5>
                  {location.towers.map((tower, index) => (
                    <div key={index} className="text-xs bg-gray-50 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{tower.operator}</span>
                        <span className="text-gray-600">{tower.rssi}dBm</span>
                      </div>
                      <div className="text-gray-600">
                        Cell: {tower.cellId} | LAC: {tower.lac} | ~{Math.round(tower.distance)}m
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link para Google Maps */}
          <div className="border-t pt-3">
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              🗺️ Ver no Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-red-500">⚠️</span>
            <div>
              <h4 className="text-sm font-medium text-red-800">Erro</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status do Sistema */}
      {showDetails && (
        <div className="border-t pt-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Status do Sistema</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${navigator.geolocation ? 'bg-green-500' : 'bg-red-500'}`}></span>
              GPS Nativo
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isTriangulationAvailable ? 'bg-green-500' : 'bg-orange-500'}`}></span>
              Triangulação Celular
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
