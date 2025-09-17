'use client';

import { useState } from 'react';
import { AIChat } from '../../components/AI';
import { useRouter } from 'next/navigation';
import { Loader2, Bot, BookOpen, Bug, Sprout } from 'lucide-react';

export default function ChatbotPage() {
  const router = useRouter();
  const [activeChatType, setActiveChatType] = useState<'general' | 'agriculture' | 'pest_analysis'>('agriculture');

  const chatTypes = [
    {
      id: 'agriculture' as const,
      name: 'Assistente Agrícola',
      icon: Sprout,
      description: 'Tire dúvidas sobre cultivos, manejo e técnicas agrícolas.',
      placeholder: 'Ex: Como cultivar milho na época da seca?'
    },
    {
      id: 'pest_analysis' as const,
      name: 'Análise de Pragas',
      icon: Bug,
      description: 'Consulte sobre pragas, doenças e tratamentos.',
      placeholder: 'Ex: Como identificar e tratar ferrugem no café?'
    },
    {
      id: 'general' as const,
      name: 'Chat Geral',
      icon: Bot,
      description: 'Converse sobre qualquer assunto agrícola.',
      placeholder: 'Ex: Qual a melhor época para plantio?'
    }
  ];

  const activeChat = chatTypes.find(type => type.id === activeChatType);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-green-600" />
            Assistente Virtual AgroAlerta
          </h1>
          <p className="mt-2 text-gray-600">
            Converse com nossa IA especializada em agricultura moçambicana.
          </p>
        </div>

        {/* Chat Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {chatTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveChatType(type.id)}
              className={`p-4 rounded-lg border transition-all ${
                type.id === activeChatType
                  ? 'border-green-500 bg-green-50 shadow-sm'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <type.icon className={`w-6 h-6 ${
                  type.id === activeChatType ? 'text-green-600' : 'text-gray-500'
                }`} />
                <div className="text-left">
                  <h3 className={`font-semibold ${
                    type.id === activeChatType ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {type.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-medium">Dicas para melhor uso:</h3>
          </div>
          <ul className="text-sm text-blue-600 space-y-1 ml-7 list-disc">
            <li>Seja específico nas suas perguntas</li>
            <li>Mencione a cultura ou problema específico</li>
            <li>Inclua detalhes sobre localização e época do ano</li>
            <li>Para análise de pragas, descreva os sintomas observados</li>
          </ul>
        </div>

        {/* AI Chat Component */}
        <div className="bg-white rounded-xl shadow-lg border min-h-[600px]">
          <AIChat
            type={activeChatType}
            placeholder={activeChat?.placeholder}
            className="min-h-[600px]"
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Este assistente usa IA para fornecer sugestões gerais. 
          Para recomendações específicas, consulte um agrônomo.
        </div>
      </div>
    </div>
  )
}