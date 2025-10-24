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

      if (response.success && (response.content || response.content_html)) {
        // If agriculture single-shot, assemble full response (including local continuations)
        if (type === 'agriculture') {
          let finalText = response.content || (response.content_html ? response.content_html.replace(/<[^>]+>/g, '') : '');
          let finalHtml = response.content_html || undefined;
          if (response.truncated) {
            const maxLocalRetries = 3;
            let contCount = 0;
            while (contCount < maxLocalRetries) {
              contCount += 1;
              setIsLoading(true);
              try {
                const contPrompt = `Por favor, continue a resposta anterior.\n\nResposta anterior:\n${finalText}\n\nContinue a partir daqui:`;
                const contResp = await aiService.generateText(contPrompt);
                if (contResp.success && (contResp.content || contResp.content_html)) {
                  const contText = contResp.content || (contResp.content_html ? contResp.content_html.replace(/<[^>]+>/g, '') : '');
                  finalText = (finalText ? finalText + '\n\n' : '') + contText;
                  if (contResp.content_html) {
                    finalHtml = finalHtml ? finalHtml + '<br/>' + contResp.content_html : contResp.content_html;
                  }
                  if (!contResp.truncated) {
                    // completed
                    break;
                  }
                } else {
                  break;
                }
              } catch (e) {
                console.warn('Continuation attempt failed', e);
                break;
              } finally {
                setIsLoading(false);
              }
            }
          }

          const aiMessage: ChatMessage = {
            role: 'assistant',
            content: finalText,
            content_html: finalHtml,
            timestamp: new Date(),
            truncated: false
          };

          setMessages(prev => [...prev, aiMessage]);
          if (onResponse) onResponse({ ...response, content: finalText, content_html: finalHtml, truncated: false });
        } else {
          const aiMessage: ChatMessage = {
            role: 'assistant',
            content: response.content || (response.content_html ? response.content_html.replace(/<[^>]+>/g, '') : ''),
            content_html: response.content_html,
            timestamp: new Date(),
            // backend may flag truncated responses
            truncated: !!response.truncated
          };

          setMessages(prev => [...prev, aiMessage]);
          if (onResponse) onResponse(response);
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

    // If the last assistant message was truncated, try to continue automatically (background)
    useEffect(() => {
      const last = messages[messages.length - 1];
      if (!last || last.role !== 'assistant' || !last.truncated) return;

      // run a background continuation attempt
      (async () => {
        try {
          const history = [...messages];
          history.push({ role: 'user', content: 'Por favor, continue a resposta anterior.', timestamp: new Date() });
          const resp = await aiService.chatWithContext(history);
          if (resp.success && (resp.content || resp.content_html)) {
            setMessages(prev => {
              const copy = [...prev];
              const idx = copy.length - 1;
              const msg = { ...copy[idx] };
              const continuation = resp.content || (resp.content_html ? resp.content_html.replace(/<[^>]+>/g, '') : '');
              msg.content = (msg.content ? msg.content + '\n\n' : '') + continuation;
              msg.content_html = resp.content_html || (msg.content_html ? msg.content_html + '<br/>' + (resp.content_html || '') : undefined);
              msg.truncated = !!resp.truncated ? true : false;
              copy[idx] = msg;
              return copy;
            });
          }
        } catch (err) {
          // ignore background continuation errors (user can click to retry)
          console.warn('Background continuation failed', err);
        }
      })();
    }, [messages]);

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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900 ${className}`}>
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTypeIcon()}</span>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{getTypeTitle()}</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Converse com o assistente para obter recomendações práticas.</p>
              </div>
            </div>
            <div>
              <button
                onClick={clearChat}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Limpar Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Dicas rápidas</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                <li>Inclua o máximo de contexto sobre a sua machamba.</li>
                <li>Descreva sintomas de pragas com fotos quando possível.</li>
                <li>Peça recomendações de variedades locais.</li>
              </ul>
            </div>
          </aside>

          <main className="lg:col-span-2 flex flex-col h-[70vh] bg-transparent">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-full ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block text-left max-w-full lg:max-w-3xl px-5 py-4 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 dark:bg-slate-900 dark:text-gray-200'} shadow-sm border border-gray-100 dark:border-gray-800`}>
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 break-words">
                          {message.content_html ? (
                            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content_html }} />
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          )}

                          {message.truncated && (
                            <div className="mt-2 text-xs text-yellow-700 flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Resposta potencialmente incompleta (parcial)</span>
                            </div>
                          )}

                          {message.timestamp && (
                            <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {formatTime(message.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

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

            {/* Input area */}
            <div className="mt-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  disabled={isLoading || !aiService.isServiceAvailable()}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || !aiService.isServiceAvailable()}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          </main>
        </div>
      </div>
    </div>
  );
}