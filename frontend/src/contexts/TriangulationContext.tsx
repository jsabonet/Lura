'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface CellTowerData {
  operator: string;
  cellId: string;
  lac: string;
  rssi: number;
  distance: number;
}

export interface TriangulationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  method: 'gps' | 'cell_triangulation' | 'ip_fallback';
  towersUsed?: number;
  confidence?: number;
  towers?: CellTowerData[];
}

interface TriangulationContextType {
  location: TriangulationResult | null;
  isLoading: boolean;
  error: string | null;
  isTriangulationAvailable: boolean;
  requestTriangulation: () => Promise<void>;
  requestLocationHybrid: () => Promise<void>;
  clearLocation: () => void;
}

const TriangulationContext = createContext<TriangulationContextType | undefined>(undefined);

interface TriangulationProviderProps {
  children: ReactNode;
}

export function TriangulationProvider({ children }: TriangulationProviderProps) {
  const [location, setLocation] = useState<TriangulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se triangulação está disponível (backend rodando)
  const [isTriangulationAvailable, setIsTriangulationAvailable] = useState(false);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const checkTriangulationAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/triangulation/status/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsTriangulationAvailable(data.available || false);
        return data.available || false;
      }
      
      setIsTriangulationAvailable(false);
      return false;
    } catch (err) {
      setIsTriangulationAvailable(false);
      return false;
    }
  }, []);

  const requestTriangulation = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar disponibilidade primeiro
      const available = await checkTriangulationAvailability();
      if (!available) {
        throw new Error('Sistema de triangulação não disponível. Verifique se há um modem 4G/LTE conectado.');
      }

      const response = await fetch('http://localhost:8000/api/triangulation/locate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'hybrid_triangulation',
          timeout: 30000
        })
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const triangulationResult: TriangulationResult = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy_meters,
          timestamp: Date.now(),
          method: 'cell_triangulation',
          towersUsed: data.towers_used,
          confidence: data.confidence,
          towers: data.towers?.map((tower: any) => ({
            operator: tower.operator,
            cellId: tower.cell_id,
            lac: tower.lac,
            rssi: tower.rssi,
            distance: tower.distance
          }))
        };

        setLocation(triangulationResult);
        setError(null);
      } else {
        throw new Error(data.error || 'Falha na triangulação');
      }

    } catch (err: unknown) {
      let errorMessage = 'Erro na triangulação por torres celulares';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [checkTriangulationAvailability]);

  const requestLocationHybrid = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Primeira tentativa: GPS nativo
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('GPS timeout'));
            }, 8000); // Timeout mais curto para GPS

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                clearTimeout(timeoutId);
                resolve(pos);
              },
              (err) => {
                clearTimeout(timeoutId);
                reject(err);
              },
              {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 30000
              }
            );
          });

          const gpsResult: TriangulationResult = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            method: 'gps'
          };

          setLocation(gpsResult);
          setError(null);
          return;

        } catch (gpsErr) {
          console.log('GPS falhou, tentando triangulação celular...', gpsErr);
        }
      }

      // Segunda tentativa: Triangulação celular
      try {
        await requestTriangulation();
        return;
      } catch (triangulationErr) {
        console.log('Triangulação celular falhou, usando IP fallback...', triangulationErr);
      }

      // Terceira tentativa: IP Geolocation (fallback)
      try {
        const ipResponse = await fetch('http://ip-api.com/json/?fields=status,lat,lon,accuracy');
        const ipData = await ipResponse.json();

        if (ipData.status === 'success') {
          const ipResult: TriangulationResult = {
            latitude: ipData.lat,
            longitude: ipData.lon,
            accuracy: ipData.accuracy || 5000, // Precisão típica de IP
            timestamp: Date.now(),
            method: 'ip_fallback'
          };

          setLocation(ipResult);
          setError('Usando localização aproximada por IP (precisão limitada)');
        } else {
          throw new Error('Todas as tentativas de localização falharam');
        }
      } catch (ipErr) {
        throw new Error('Não foi possível obter localização por nenhum método disponível');
      }

    } catch (err: unknown) {
      let errorMessage = 'Erro ao obter localização';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [requestTriangulation]);

  const value: TriangulationContextType = {
    location,
    isLoading,
    error,
    isTriangulationAvailable,
    requestTriangulation,
    requestLocationHybrid,
    clearLocation
  };

  return (
    <TriangulationContext.Provider value={value}>
      {children}
    </TriangulationContext.Provider>
  );
}

export function useTriangulation(): TriangulationContextType {
  const context = useContext(TriangulationContext);
  if (context === undefined) {
    throw new Error('useTriangulation deve ser usado dentro de um TriangulationProvider');
  }
  return context;
}
