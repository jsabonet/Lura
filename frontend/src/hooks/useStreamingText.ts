import { useState, useEffect, useRef } from 'react';

interface UseStreamingTextOptions {
  text: string;
  baseSpeed?: number; // Não usado mais - mantido para compatibilidade
  enabled?: boolean;
  onComplete?: () => void;
}

/**
 * Hook simplificado - mostra texto completo imediatamente (sem efeito de digitação)
 */
export function useStreamingText({ 
  text, 
  baseSpeed = 8, // Não usado mais
  enabled = true,
  onComplete
}: UseStreamingTextOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const hasCalledOnComplete = useRef(false);

  useEffect(() => {
    // Mostrar texto completo imediatamente
    setDisplayedText(text);
    setIsStreaming(false);
    
    // Chamar onComplete apenas uma vez quando o texto mudar
    if (enabled && text && onComplete && !hasCalledOnComplete.current) {
      hasCalledOnComplete.current = true;
      // Usar setTimeout para evitar chamada durante render
      setTimeout(() => {
        onComplete();
      }, 0);
    }
    
    // Reset flag quando texto mudar
    return () => {
      hasCalledOnComplete.current = false;
    };
  }, [text, enabled, onComplete]);

  // Função para completar o streaming imediatamente (não faz nada agora)
  const complete = () => {
    setDisplayedText(text);
    setIsStreaming(false);
  };

  return { displayedText, isStreaming, complete };
}
