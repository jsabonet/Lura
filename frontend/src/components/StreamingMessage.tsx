'use client';

import { useStreamingText } from '@/hooks/useStreamingText';
import { useEffect } from 'react';

interface StreamingMessageProps {
  content: string;
  contentHtml?: string;
  isNewMessage?: boolean;
  onStreamComplete?: () => void;
  className?: string;
  baseSpeed?: number; // ms por caractere (5-15ms = instantâneo)
}

/**
 * Componente que renderiza mensagem com efeito de digitação realista
 * Estilo Grok/DeepSeek com variação de velocidade e pausas naturais
 */
export function StreamingMessage({
  content,
  contentHtml,
  isNewMessage = false,
  onStreamComplete,
  className = '',
  baseSpeed = 1, // 1ms por caractere = resposta instantânea
}: StreamingMessageProps) {
  // Para HTML, fazer streaming de forma mais inteligente (não quebrar tags)
  const textToStream = contentHtml || content;
  
  const { displayedText, isStreaming, complete } = useStreamingText({
    text: textToStream,
    baseSpeed: contentHtml ? 6 : baseSpeed, // HTML ainda mais rápido (tags não aparecem)
    enabled: isNewMessage,
    onComplete: onStreamComplete,
  });

  // Clique na mensagem completa streaming imediatamente
  const handleClick = () => {
    if (isStreaming) {
      complete();
    }
  };

  // Se contentHtml, renderizar como HTML com cursor
  if (contentHtml) {
    return (
      <div
        className={`${className} ${isStreaming ? 'cursor-pointer' : ''} relative`}
        onClick={handleClick}
        title={isStreaming ? 'Clique para ver resposta completa' : ''}
      >
        <div dangerouslySetInnerHTML={{ __html: displayedText }} />
        {isStreaming && (
          <span 
            className="inline-block w-0.5 h-5 bg-[#F2C94C] ml-1 animate-typing-cursor align-middle shadow-lg shadow-[#F2C94C]/50"
            style={{ animation: 'blink 1s step-end infinite' }}
          />
        )}
      </div>
    );
  }

  // Caso contrário, renderizar como texto
  return (
    <p
      className={`${className} ${isStreaming ? 'cursor-pointer' : ''} relative`}
      onClick={handleClick}
      title={isStreaming ? 'Clique para ver resposta completa' : ''}
    >
      {displayedText}
      {isStreaming && (
        <span 
          className="inline-block w-0.5 h-5 bg-[#F2C94C] ml-1 animate-typing-cursor align-middle shadow-lg shadow-[#F2C94C]/50"
          style={{ animation: 'blink 1s step-end infinite' }}
        />
      )}
    </p>
  );
}
