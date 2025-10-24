import { useState, useEffect, useRef } from 'react';

interface UseStreamingTextOptions {
  text: string;
  baseSpeed?: number; // ms por caractere (padrão: 5-15ms para instantâneo)
  enabled?: boolean;
  onComplete?: () => void;
}

/**
 * Hook para criar efeito de digitação realista estilo IA
 * Com variação de velocidade e pausas naturais após pontuação
 * Similar ao Grok, DeepSeek e ChatGPT
 */
export function useStreamingText({ 
  text, 
  baseSpeed = 8, // ms por caractere - velocidade instantânea
  enabled = true,
  onComplete
}: UseStreamingTextOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Se não habilitado, mostrar texto completo imediatamente
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsStreaming(false);
      return;
    }

    // Reset quando texto muda
    indexRef.current = 0;
    setDisplayedText('');
    setIsStreaming(true);
    startTimeRef.current = Date.now();

    // Função de digitação caractere por caractere com variação realista
    const typeNextChar = () => {
      if (indexRef.current >= text.length) {
        setIsStreaming(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const currentChar = text[indexRef.current];
      const nextChar = text[indexRef.current + 1];
      
      // Atualizar texto exibido
      indexRef.current += 1;
      setDisplayedText(text.substring(0, indexRef.current));

      // Calcular delay para próximo caractere com variação natural
      let delay = baseSpeed;

      // Variação aleatória de ±20% para parecer mais humano
      const variation = baseSpeed * 0.2;
      delay += (Math.random() * variation * 2) - variation;

      // Pausas naturais após pontuação (reduzidas para respostas rápidas)
      if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        delay += 30; // Pausa mínima de 30ms após pontos finais
      } else if (currentChar === ',' || currentChar === ';' || currentChar === ':') {
        delay += 15; // Pausa mínima de 15ms após vírgulas
      } else if (currentChar === '\n') {
        delay += 20; // Pausa mínima de 20ms após quebras de linha
      } else if (currentChar === ' ' && nextChar === ' ') {
        delay += 10; // Pausa extra mínima entre parágrafos
      }

      // Letras maiúsculas (início de frases) - pausa mínima
      if (currentChar === currentChar.toUpperCase() && /[A-Z]/.test(currentChar)) {
        const prevChar = text[indexRef.current - 2];
        if (prevChar === '.' || prevChar === '\n' || indexRef.current === 1) {
          delay += 5; // Pausa muito sutil no início de frases
        }
      }

      // Agendar próximo caractere
      timerRef.current = setTimeout(typeNextChar, Math.max(delay, 5));
    };

    // Iniciar digitação
    typeNextChar();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, baseSpeed, enabled, onComplete]);

  // Função para completar o streaming imediatamente
  const complete = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(text);
    setIsStreaming(false);
    indexRef.current = text.length;
  };

  return { displayedText, isStreaming, complete };
}
