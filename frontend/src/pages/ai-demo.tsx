// Página de demonstração AI
// Exemplo de uso dos componentes Firebase AI

'use client';

import { useState } from 'react';
import { Sparkles, MessageCircle, Bug, Leaf } from 'lucide-react';
import { AIChat, PestAnalysis } from '../components/AI';

type ActiveTab = 'chat' | 'agriculture' | 'pest';

export default function AIDemo() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  const tabs = [
    {
      id: 'chat' as const,
      label: 'Chat Geral',
      icon: MessageCircle,
      description: 'Conversa geral com AI'
    },
    {
      id: 'agriculture' as const,
      label: 'Assistant Agrícola',
      icon: Leaf,
      description: 'Especialista em agricultura'
    },
    {
      id: 'pest' as const,
      label: 'Análise de Pragas',
      icon: Bug,
      description: 'Diagnóstico de pragas e doenças'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Lura Farm AI</h1>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstração dos componentes de Inteligência Artificial integrados com Firebase Vertex AI
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 mx-2 mb-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'chat' && (
            <div className="h-[600px]">
              <AIChat
                type="general"
                placeholder="Faça uma pergunta geral..."
                className="h-full"
                onResponse={(response) => {
                  console.log('Resposta AI:', response);
                }}
              />
            </div>
          )}

          {activeTab === 'agriculture' && (
            <div className="h-[600px]">
              <AIChat
                type="agriculture"
                placeholder="Pergunte sobre agricultura, cultivos, técnicas..."
                className="h-full"
                onResponse={(response) => {
                  console.log('Conselho agrícola:', response);
                }}
              />
            </div>
          )}

          {activeTab === 'pest' && (
            <div className="p-6">
              <PestAnalysis
                onAnalysisComplete={(analysis) => {
                  console.log('Análise de praga:', analysis);
                  // Aqui você pode salvar a análise, mostrar notificação, etc.
                }}
              />
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Chat AI</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Converse naturalmente com nossa AI. Faça perguntas sobre qualquer tópico
              e receba respostas inteligentes e contextualizadas.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Leaf className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Assistente Agrícola</h3>
            </div>
            <p className="text-green-700 text-sm">
              Especialista em agricultura com conhecimento sobre cultivos, clima,
              técnicas agrícolas e melhores práticas para Moçambique.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Bug className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Análise de Pragas</h3>
            </div>
            <p className="text-orange-700 text-sm">
              Diagnóstico inteligente de pragas e doenças. Descreva os sintomas
              e receba identificação e recomendações de tratamento.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gray-800 text-white rounded-lg p-6">
            <h3 className="font-semibold mb-2">🚀 Tecnologias Utilizadas</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-gray-700 px-3 py-1 rounded">Firebase</span>
              <span className="bg-gray-700 px-3 py-1 rounded">Vertex AI</span>
              <span className="bg-gray-700 px-3 py-1 rounded">Gemini Pro</span>
              <span className="bg-gray-700 px-3 py-1 rounded">Next.js</span>
              <span className="bg-gray-700 px-3 py-1 rounded">TypeScript</span>
              <span className="bg-gray-700 px-3 py-1 rounded">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}