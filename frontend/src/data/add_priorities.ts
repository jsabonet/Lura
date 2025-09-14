// Script para adicionar prioridades inteligentes às culturas
// Baseado na importância nacional, facilidade para iniciantes, potencial comercial, etc.

type PriorityValues = {
  national: number;
  beginner: number;
  commercial: number;
  subsistence: number;
  climate: number;
};

const priorityData: Record<string, PriorityValues> = {
  // Cereais - Alimentos básicos essenciais
  'milho': { national: 5, beginner: 4, commercial: 5, subsistence: 5, climate: 3 },
  'arroz': { national: 5, beginner: 3, commercial: 4, subsistence: 4, climate: 2 },
  'sorgo': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 5 },
  'mexoeira': { national: 3, beginner: 5, commercial: 2, subsistence: 4, climate: 5 },
  'trigo': { national: 2, beginner: 2, commercial: 3, subsistence: 2, climate: 2 },
  'aveia': { national: 1, beginner: 3, commercial: 2, subsistence: 2, climate: 3 },
  'cevada': { national: 1, beginner: 3, commercial: 2, subsistence: 2, climate: 3 },

  // Leguminosas - Proteína vegetal e fixação de nitrogênio
  'feijao_vulgar': { national: 5, beginner: 4, commercial: 4, subsistence: 5, climate: 3 },
  'feijao_nhemba': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 4 },
  'soja': { national: 3, beginner: 3, commercial: 5, subsistence: 2, climate: 3 },
  'ervilha': { national: 2, beginner: 4, commercial: 3, subsistence: 3, climate: 3 },
  'amendoim': { national: 4, beginner: 4, commercial: 4, subsistence: 4, climate: 4 },
  'lentilha': { national: 2, beginner: 3, commercial: 3, subsistence: 3, climate: 3 },

  // Tubérculos - Segurança alimentar
  'mandioca': { national: 5, beginner: 5, commercial: 3, subsistence: 5, climate: 5 },
  'batata_doce': { national: 4, beginner: 5, commercial: 3, subsistence: 5, climate: 4 },
  'inhame': { national: 3, beginner: 4, commercial: 2, subsistence: 4, climate: 4 },
  'batata_irlandesa': { national: 2, beginner: 3, commercial: 4, subsistence: 3, climate: 2 },

  // Hortaliças - Alto valor comercial, ciclo curto
  'tomate': { national: 3, beginner: 3, commercial: 5, subsistence: 3, climate: 2 },
  'cebola': { national: 3, beginner: 3, commercial: 4, subsistence: 4, climate: 3 },
  'repolho': { national: 2, beginner: 4, commercial: 4, subsistence: 3, climate: 3 },
  'alface': { national: 2, beginner: 5, commercial: 3, subsistence: 3, climate: 2 },

  // Frutíferas - Investimento de longo prazo
  'cajueiro': { national: 4, beginner: 2, commercial: 5, subsistence: 2, climate: 4 },
  'manga': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 4 },
  'laranja': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 3 },
  'banana': { national: 4, beginner: 3, commercial: 4, subsistence: 4, climate: 3 },
  'coqueiro': { national: 3, beginner: 2, commercial: 4, subsistence: 3, climate: 4 },
  'abacate': { national: 2, beginner: 3, commercial: 3, subsistence: 3, climate: 3 },

  // Industriais - Alto potencial econômico
  'algodao': { national: 3, beginner: 2, commercial: 5, subsistence: 1, climate: 2 },
  'cana_acucar': { national: 3, beginner: 2, commercial: 4, subsistence: 2, climate: 3 },

  // Oleaginosas - Valor agregado
  'girassol': { national: 3, beginner: 4, commercial: 4, subsistence: 3, climate: 3 },
  'gergelim': { national: 2, beginner: 4, commercial: 3, subsistence: 3, climate: 4 },
  'cartamo': { national: 1, beginner: 3, commercial: 3, subsistence: 2, climate: 4 },
  'colza': { national: 1, beginner: 3, commercial: 3, subsistence: 2, climate: 3 },

  // Especiarias - Alto valor agregado
  'piri_piri': { national: 2, beginner: 4, commercial: 4, subsistence: 4, climate: 4 },
  'oregaos': { national: 1, beginner: 4, commercial: 3, subsistence: 2, climate: 3 },
  'coentros': { national: 2, beginner: 5, commercial: 3, subsistence: 3, climate: 3 }
};

// Função para gerar string de prioridade
function generatePriorityString(cropId: string) {
  const priority = priorityData[cropId] || { national: 2, beginner: 3, commercial: 3, subsistence: 3, climate: 3 };
  
  return `    priority: {
      national: ${priority.national}, // Importância nacional (alimentar, econômica)
      beginner: ${priority.beginner}, // Facilidade para iniciantes
      commercial: ${priority.commercial}, // Potencial comercial
      subsistence: ${priority.subsistence}, // Valor para agricultura familiar
      climate: ${priority.climate} // Adaptação às mudanças climáticas
    },`;
}

// Lista de todos os IDs das culturas
const cropIds = [
  'milho', 'arroz', 'sorgo', 'feijao_vulgar', 'feijao_nhemba', 'mandioca', 
  'batata_doce', 'cajueiro', 'algodao', 'girassol', 'mexoeira', 'trigo', 
  'soja', 'ervilha', 'tomate', 'cebola', 'manga', 'laranja', 'inhame', 
  'cana_acucar', 'gergelim', 'amendoim', 'cartamo', 'colza', 'banana', 
  'coqueiro', 'abacate', 'repolho', 'alface', 'batata_irlandesa', 
  'lentilha', 'aveia', 'cevada', 'piri_piri', 'oregaos', 'coentros'
];

// Gerar todas as prioridades
cropIds.forEach(id => {
  console.log(`${id}:`);
  console.log(generatePriorityString(id));
  console.log('');
});
