'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Bot, Send, Plus, Menu, X, Trash2, Loader2, Sparkles, AlertCircle,
  MessageSquare, ChevronLeft, ChevronRight, Image as ImageIcon, Copy,
  RotateCcw, User, CheckCheck, ArrowDown
} from 'lucide-react';
import { aiService, AIResponse, ChatMessage } from '../../services/aiService';
import { useAuth } from '@/contexts/AuthContext';
import { StreamingMessage } from '@/components/StreamingMessage';

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatbotPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState<number>(8); // ms por caractere - Instantâneo (5-15ms)
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Load conversations from localStorage on mount
  useEffect(() => {
    // Require authentication
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    console.log('🎬 [INIT] Componente montado, carregando conversas...');
    // Carregar conversas do backend ao invés de localStorage
    loadConversationsFromBackend();
    
    // Open sidebar by default on desktop widths
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, [authLoading, isAuthenticated, router]);

  // REMOVIDO: Não salvar mais no localStorage - agora tudo vem do backend
  // useEffect(() => {
  //   if (conversations.length > 0) {
  //     localStorage.setItem('agroalerta_conversations', JSON.stringify(conversations));
  //   }
  // }, [conversations]);

  // Save active conversation ID
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('agroalerta_active_conversation', activeConversationId);
    }
  }, [activeConversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detectar scroll para mostrar/esconder botão "scroll to bottom"
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Mostrar botão se usuário scrollou mais de 200px para cima
      setShowScrollButton(distanceFromBottom > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ========== FUNÇÕES DE SINCRONIZAÇÃO COM BACKEND ==========
  
  /**
   * Garante que exista uma conversa ativa válida no backend.
   * Se o ID atual for local (ex: 'conv_...') ou inexistente, cria uma nova no backend.
   * Retorna o ID (string) da conversa válida no backend.
   */
  const ensureBackendConversation = async (): Promise<string | null> => {
    // Se já temos uma conversa ativa e ela parece numérica, considera válida
    if (activeConversationId && /^\d+$/.test(activeConversationId)) {
      return activeConversationId;
    }

    // Tentar encontrar alguma conversa carregada do backend
    const backendConv = conversations.find(c => /^\d+$/.test(c.id));
    if (backendConv) {
      setActiveConversationId(backendConv.id);
      setMessages(backendConv.messages);
      return backendConv.id;
    }

    // Criar nova no backend
    await createNewConversationInBackend();
    // Após criar, o estado é atualizado; aguardar o próximo tick e retornar o novo ID
    return new Promise(resolve => {
      setTimeout(() => {
        const created = conversations.find(c => /^\d+$/.test(c.id));
        resolve(created ? created.id : null);
      }, 50);
    });
  };
  
  /**
   * Carrega conversas do backend
   */
  const loadConversationsFromBackend = async () => {
    console.log('🔄 [LOAD] Iniciando carregamento de conversas...');
    try {
  const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('⚠️  [LOAD] Sem token, pulando carregamento do backend');
        return;
      }

      console.log('📡 [LOAD] Fazendo requisição GET /ai/conversations/');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(`📊 [LOAD] Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Erro ao carregar conversas: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(`📊 [LOAD] Tipo de resposta:`, typeof responseData, Array.isArray(responseData));
      
      // Backend retorna formato paginado: { count, results }
      let backendConversations = responseData;
      if (responseData && typeof responseData === 'object' && 'results' in responseData) {
        backendConversations = responseData.results;
        console.log(`📊 [LOAD] Resposta paginada detectada. Total: ${responseData.count}`);
      }
      
      console.log(`✅ [LOAD] Recebidas ${backendConversations.length} conversas do backend`);
      
      // Converter formato backend para formato frontend
      const formattedConversations: Conversation[] = backendConversations.map((conv: any) => ({
        id: conv.id.toString(),
        title: conv.title || 'Nova Conversa',
        messages: conv.messages?.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          content_html: msg.metadata?.content_html,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        })) || [],
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at)
      }));

      console.log(`💾 [LOAD] Conversas formatadas:`, formattedConversations.map(c => ({id: c.id, title: c.title, msgs: c.messages.length})));
      setConversations(formattedConversations);
      
      // Carregar última conversa ativa ou criar nova
      if (formattedConversations.length > 0) {
        const lastId = localStorage.getItem('agroalerta_active_conversation');
        const activeConv = formattedConversations.find(c => c.id === lastId) || formattedConversations[0];
        console.log(`🎯 [LOAD] Ativando conversa: ${activeConv.id}`);
        setActiveConversationId(activeConv.id);
        setMessages(activeConv.messages);
      } else {
        // Se não houver conversas, criar uma nova
        console.log('➕ [LOAD] Nenhuma conversa existente, criando nova...');
        await createNewConversationInBackend();
      }
    } catch (error) {
      console.error('❌ [LOAD] Erro ao carregar conversas:', error);
      // Fallback: criar nova conversa local
      createNewConversationLocal();
    }
  };

  /**
   * Cria nova conversa no backend
   */
  const createNewConversationInBackend = async () => {
    console.log('➕ [CREATE] Criando nova conversa...');
    try {
  const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('⚠️  [CREATE] Sem token, criando conversa local');
        // Criar conversa local sem backend
        createNewConversationLocal();
        return;
      }

      console.log('📡 [CREATE] POST /ai/conversations/');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Nova Conversa',
          conversation_type: 'general'
        })
      });

      console.log(`📊 [CREATE] Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [CREATE] Erro: ${response.status} - ${errorText}`);
        throw new Error('Erro ao criar conversa');
      }

      const newConv = await response.json();
      console.log(`✅ [CREATE] Conversa criada: ID ${newConv.id}`);
      
      const formattedConv: Conversation = {
        id: newConv.id.toString(),
        title: newConv.title,
        messages: [],
        createdAt: new Date(newConv.created_at),
        updatedAt: new Date(newConv.updated_at)
      };

      setConversations(prev => [formattedConv, ...prev]);
      setActiveConversationId(formattedConv.id);
      setMessages([]);
      setInputValue('');
      setUploadedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('❌ [CREATE] Erro ao criar conversa no backend:', error);
      // Fallback: criar conversa local
      createNewConversationLocal();
    }
  };

  /**
   * Cria nova conversa localmente (fallback quando backend não está disponível)
   */
  const createNewConversationLocal = () => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([]);
    setInputValue('');
    setUploadedImage(null);
    setImagePreview(null);
  };

  /**
   * Salva mensagem no backend
   */
  const saveMessageToBackend = async (conversationId: string, role: string, content: string, contentHtml?: string) => {
    console.log(`💾 [SAVE] Salvando mensagem ${role} na conversa ${conversationId}...`);
    console.log(`📝 [SAVE] Conteúdo: ${content.substring(0, 50)}...`);
    try {
  const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('⚠️  [SAVE] Sem token, não salvando no backend');
        return null;
      }

      console.log(`📡 [SAVE] POST /ai/conversations/${conversationId}/add_message/`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/${conversationId}/add_message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          content,
          metadata: contentHtml ? { content_html: contentHtml } : {}
        })
      });

      console.log(`📊 [SAVE] Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [SAVE] Erro: ${response.status} - ${errorText}`);
        throw new Error('Erro ao salvar mensagem');
      }

      const savedMessage = await response.json();
      console.log(`✅ [SAVE] Mensagem salva: ID ${savedMessage.id}`);
      return savedMessage.id; // Retorna o ID da mensagem salva
    } catch (error) {
      console.error('❌ [SAVE] Erro ao salvar mensagem no backend:', error);
      return null;
    }
  };

  /**
   * Deleta conversa no backend
   */
  const deleteConversationFromBackend = async (conversationId: string) => {
    try {
  const token = localStorage.getItem('access_token');
      if (!token) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/${conversationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erro ao deletar conversa no backend:', error);
    }
  };

  /**
   * Atualiza título da conversa no backend
   */
  const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
  const token = localStorage.getItem('access_token');
      if (!token) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/conversations/${conversationId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  };

  // ========== FIM FUNÇÕES DE SINCRONIZAÇÃO ==========

  // Funções de edição de mensagens
  const handleEditMessage = (index: number, content: string) => {
    setEditingMessageIndex(index);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageIndex(null);
    setEditedContent('');
  };

  const handleSaveEdit = async (index: number) => {
    if (!editedContent.trim()) {
      handleCancelEdit();
      return;
    }

    const updatedMessages = [...messages];
    updatedMessages[index] = {
      ...updatedMessages[index],
      content: editedContent,
    };

    setMessages(updatedMessages);
    
    // Se tiver conversa ativa, salvar no backend (somente se a mensagem tiver um id)
    if (activeConversation) {
      try {
  const token = localStorage.getItem('access_token');
        const messageId = (updatedMessages[index] as any)?.id;
        if (messageId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/messages/${messageId}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              content: editedContent
            })
          });
        } else {
          // Mensagem local sem id - não há o que atualizar no backend
          console.warn('Mensagem editada não possui id; atualização no backend ignorada.');
        }
      } catch (error) {
        console.error('Erro ao salvar edição:', error);
      }
    }

    handleCancelEdit();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    }
    if (isRightSwipe && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const createNewConversation = () => {
    // Tentar criar no backend primeiro
    createNewConversationInBackend();
  };

  const deleteConversation = async (convId: string) => {
    // Deletar do backend
    await deleteConversationFromBackend(convId);
    
    // Deletar do estado local
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConversationId === convId) {
      const remaining = conversations.filter(c => c.id !== convId);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
        setMessages(remaining[0].messages);
      } else {
        createNewConversation();
      }
    }
  };

  const switchConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConversationId(conv.id);
      setMessages(conv.messages);
      setError(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para chat com streaming SSE (Server-Sent Events)
  const handleSubmitWithStreaming = async (e: React.FormEvent | null, promptOverride?: string) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      setError('Faça login para usar o chat');
      router.push('/login');
      return;
    }
    
    const sourceInput = promptOverride ?? inputValue;
    const trimmedInput = sourceInput.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

  // Garante conversa válida no backend antes de salvar
  const ensuredConversationId = await ensureBackendConversation();
  console.log(`🚀 [SUBMIT] Enviando mensagem na conversa ${ensuredConversationId || activeConversationId}`);
    
    // Salvar mensagem do usuário no backend
    if (ensuredConversationId) {
      console.log(`💾 [SUBMIT] Salvando mensagem do usuário...`);
      const savedMessageId = await saveMessageToBackend(ensuredConversationId, 'user', trimmedInput);
      if (savedMessageId) {
        console.log(`✅ [SUBMIT] Mensagem do usuário salva com ID ${savedMessageId}`);
        userMessage.id = savedMessageId;
      } else {
        console.warn('⚠️  [SUBMIT] Falha ao salvar mensagem do usuário');
      }
    } else {
      console.warn('⚠️  [SUBMIT] Nenhuma conversa ativa para salvar mensagem');
    }

    // Adicionar mensagem placeholder da IA
    const aiMessageIndex = newMessages.length;
    const aiPlaceholder: ChatMessage = {
      role: 'assistant',
      content: '',
      content_html: '',
      timestamp: new Date()
    };
    setMessages([...newMessages, aiPlaceholder]);

    try {
      // Preparar mensagens para o chat
      // IMPORTANTE: Enviar histórico COMPLETO incluindo a mensagem atual do usuário
      // O backend espera receber o histórico completo com todas as mensagens
      const historyForChat = newMessages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      // Fazer requisição SSE
  const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/proxy/chat/stream/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: historyForChat
        }),
        // IMPORTANTE: Não definir timeout muito curto para streams longos
        signal: AbortSignal.timeout(120000) // 120 segundos (2 minutos)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Ler stream SSE
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let finalHtml = '';
      let isDone = false;
      let streamSuccessful = false;

      if (reader) {
        while (!isDone) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('📡 [STREAM] Reader done');
            break;
          }

          // Decodificar chunk
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'content') {
                  // Atualizar texto acumulado
                  accumulatedText += parsed.text;
                  
                  // Atualizar mensagem em tempo real
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[aiMessageIndex] = {
                      ...updated[aiMessageIndex],
                      content: accumulatedText,
                      content_html: '' // Será definido quando terminar
                    };
                    return updated;
                  });
                } else if (parsed.type === 'done') {
                  isDone = true;
                  streamSuccessful = true;
                  // Usar total_text se disponível, caso contrário manter o acumulado
                  if (parsed.total_text && parsed.total_text.length > 0) {
                    accumulatedText = parsed.total_text;
                  }
                  finalHtml = parsed.content_html || '';
                  
                  console.log(`✅ [STREAM] Completado: ${accumulatedText.length} caracteres`);
                  console.log(`📝 [STREAM] HTML: ${finalHtml.length} caracteres`);
                  
                  // Atualizar mensagem final
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[aiMessageIndex] = {
                      ...updated[aiMessageIndex],
                      content: accumulatedText,
                      content_html: finalHtml
                    };
                    return updated;
                  });
                } else if (parsed.type === 'error') {
                  throw new Error(parsed.error || 'Erro no streaming');
                }
              } catch (parseError) {
                console.error('❌ [STREAM] Erro ao parsear SSE:', parseError, 'Line:', line);
              }
            }
          }
        }
      }

      // Salvar apenas se o stream foi completado com sucesso
      if (!streamSuccessful) {
        throw new Error('Stream incompleto ou não recebeu sinal de done');
      }

      // Atualizar conversa
      if (ensuredConversationId) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: accumulatedText,
          content_html: finalHtml,
          timestamp: new Date()
        };

        console.log(`💾 [SUBMIT] Salvando resposta da IA (${accumulatedText.length} caracteres)...`);
        // Salvar mensagem da IA no backend
        const savedAiMessageId = await saveMessageToBackend(
          ensuredConversationId, 
          'assistant', 
          accumulatedText, 
          finalHtml
        );
        if (savedAiMessageId) {
          console.log(`✅ [SUBMIT] Resposta da IA salva com ID ${savedAiMessageId}`);
          aiMessage.id = savedAiMessageId;
        } else {
          console.warn('⚠️  [SUBMIT] Falha ao salvar resposta da IA');
        }

        setConversations(prev => prev.map(c => {
          if (c.id === ensuredConversationId) {
            const title = c.title === 'Nova Conversa' && trimmedInput 
              ? trimmedInput.slice(0, 50) + (trimmedInput.length > 50 ? '...' : '')
              : c.title;
            
            // Atualizar título no backend se mudou
            if (title !== c.title) {
              updateConversationTitle(ensuredConversationId, title);
            }

            return {
              ...c,
              title,
              messages: [...newMessages, aiMessage],
              updatedAt: new Date()
            };
          }
          return c;
        }));
      }

    } catch (err: any) {
      console.error('Erro no streaming:', err);
      setError(err.message || 'Erro ao processar resposta');
      // Remover placeholder em caso de erro
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | null, promptOverride?: string) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      setError('Faça login para usar o chat');
      router.push('/login');
      return;
    }
    
    const sourceInput = promptOverride ?? inputValue;
    const trimmedInput = sourceInput.trim();
    if ((!trimmedInput && !uploadedImage) || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedInput || '[Imagem enviada]',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Handle image context (only when not using quick prompt override)
    let fullPrompt = trimmedInput;
    if (!promptOverride && uploadedImage) {
      fullPrompt += `\n\n[Imagem anexada: ${uploadedImage.name} - Por favor, analise esta imagem considerando pragas, doenças ou problemas agrícolas visíveis]`;
    }
    const enrichedUserMessage: ChatMessage = { ...userMessage, content: fullPrompt };
    if (!promptOverride && uploadedImage) {
      removeImage();
    }

    try {
      // Intelligent routing + contextual chat (use backend /ai/proxy/chat/)
      type Category = 'pest' | 'crop' | 'general';
      let category: Category = 'general';
      if (fullPrompt.match(/praga|doença|inseto|fungo|bactéria|vírus|lagarta|pulgão|mosca|cochonilha|ferrugem|míldio|podridão|mancha|murcha|amarelecimento|sintoma|tratamento/i)) {
        category = 'pest';
      } else if (fullPrompt.match(/recomendar|sugerir|melhor cultura|o que plantar|qual cultura|época de plantio|calendário|safra/i)) {
        category = 'crop';
      }

      const systemPrompts: Record<Category, string> = {
        pest: `Você é a Lura, uma especialista em controle de pragas e doenças agrícolas em Moçambique. Seu nome é Lura e você é uma assistente agrícola dedicada. Forneça identificação provável, diagnóstico, tratamentos (orgânicos e químicos), e prevenção. Seja prática e considere o contexto local. Quando apropriado, mencione que você é a Lura e está aqui para ajudar.`,
        crop: `Você é a Lura, uma consultora agrícola especializada em recomendações de culturas para Moçambique. Seu nome é Lura e você é uma assistente agrícola experiente. Considere clima, solo, estação, mercado e viabilidade. Inclua calendário de plantio, cuidados e expectativas de produção. Quando apropriado, apresente-se como Lura.`,
        general: `Você é a Lura, uma assistente agrícola especializada em Moçambique. Seu nome é Lura e você está aqui para ajudar agricultores com orientações práticas, claras e baseadas em boas práticas locais. Quando cumprimentada ou perguntada sobre seu nome, apresente-se como Lura. Seja amigável e profissional.`
      };

      const historyForChat: ChatMessage[] = messages.slice(-12).map(m => ({ role: m.role, content: m.content }));
      const chatPayload: ChatMessage[] = [
        { role: 'system', content: systemPrompts[category] },
        ...historyForChat,
        enrichedUserMessage,
      ];

      const response = await aiService.chatWithContext(chatPayload);

      if (response.success && (response.content || response.content_html)) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.content || '',
          content_html: response.content_html,
          timestamp: new Date(),
          truncated: !!response.truncated
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        
        // Salvar resposta regenerada da IA no backend também
        try {
          const ensuredConversationId = await ensureBackendConversation();
          if (ensuredConversationId) {
            const savedAiMessageId = await saveMessageToBackend(
              ensuredConversationId,
              'assistant',
              aiMessage.content || '',
              aiMessage.content_html
            );
            if (savedAiMessageId) {
              aiMessage.id = savedAiMessageId;
            }
          }
        } catch (e) {
          console.warn('⚠️  Falha ao salvar resposta regenerada no backend', e);
        }
        
        // Ativar streaming para a última mensagem
        setStreamingMessageIndex(updatedMessages.length - 1);

        // Update conversation
        if (activeConversationId) {
          setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
              // Auto-title from first user message
              const title = c.title === 'Nova Conversa' && trimmedInput 
                ? trimmedInput.slice(0, 50) + (trimmedInput.length > 50 ? '...' : '')
                : c.title;
              return {
                ...c,
                title,
                messages: updatedMessages,
                updatedAt: new Date()
              };
            }
            return c;
          }));
        }

  // Auto-continuation if truncated (fallback to generateText)
        if (response.truncated) {
          const maxRetries = 2;
          let retries = 0;
          let accumulated = response.content || '';
          
          while (retries < maxRetries && response.truncated) {
            retries++;
            setIsLoading(true);
            try {
              const contPrompt = `Continue a resposta anterior:\n\n${accumulated}\n\nContinue:`;
              const contResp = await aiService.generateText(contPrompt);
              
              if (contResp.success && contResp.content) {
                accumulated += '\n\n' + contResp.content;
                
                setMessages(prev => {
                  const copy = [...prev];
                  const lastIdx = copy.length - 1;
                  if (copy[lastIdx].role === 'assistant') {
                    copy[lastIdx] = {
                      ...copy[lastIdx],
                      content: accumulated,
                      content_html: contResp.content_html || copy[lastIdx].content_html,
                      truncated: !!contResp.truncated
                    };
                  }
                  return copy;
                });
                
                if (!contResp.truncated) break;
              } else {
                break;
              }
            } catch (err) {
              console.warn('Continuation failed', err);
              break;
            }
          }
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

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const stripTags = (html: string): string => {
    if (typeof window !== 'undefined') {
      const el = document.createElement('div');
      el.innerHTML = html;
      return el.textContent || el.innerText || '';
    }
    // Fallback for non-DOM environments
    return html.replace(/<[^>]*>/g, '');
  };

  const getCopyText = (m: ChatMessage): string => {
    if (m.content && m.content.trim().length > 0) return m.content;
    if (m.content_html) return stripTags(m.content_html);
    return '';
  };

  const regenerateResponse = async (messageIndex: number) => {
    if (isLoading || messageIndex < 1) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Remove AI response and regenerate
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      // Intelligent routing + contextual chat on regenerate
      type Category = 'pest' | 'crop' | 'general';
      let category: Category = 'general';
      const prompt = userMessage.content;
      if (prompt.match(/praga|doença|inseto|fungo|bactéria|vírus|lagarta|pulgão|mosca|cochonilha|ferrugem|míldio|podridão|mancha|murcha|amarelecimento|sintoma|tratamento/i)) {
        category = 'pest';
      } else if (prompt.match(/recomendar|sugerir|melhor cultura|o que plantar|qual cultura|época de plantio|calendário|safra/i)) {
        category = 'crop';
      }

      const systemPrompts: Record<Category, string> = {
        pest: `Você é a Lura, uma especialista em controle de pragas e doenças agrícolas em Moçambique. Seu nome é Lura e você é uma assistente agrícola dedicada. Forneça identificação provável, diagnóstico, tratamentos (orgânicos e químicos), e prevenção. Seja prática e considere o contexto local. Quando apropriado, mencione que você é a Lura e está aqui para ajudar.`,
        crop: `Você é a Lura, uma consultora agrícola especializada em recomendações de culturas para Moçambique. Seu nome é Lura e você é uma assistente agrícola experiente. Considere clima, solo, estação, mercado e viabilidade. Inclua calendário de plantio, cuidados e expectativas de produção. Quando apropriado, apresente-se como Lura.`,
        general: `Você é a Lura, uma assistente agrícola especializada em Moçambique. Seu nome é Lura e você está aqui para ajudar agricultores com orientações práticas, claras e baseadas em boas práticas locais. Quando cumprimentada ou perguntada sobre seu nome, apresente-se como Lura. Seja amigável e profissional.`
      };

      const historyForChat: ChatMessage[] = newMessages.slice(-12).map(m => ({ role: m.role, content: m.content }));
      const chatPayload: ChatMessage[] = [
        { role: 'system', content: systemPrompts[category] },
        ...historyForChat,
      ];

      const response = await aiService.chatWithContext(chatPayload);

      if (response.success && (response.content || response.content_html)) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.content || '',
          content_html: response.content_html,
          timestamp: new Date(),
          truncated: !!response.truncated
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        
        // Ativar streaming para a mensagem regenerada
        setStreamingMessageIndex(updatedMessages.length - 1);

        // Update conversation
        if (activeConversationId) {
          setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
              return {
                ...c,
                messages: updatedMessages,
                updatedAt: new Date()
              };
            }
            return c;
          }));
        }
      } else {
        setError(response.error || 'Erro ao regenerar resposta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-screen bg-white md:bg-gradient-to-br md:from-gray-50 md:via-white md:to-green-50/30 overflow-hidden relative">
      {/* Mobile Backdrop - Only blocks area behind sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transition-all duration-300 ease-in-out
          bg-gray-950 text-white flex flex-col overflow-hidden 
          border-r border-gray-800 shadow-2xl md:shadow-none
          ${sidebarOpen ? 'translate-x-0 w-80 md:w-64' : '-translate-x-full md:translate-x-0 md:w-0'}
        `}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="p-3 md:p-4 border-b border-gray-800/50">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="LuraFarm Logo"
                width={24}
                height={24}
                className="w-6 h-6 md:w-5 md:h-5"
              />
              <span className="font-bold text-white text-base md:text-sm">LuraFarm</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="w-5 h-5 md:w-4 md:h-4" />
            <span className="font-medium text-base md:text-sm">Nova Conversa</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent overscroll-contain">
          <div className="text-xs font-semibold text-gray-400 px-3 py-2 mb-1 md:text-[11px]">Histórico</div>
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => {
                switchConversation(conv.id);
                // Auto-close sidebar on mobile after selection
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full text-left px-3 py-3 md:py-2.5 rounded-xl mb-1.5 md:mb-1 transition-all group relative overflow-hidden active:scale-95 cursor-pointer ${
                conv.id === activeConversationId
                  ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 text-white shadow-md'
                  : 'hover:bg-gray-900/50 text-gray-300 hover:text-white active:bg-gray-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 md:w-3.5 md:h-3.5 flex-shrink-0 text-green-500" />
                    <span className="text-sm md:text-[13px] font-medium truncate">{conv.title}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(conv.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all active:scale-90"
                  title="Eliminar conversa"
                >
                  <Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                </button>
              </div>
              {conv.id === activeConversationId && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        <div className="p-3 md:p-4 border-t border-gray-800/50 text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center p-1">
              <Image
                src="/logo.png"
                alt="LuraFarm Logo"
                width={24}
                height={24}
                className="w-full h-full"
              />
            </div>
            <div>
              <p className="font-medium text-gray-400 text-sm md:text-xs">LuraFarm</p>
              <p className="text-gray-600 text-xs md:text-[11px]">Assistente Lura</p>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] md:text-[10px]">© 2025 Todos os direitos reservados</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col backdrop-blur-sm relative z-10">
        {/* Header */}
        <header className="bg-white/95 md:bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-3 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {/* <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 md:w-5 md:h-5 text-gray-700" />
            </button> */}
            
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="p-1.5 md:p-2 bg-white rounded-xl shadow-md md:shadow-lg border-2 border-green-200">
                  <Image
                    src="/logo.png"
                    alt="LuraFarm Logo"
                    width={32}
                    height={32}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-gray-900 text-sm md:text-lg truncate">
                  {activeConversation?.title || 'Lura'}
                </h1>
                <p className="text-[10px] md:text-xs text-green-600 font-medium flex items-center gap-1 truncate">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                  <span className="truncate">Online</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3 py-4 md:px-4 md:py-6 overscroll-contain relative">
          {/* Botão Scroll to Bottom */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-40 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 group"
              title="Ir para mensagem mais recente"
            >
              <ArrowDown className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
            </button>
          )}

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="text-center py-8 md:py-12 px-4 max-w-2xl">
                  <div className="inline-flex p-4 md:p-5 bg-white rounded-3xl shadow-xl mb-6 border-2 border-green-200">
                    <Image
                      src="/logo.png"
                      alt="LuraFarm Logo"
                      width={64}
                      height={64}
                      className="w-12 h-12 md:w-16 md:h-16"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Olá! Sou a Lura 👋
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                    Sua assistente agrícola inteligente. Posso ajudar com técnicas de cultivo, 
                    análise de pragas, recomendações de culturas, gestão de água e muito mais!
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
                    {[
                      { icon: '🌱', text: 'Cultivo', color: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200', prompt: 'Como plantar milho?' },
                      { icon: '🐛', text: 'Pragas', color: 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200', prompt: 'Pragas no tomate' },
                      { icon: '💧', text: 'Irrigação', color: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200', prompt: 'Irrigação eficiente' },
                      { icon: '🌾', text: 'Culturas', color: 'from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200', prompt: 'Melhor época para plantar' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSubmitWithStreaming(null, item.prompt)}
                        className={`p-4 bg-gradient-to-br ${item.color} rounded-2xl transition-all border border-gray-200 shadow-sm active:scale-95 cursor-pointer`}
                      >
                        <div className="text-3xl md:text-4xl mb-2">{item.icon}</div>
                        <div className="text-xs md:text-sm font-semibold text-gray-700">
                          {item.text}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">Exemplos do que você pode perguntar:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        'Como plantar milho?',
                        'Pragas no tomate',
                        'Melhor época para plantar',
                        'Irrigação eficiente'
                      ].map((example, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSubmitWithStreaming(null, example)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all active:scale-95 shadow-sm"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 md:gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-200 p-1">
                      <Image
                        src="/logo.png"
                        alt="Lura"
                        width={24}
                        height={24}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className={`${message.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-full md:max-w-3xl`}>
                    <div className={`rounded-2xl md:rounded-3xl px-3 py-3 md:px-5 md:py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg user-message'
                        : 'bg-white md:bg-gray-50 border border-gray-200 text-gray-900 shadow-sm'
                    }`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <span className="text-[11px] md:text-xs font-semibold text-green-600">Lura</span>
                          <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-[10px] md:text-xs text-gray-400">{formatTime(message.timestamp!)}</span>
                        </div>
                      )}
                      
                      {/* Modo de Edição */}
                      {editingMessageIndex === index ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-sm text-gray-900"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              Salvar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {message.role === 'assistant' && index === streamingMessageIndex ? (
                            <StreamingMessage
                              content={message.content}
                              contentHtml={message.content_html}
                              isNewMessage={true}
                              onStreamComplete={() => setStreamingMessageIndex(null)}
                              className="ai-message-content text-sm md:text-[15px]"
                              baseSpeed={typingSpeed}
                            />
                          ) : message.content_html ? (
                            <div 
                              className="ai-message-content text-sm md:text-[15px]"
                              dangerouslySetInnerHTML={{ __html: message.content_html }}
                            />
                          ) : (
                            <p className="text-sm md:text-[15px] leading-6 md:leading-7 whitespace-pre-wrap">{message.content}</p>
                          )}
                        </>
                      )}

                      {message.truncated && (
                        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-yellow-200 text-xs text-yellow-700 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Completando...</span>
                        </div>
                      )}
                      
                      {message.role === 'user' && message.timestamp && (
                        <div className="text-[10px] md:text-xs mt-1.5 md:mt-2 text-green-100 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!message.truncated && editingMessageIndex !== index && (
                      <div className="flex items-center gap-1 md:gap-2 mt-1.5 md:mt-2 ml-1 md:ml-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Botão Editar - SOMENTE para mensagens do usuário */}
                        {message.role === 'user' && (
                          <button
                            onClick={() => handleEditMessage(index, message.content)}
                            className="p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                            title="Editar"
                          >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        
                        {message.role === 'assistant' && (
                          <>
                            <button
                              onClick={() => copyToClipboard(getCopyText(message), index)}
                              className="p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                              title="Copiar"
                            >
                              {copiedIndex === index ? (
                                <CheckCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => regenerateResponse(index)}
                              disabled={isLoading}
                              className="p-1.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700 disabled:opacity-50"
                              title="Regenerar"
                            >
                              <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 md:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-200 p-1">
                    <Image
                      src="/logo.png"
                      alt="Lura"
                      width={24}
                      height={24}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white md:bg-gray-50 border border-gray-200 rounded-2xl md:rounded-3xl px-3 py-3 md:px-5 md:py-4 shadow-sm max-w-full md:max-w-3xl">
                    <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                      <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-green-600" />
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center px-2">
                <div className="bg-red-50 border border-red-200 rounded-xl md:rounded-2xl px-4 py-2.5 md:px-5 md:py-3 shadow-sm w-full md:w-auto">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium">{error}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed bottom on mobile */}
        <div className="border-t border-gray-200/50 bg-white md:bg-white/80 backdrop-blur-xl p-2 md:p-4 sticky bottom-0 z-20">
          <div className="max-w-4xl mx-auto">
            {imagePreview && (
              <div className="mb-2 md:mb-3 px-1">
                <div className="relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-xl border-2 border-gray-300 shadow-md"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 md:-top-2 md:-right-2 p-1 md:p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-700 shadow-lg"
                  >
                    <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmitWithStreaming} className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div className="flex items-end gap-1 md:gap-2 bg-white border-2 md:border border-gray-300 rounded-3xl shadow-lg md:hover:shadow-xl transition-shadow p-1.5 md:p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-2 md:p-2.5 text-gray-600 hover:text-green-600 active:bg-green-50 rounded-xl transition-all disabled:opacity-50"
                  title="Anexar imagem"
                >
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitWithStreaming(e);
                    }
                  }}
                  placeholder="Mensagem para Lura..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 px-1 md:px-2 py-2 md:py-2.5 bg-transparent focus:outline-none disabled:opacity-50 resize-none text-sm md:text-[15px] max-h-28 md:max-h-32 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                />

                <button
                  type="submit"
                  disabled={(!inputValue.trim() && !uploadedImage) || isLoading}
                  className="p-2 md:p-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </form>

            <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-gray-500 text-center px-2">
              A Lura pode cometer erros. Consulte um especialista.
            </div>
          </div>
        </div>

        {/* Floating New Chat Button (Mobile Only) */}
        {messages.length > 0 && (
          <button
            onClick={createNewConversation}
            className="md:hidden fixed bottom-20 right-4 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl active:scale-95 transition-all z-30"
            title="Nova conversa"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </main>
    </div>
  );
}