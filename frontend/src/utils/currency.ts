// Configurações de moeda para Moçambique
export const CURRENCY_CONFIG = {
  code: 'MZN',
  symbol: 'MT',
  name: 'Metical Moçambicano',
  decimal_places: 2,
  thousand_separator: '.',
  decimal_separator: ',',
};

// Função para formatar valores em Metical
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Função alternativa para formatação personalizada
export function formatMetical(value: number, showSymbol: boolean = true): string {
  const formatted = value.toLocaleString('pt-MZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return showSymbol ? `${formatted} MT` : formatted;
}

// Preços de referência em Metical para culturas (por kg)
export const CROP_PRICES_MZN = {
  'milho': { min: 25, max: 35, average: 30 },
  'arroz': { min: 45, max: 60, average: 52 },
  'feijao': { min: 80, max: 120, average: 100 },
  'soja': { min: 35, max: 45, average: 40 },
  'tomate': { min: 15, max: 25, average: 20 },
  'cebola': { min: 20, max: 30, average: 25 },
  'alface': { min: 10, max: 18, average: 14 },
  'manga': { min: 12, max: 20, average: 16 },
  'banana': { min: 8, max: 15, average: 12 },
  'mandioca': { min: 8, max: 12, average: 10 },
  'batata_doce': { min: 15, max: 22, average: 18 },
  'cana_acucar': { min: 5, max: 8, average: 6.5 },
};

// Função para obter preço de uma cultura
export function getCropPrice(cropId: string): { min: number; max: number; average: number } | null {
  return CROP_PRICES_MZN[cropId as keyof typeof CROP_PRICES_MZN] || null;
}

// Conversões aproximadas (valores de referência)
export const CURRENCY_CONVERSIONS = {
  USD_TO_MZN: 63.5, // Taxa aproximada
  EUR_TO_MZN: 69.2,
  ZAR_TO_MZN: 3.4,
};

export function convertToMZN(amount: number, fromCurrency: keyof typeof CURRENCY_CONVERSIONS): number {
  return amount * CURRENCY_CONVERSIONS[fromCurrency];
}
