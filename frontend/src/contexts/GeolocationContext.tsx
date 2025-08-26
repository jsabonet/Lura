'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationContextType {
  location: GeolocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
  isSupported: boolean;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

interface GeolocationProviderProps {
  children: ReactNode;
}

export function GeolocationProvider({ children }: GeolocationProviderProps) {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Verificar se a API de geolocalização está disponível
  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const requestLocation = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError('Geolocalização não é suportada neste navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache por 1 minuto
          }
        );
      });

      const newLocation: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setLocation(newLocation);
      setHasPermission(true);
      setError(null);

    } catch (err: unknown) {
      let errorMessage = 'Erro ao obter localização';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const error = err as GeolocationPositionError;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
            setHasPermission(false);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização não disponível. Verifique se o GPS está ativado.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido. Tente novamente.';
            break;
          default:
            if (err && typeof err === 'object' && 'message' in err) {
              errorMessage = String((err as { message: unknown }).message);
            } else {
              errorMessage = 'Erro desconhecido ao obter localização';
            }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Verificar permissões na inicialização
  useEffect(() => {
    if (isSupported && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((permission) => {
          setHasPermission(permission.state === 'granted');
          
          permission.addEventListener('change', () => {
            setHasPermission(permission.state === 'granted');
            
            if (permission.state === 'denied') {
              clearLocation();
            }
          });
        })
        .catch(() => {
          // Fallback se a API de permissões não estiver disponível
          setHasPermission(null);
        });
    }
  }, [isSupported, clearLocation]);

  const value: GeolocationContextType = {
    location,
    isLoading,
    error,
    hasPermission,
    isSupported,
    requestLocation,
    clearLocation
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation(): GeolocationContextType {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation deve ser usado dentro de um GeolocationProvider');
  }
  return context;
}
