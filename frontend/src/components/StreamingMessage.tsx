'use client';

import { useStreamingText } from '@/hooks/useStreamingText';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingMessageProps {
  content: string;
  contentHtml?: string;
  isNewMessage?: boolean;
  onStreamComplete?: () => void;
  className?: string;
  baseSpeed?: number; // ms por caractere (5-15ms = instantâneo)
}

/**
 * Componente que renderiza mensagem com formatação Markdown
 * Suporta: negrito, itálico, listas, links, código, etc.
 */
export function StreamingMessage({
  content,
  contentHtml,
  isNewMessage = false,
  onStreamComplete,
  className = '',
  baseSpeed = 1,
}: StreamingMessageProps) {
  // Se houver HTML pré-formatado, usar ele
  const textToStream = contentHtml || content;
  
  const { displayedText, isStreaming, complete } = useStreamingText({
    text: textToStream,
    baseSpeed: contentHtml ? 6 : baseSpeed,
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
        className={`${className} ${isStreaming ? 'cursor-pointer' : ''} relative prose prose-invert max-w-none`}
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

  // Renderizar como Markdown com formatação adequada
  return (
    <div
      className={`${className} ${isStreaming ? 'cursor-pointer' : ''} relative markdown-content`}
      onClick={handleClick}
      title={isStreaming ? 'Clique para ver resposta completa' : ''}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Parágrafos
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-white" {...props} />,
          
          // Títulos
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4 text-[#F2C94C]" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-4 text-[#00A86B]" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2 mt-3 text-[#3BB273]" {...props} />,
          
          // Listas
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-white" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-white" {...props} />,
          li: ({ node, ...props }) => <li className="ml-2 text-white" {...props} />,
          
          // Negrito e itálico
          strong: ({ node, ...props }) => <strong className="font-bold text-[#F2C94C]" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-[#C2B280]" {...props} />,
          
          // Links
          a: ({ node, ...props }) => (
            <a 
              className="text-[#00A86B] hover:text-[#3BB273] underline transition-colors duration-200" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          
          // Código inline
          code: ({ node, inline, ...props }: any) => 
            inline ? (
              <code className="bg-[#1B2735] text-[#F2C94C] px-1.5 py-0.5 rounded text-sm font-mono border border-[#00A86B]/20" {...props} />
            ) : (
              <code className="block bg-[#1B2735] text-[#F2C94C] p-3 rounded-lg text-sm font-mono overflow-x-auto border border-[#00A86B]/20 mb-3" {...props} />
            ),
          
          // Bloco de código
          pre: ({ node, ...props }) => (
            <pre className="bg-[#0F2027] p-4 rounded-lg overflow-x-auto mb-3 border border-[#00A86B]/30 shadow-lg" {...props} />
          ),
          
          // Citações
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-[#00A86B] pl-4 italic text-[#C2B280] my-3" {...props} />
          ),
          
          // Linha horizontal
          hr: ({ node, ...props }) => <hr className="my-4 border-t border-[#00A86B]/30" {...props} />,
          
          // Tabelas
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4 rounded-lg border border-[#00A86B]/30 shadow-lg">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gradient-to-r from-[#00A86B]/30 to-[#3BB273]/20" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="bg-[#1B2735]/30" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-[#00A86B]/20 hover:bg-[#00A86B]/10 transition-colors duration-200" {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 text-left font-bold text-white border-r border-[#00A86B]/20 last:border-r-0" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-white border-r border-[#00A86B]/10 last:border-r-0" {...props} />
          ),
        }}
      >
        {displayedText}
      </ReactMarkdown>
      {isStreaming && (
        <span 
          className="inline-block w-0.5 h-5 bg-[#F2C94C] ml-1 animate-typing-cursor align-middle shadow-lg shadow-[#F2C94C]/50"
          style={{ animation: 'blink 1s step-end infinite' }}
        />
      )}
    </div>
  );
}
