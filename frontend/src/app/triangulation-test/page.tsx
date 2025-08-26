'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LocationDisplay } from '@/components/LocationDisplay';

export default function TriangulationTestPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Sistema de Triangulação Celular
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Localização precisa para laptops sem GPS
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <span className="mr-2">🧪</span>
            Página de Teste e Demonstração
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => router.push('/clima')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              🌤️ Clima
            </button>
          </nav>
        </div>

        {/* Sistema de Localização */}
        <div className="space-y-6">
          <LocationDisplay showDetails={true} />

          {/* Informações Técnicas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Informações Técnicas
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Como Funciona */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">🔬 Como Funciona</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Detecta torres celulares 4G/LTE visíveis</li>
                  <li>• Mede força do sinal (RSSI) de cada torre</li>
                  <li>• Calcula distância baseada no sinal</li>
                  <li>• Triangula posição usando geometria</li>
                  <li>• Combina múltiplos algoritmos para precisão</li>
                </ul>
              </div>

              {/* Requisitos */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">💻 Requisitos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Laptop com modem 4G/LTE integrado</li>
                  <li>• OU dongle USB 4G de qualquer marca</li>
                  <li>• OU hotspot móvel conectado</li>
                  <li>• Cobertura de pelo menos 3 torres</li>
                  <li>• Backend AgroAlerta rodando</li>
                </ul>
              </div>

              {/* Vantagens */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">🌟 Vantagens</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5-10x mais preciso que localização por IP</li>
                  <li>• Não requer GPS dedicado</li>
                  <li>• Funciona em ambientes fechados</li>
                  <li>• Baixo consumo de energia</li>
                  <li>• Processamento rápido (3-5 segundos)</li>
                </ul>
              </div>

              {/* Aplicações */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">🚜 Aplicações</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visitas técnicas em fazendas</li>
                  <li>• Relatórios geo-referenciados</li>
                  <li>• Alertas climáticos regionais</li>
                  <li>• Preços de mercado locais</li>
                  <li>• Monitoramento móvel de culturas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status do Backend */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">🔧 Status do Sistema</h4>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Backend:</strong> Conectar ao Django em localhost:8000
              </p>
              <p className="mb-2">
                <strong>Endpoints:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• GET /api/triangulation/status/ - Verificar disponibilidade</li>
                <li>• POST /api/triangulation/locate/ - Executar triangulação</li>
                <li>• GET /api/triangulation/test/ - Teste do sistema</li>
              </ul>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🔗 Links Úteis</h4>
            <div className="space-y-2 text-sm">
              <a 
                href="https://maps.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                🗺️ Google Maps - Verificar coordenadas
              </a>
              <a 
                href="https://www.gps-coordinates.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800"
              >
                📍 GPS Coordinates - Conversor de coordenadas
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
