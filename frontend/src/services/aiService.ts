// AI Service - Frontend
// Serviço para interação com Firebase Vertex AI no lado cliente

import { geminiModel, isVertexAIAvailable, useBackendProxy } from '../config/firebase';
import { apiService } from './api';

export interface AIResponse {
  success: boolean;
  content?: string;
  content_html?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
  truncated?: boolean;
}

export interface ChatMessage {
  id?: number; // ID da mensagem no backend (opcional para novas mensagens)
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_html?: string;
  timestamp?: Date;
  truncated?: boolean;
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
      if (!prompt || prompt.trim().length === 0) {
        return {
          success: false,
          error: 'Prompt não pode estar vazio.',
        };
      }

      // Prefer backend proxy when enabled (works even if Vertex client SDK isn't initialized)
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

      // Client-side Vertex AI fallback when not using backend proxy
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Vertex AI não está disponível. Verifique a configuração do Firebase.',
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
      // Prefer backend proxy for chat with context
      if (useBackendProxy) {
        const response = await apiService.post<AIResponse>('/ai/proxy/chat/', { messages });
        if (response.error) {
          // Fallback: if unauthorized (401), degrade to single-prompt generateText
          if (response.status === 401) {
            const combined = this.combineMessagesIntoPrompt(messages);
            return this.generateText(combined);
          }
          return { success: false, error: response.error } as AIResponse;
        }
        return response.data || { success: false, error: 'Resposta vazia do servidor' };
      }

      // Client-side fallback only when not using proxy
      if (!this.isAvailable) {
        return {
          success: false,
          error: 'Vertex AI não está disponível.',
        };
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

  private combineMessagesIntoPrompt(messages: ChatMessage[]): string {
    const parts: string[] = [];
    // Include system prompt if present
    const system = messages.find(m => m.role === 'system');
    if (system) {
      parts.push(`Instruções do sistema:\n${system.content}`);
    }
    // Include last ~12 messages for context
    const history = messages.filter(m => m.role !== 'system');
    const selected = history.slice(-12);
    parts.push('Histórico:');
    selected.forEach(m => {
      const who = m.role === 'user' ? 'Usuário' : 'Assistente';
      parts.push(`${who}: ${m.content}`);
    });
    parts.push('\nResponda à última mensagem do Usuário considerando o histórico.');
    return parts.join('\n');
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
   * Análise de pragas (versão simplificada para routing inteligente)
   */
  async analyzePest(query: string): Promise<AIResponse> {
    const systemPrompt = `Você é um especialista em controle de pragas e doenças agrícolas em Moçambique.
    Forneça análises detalhadas, identificação de pragas/doenças, sintomas, tratamentos orgânicos e químicos,
    e medidas preventivas. Seja prático e considere o contexto local de Moçambique.`;

    const enhancedPrompt = `${systemPrompt}\n\nConsulta: ${query}`;
    return this.generateText(enhancedPrompt);
  }

  /**
   * Recomendações de culturas
   */
  async getCropRecommendation(query: string): Promise<AIResponse> {
    const systemPrompt = `Você é um consultor agrícola especializado em recomendações de culturas para Moçambique.
    Considere clima, solo, época do ano, mercado local, e viabilidade econômica ao recomendar culturas.
    Forneça informações sobre calendário de plantio, cuidados necessários, e expectativas de produção.`;

    const enhancedPrompt = `${systemPrompt}\n\nConsulta: ${query}`;
    return this.generateText(enhancedPrompt);
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