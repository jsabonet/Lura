// AI Chat Component
// Componente de chat interativo com Firebase AI

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { aiService, AIResponse, ChatMessage } from '../../services/aiService';

interface AIChatProps {
  type?: 'general' | 'agriculture' | 'pest_analysis';
  placeholder?: string;
  className?: string;
  onResponse?: (response: AIResponse) => void;
}

export default function AIChat({ 
  type = 'general', 
  placeholder = 'Digite sua pergunta...',
  className = '',
  onResponse
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adicionar mensagem inicial do sistema baseada no tipo
  useEffect(() => {
    const systemMessages = {
      general: 'Olá! Sou seu assistente AI. Como posso ajudar?',
      agriculture: 'Olá! Sou especializado em agricultura. Posso ajudar com cultivos, pragas, clima e técnicas agrícolas.',
      pest_analysis: 'Olá! Sou especialista em análise de pragas e doenças. Descreva os sintomas que observa nas suas plantas.'
    };

    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: systemMessages[type],
        timestamp: new Date()
      }]);
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Preparar histórico para AI
      const chatHistory = [...messages, userMessage];
      
      let response: AIResponse;

      // Escolher método baseado no tipo
      if (type === 'agriculture') {
        response = await aiService.getAgricultureAdvice(trimmedInput, {
          // Pode extrair contexto das mensagens anteriores se necessário
        });
      } else {
        response = await aiService.chatWithContext(chatHistory);
      }

      if (response.success && response.content) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.content,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Callback opcional
        if (onResponse) {
          onResponse(response);
        }
      } else {
        setError(response.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const systemMessages = {
      general: 'Chat limpo. Como posso ajudar?',
      agriculture: 'Chat limpo. Pronto para novas consultas agrícolas!',
      pest_analysis: 'Chat limpo. Descreva novos sintomas para análise.'
    };

    setMessages([{
      role: 'assistant',
      content: systemMessages[type],
      timestamp: new Date()
    }]);
    setError(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'agriculture':
        return '🌱';
      case 'pest_analysis':
        return '🐛';
      default:
        return '🤖';
    }
  };

  const getTypeTitle = () => {
    switch (type) {
      case 'agriculture':
        return 'Assistente Agrícola';
      case 'pest_analysis':
        return 'Análise de Pragas';
      default:
        return 'Chat AI';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getTypeIcon()}</span>
          <h3 className="font-semibold">{getTypeTitle()}</h3>
          <Sparkles className="w-4 h-4" />
        </div>
        <button
          onClick={clearChat}
          className="text-sm bg-green-700 hover:bg-green-800 px-3 py-1 rounded transition-colors"
        >
          Limpar Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  )}
                </div>
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading || !aiService.isServiceAvailable()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !aiService.isServiceAvailable()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        {!aiService.isServiceAvailable() && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Serviço AI não disponível. Verifique a configuração do Firebase.
          </p>
        )}
      </div>
    </div>
  );
}