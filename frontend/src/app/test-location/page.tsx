'use client';

import React, { useState } from 'react';

export default function TestLocationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testGoogleMapsLocation = async () => {
    setIsLoading(true);
    setError('');
    setLocation(null);

    try {
      console.log('🚀 Iniciando teste de localização...');
      
      // Verificar se geolocation está disponível
      if (!navigator.geolocation) {
        throw new Error('Geolocalização não suportada pelo navegador');
      }

      // Obter posição usando GPS nativo
      console.log('📍 Obtendo coordenadas GPS...');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      console.log('✅ Coordenadas obtidas:', { latitude, longitude, accuracy });

      // Testar Google Maps Geocoding API
      const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log('🔑 Google Maps API Key:', GOOGLE_MAPS_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA');

      let address = 'Endereço não disponível';
      let geocodingSuccess = false;

      if (GOOGLE_MAPS_API_KEY) {
        console.log('🌍 Testando Google Maps Geocoding API...');
        
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR`;
        console.log('📡 URL da requisição:', geocodeUrl);

        try {
          const response = await fetch(geocodeUrl);
          console.log('📊 Status da resposta:', response.status, response.statusText);
          console.log('📊 Headers da resposta:', Object.fromEntries(response.headers.entries()));

          if (response.ok) {
            const geocodeData = await response.json();
            console.log('📦 Dados recebidos:', geocodeData);

            if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
              address = geocodeData.results[0].formatted_address;
              geocodingSuccess = true;
              console.log('✅ Endereço obtido via Google Maps:', address);
            } else {
              console.warn('⚠️ Google Maps API não retornou resultados válidos:', geocodeData.status, geocodeData.error_message || 'Sem detalhes');
              if (geocodeData.error_message) {
                address = `Erro: ${geocodeData.error_message}`;
              } else {
                address = `Status: ${geocodeData.status} - ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
              }
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Erro na resposta da API:', response.status, errorText);
            address = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (geocodeError: any) {
          console.error('❌ Erro ao chamar Google Maps API:', geocodeError);
          address = `Erro de rede: ${geocodeError?.message || 'Desconhecido'}`;
        }
      } else {
        console.warn('⚠️ Chave da API do Google Maps não configurada');
        address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }

      // Resultado final
      const result = {
        latitude,
        longitude,
        accuracy,
        timestamp: Date.now(),
        address,
        geocodingSuccess,
        apiKeyConfigured: !!GOOGLE_MAPS_API_KEY
      };

      console.log('🎉 Resultado final:', result);
      setLocation(result);

    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido';
      console.error('❌ Erro no teste:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🧪 Teste do Google Maps API - Localização
          </h1>

          <div className="text-center mb-8">
            <button
              onClick={testGoogleMapsLocation}
              disabled={isLoading}
              className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Obtendo localização...
                </div>
              ) : (
                '🚀 Testar Localização com Google Maps'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <div>
                  <h3 className="font-semibold text-red-800">Erro</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {location && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <span className="mr-2">✅</span>
                Localização Obtida com Sucesso!
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">🌍 Coordenadas</h3>
                  <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">🎯 Precisão</h3>
                  <p><strong>±{location.accuracy.toFixed(0)}m</strong></p>
                  <p className="text-sm text-gray-600">
                    {location.accuracy <= 10 ? 'Muito Alta' : 
                     location.accuracy <= 50 ? 'Alta' : 
                     location.accuracy <= 100 ? 'Boa' : 'Moderada'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-2">📍 Endereço</h3>
                  <p className="text-gray-800">{location.address}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className={`flex items-center ${location.apiKeyConfigured ? 'text-green-600' : 'text-red-600'}`}>
                      {location.apiKeyConfigured ? '✅' : '❌'} API Key
                    </span>
                    <span className={`flex items-center ${location.geocodingSuccess ? 'text-green-600' : 'text-orange-600'}`}>
                      {location.geocodingSuccess ? '✅' : '⚠️'} Geocodificação
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-2">🕐 Timestamp</h3>
                  <p>{new Date(location.timestamp).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {location.geocodingSuccess && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    🎉 Google Maps API funcionando perfeitamente!
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    O endereço foi obtido com sucesso usando a API de Geocodificação do Google Maps.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Informações do Teste</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Este teste usa GPS nativo + Google Maps Geocoding API</li>
              <li>• O navegador solicitará permissão de localização</li>
              <li>• O console do navegador mostra logs detalhados</li>
              <li>• Abra as Ferramentas do Desenvolvedor (F12) para ver mais detalhes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
