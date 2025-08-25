/**
 * Utilitários para validação e manipulação de dados
 */

// Verifica se um array é válido e não está vazio
export function isValidArray<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

// Garante que um valor seja um array, mesmo que seja null/undefined
export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

// Formata uma data para o formato brasileiro
export function formatDateBR(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Data inválida';
  }
}

// Formata uma data para exibição curta (ex: "Seg, 15 Jan")
export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return 'Data inválida';
  }
}

// Trunca um texto para um número máximo de caracteres
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Capitaliza a primeira letra de uma string
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Verifica se uma string é um email válido
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Verifica se uma string é um telefone válido (formato brasileiro)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+258|258)?[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Converte confiança decimal para percentual
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

// Sanitiza entrada de texto removendo caracteres especiais
export function sanitizeText(text: string): string {
  return text.replace(/[<>\"']/g, '');
}

// Gera uma cor baseada no nível de severidade/urgência
export function getSeverityColor(level: string | undefined | null): string {
  if (!level || typeof level !== 'string') {
    return 'text-gray-600 bg-gray-100 border-gray-200';
  }
  
  switch (level.toLowerCase()) {
    case 'baixo':
    case 'baixa':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'moderado':
    case 'media':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'alto':
    case 'alta':
      return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'extremo':
    case 'severo':
    case 'critica':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

// Debounce para otimizar chamadas de função
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
