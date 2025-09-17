// AI Service - Frontend
// Serviço para interação com Firebase Vertex AI no lado cliente

import { geminiModel, isVertexAIAvailable, useBackendProxy } from '../config/firebase';
import { apiService } from './api';

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

class AIService {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = isVertexAIAvailable();
  }

  private async getAppCheckToken(): Promise<string> {
    // TODO: Implementar obtenção do App Check token do Firebase
    return ''; // Por enquanto retorna vazio em dev
  }

  /**
   * Enviar prompt simples para o modelo Gemini
   */
  async generateText(prompt: string): Promise<AIResponse> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Vertex AI não está disponível. Verifique a configuração do Firebase.',
        };
      }

      if (!prompt || prompt.trim().length === 0) {
        return {
          success: false,
          error: 'Prompt não pode estar vazio.',
        };
      }

      // Se estiver usando proxy no backend, encaminhar ao endpoint do servidor
      if (useBackendProxy) {
        // Usar o apiService para fazer a requisição
        const response = await apiService.post<AIResponse>('/ai/proxy/generate/', { prompt });
        
        if (response.error) {
          return {
            success: false,
            error: response.error
          };
        }

        return response.data || {
          success: false,
          error: 'Resposta vazia do servidor'
        };
      }

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        success: true,
        content: content,
        usage: {
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          candidatesTokens: response.usageMetadata?.candidatesTokenCount || 0,
        }
      };
    } catch (error) {
      console.error('Erro ao gerar texto com AI:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Chat com contexto - múltiplas mensagens
   */
  async chatWithContext(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Vertex AI não está disponível.',
        };
      }

      // Se usar proxy, encaminhar para o backend (mantendo o mesmo formato de mensagens)
      if (useBackendProxy) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        // Obter token de acesso usando a mesma chave que api.ts
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          return {
            success: false,
            error: 'Usuário não está autenticado. Faça login primeiro.',
          };
        }

        // Definir headers básicos usando o mesmo padrão do api.ts
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        };

        // Adicionar App Check token apenas em produção
        if (process.env.NODE_ENV === 'production') {
          const appCheckToken = await this.getAppCheckToken();
          if (appCheckToken) {
            headers['X-Firebase-AppCheck'] = appCheckToken;
          }
        }

        const res = await fetch(`${baseUrl}/ai/proxy/chat/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ messages })
        });
        const payload = await res.json();
        return payload as AIResponse;
      }

      // Garantir que a primeira mensagem é do usuário
      if (messages[0]?.role !== 'user') {
        messages = messages.filter(msg => msg.role !== 'system');
        if (messages[0]?.role === 'assistant') {
          messages = messages.slice(1);
        }
      }

      // Converter mensagens para formato do Gemini
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = geminiModel.startChat({
        history: formattedMessages.slice(0, -1), // Todas exceto a última
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const content = response.text();

      return {
        success: true,
        content: content,
        usage: {
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          candidatesTokens: response.usageMetadata?.candidatesTokenCount || 0,
        }
      };
    } catch (error) {
      console.error('Erro no chat com AI:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Assistente especializado para agricultura
   */
  async getAgricultureAdvice(
    query: string,
    context?: {
      crop?: string;
      location?: string;
      weather?: string;
      season?: string;
    }
  ): Promise<AIResponse> {
    const systemPrompt = `Você é um assistente especializado em agricultura e agronegócio, 
    focado em ajudar agricultores em Moçambique. Forneça conselhos práticos, relevantes 
    e baseados em evidências científicas.`;

    let enhancedPrompt = systemPrompt + '\n\n';
    
    if (context) {
      enhancedPrompt += 'Contexto:\n';
      if (context.crop) enhancedPrompt += `- Cultura: ${context.crop}\n`;
      if (context.location) enhancedPrompt += `- Localização: ${context.location}\n`;
      if (context.weather) enhancedPrompt += `- Clima atual: ${context.weather}\n`;
      if (context.season) enhancedPrompt += `- Estação: ${context.season}\n`;
      enhancedPrompt += '\n';
    }

    enhancedPrompt += `Pergunta do agricultor: ${query}`;

    return this.generateText(enhancedPrompt);
  }

  /**
   * Análise de pragas e doenças
   */
  async analyzePestDisease(
    description: string,
    cropType?: string,
    symptoms?: string[]
  ): Promise<AIResponse> {
    let prompt = `Como especialista em fitopatologia e entomologia, analise os seguintes sintomas:

Descrição: ${description}`;

    if (cropType) {
      prompt += `\nCultura afetada: ${cropType}`;
    }

    if (symptoms && symptoms.length > 0) {
      prompt += `\nSintomas observados: ${symptoms.join(', ')}`;
    }

    prompt += `

Por favor, forneça:
1. Possíveis pragas ou doenças
2. Métodos de diagnóstico
3. Tratamentos recomendados
4. Medidas preventivas
5. Quando procurar ajuda profissional`;

    return this.generateText(prompt);
  }

  /**
   * Verificar se o serviço está disponível
   */
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Recarregar configuração do serviço
   */
  reload(): void {
    this.isAvailable = isVertexAIAvailable();
  }
}

// Instância singleton do serviço AI
export const aiService = new AIService();

export default aiService;