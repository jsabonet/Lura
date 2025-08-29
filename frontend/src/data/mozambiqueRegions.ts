/**
 * Estrutura hierárquica completa de Províncias e Distritos de Moçambique
 * com coordenadas específicas para dados agro-climáticos precisos
 */

export interface District {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  description?: string;
  economicActivity?: string[];
}

export interface Province {
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  description: string;
  districts: District[];
}

export const MOZAMBIQUE_PROVINCES: Province[] = [
  {
    name: 'Maputo Cidade',
    coords: { lat: -25.969, lng: 32.573 },
    description: 'Capital de Moçambique',
    districts: [
      { 
        name: 'KaMpfumo', 
        coords: { lat: -25.969, lng: 32.573 },
        description: 'Centro da cidade',
        economicActivity: ['Comércio', 'Serviços', 'Horticultura urbana']
      },
      { 
        name: 'Nlhamankulu', 
        coords: { lat: -25.975, lng: 32.580 },
        description: 'Distrito central',
        economicActivity: ['Comércio', 'Agricultura urbana']
      },
      { 
        name: 'KaMaxakeni', 
        coords: { lat: -25.985, lng: 32.585 },
        description: 'Zona residencial',
        economicActivity: ['Agricultura familiar', 'Pequeno comércio']
      },
      { 
        name: 'KaMavota', 
        coords: { lat: -25.995, lng: 32.595 },
        description: 'Distrito periférico',
        economicActivity: ['Agricultura familiar', 'Pecuária']
      },
      { 
        name: 'KaMubukwana', 
        coords: { lat: -25.965, lng: 32.565 },
        description: 'Zona costeira',
        economicActivity: ['Pesca', 'Agricultura costeira']
      }
    ]
  },
  {
    name: 'Maputo Província',
    coords: { lat: -25.0, lng: 32.0 },
    description: 'Província de Maputo',
    districts: [
      { 
        name: 'Boane', 
        coords: { lat: -26.045, lng: 32.327 },
        description: 'Centro agrícola importante',
        economicActivity: ['Milho', 'Mandioca', 'Horticultura', 'Pecuária']
      },
      { 
        name: 'Magude', 
        coords: { lat: -26.045, lng: 32.716 },
        description: 'Agricultura e pecuária',
        economicActivity: ['Arroz', 'Milho', 'Gado bovino']
      },
      { 
        name: 'Manhiça', 
        coords: { lat: -25.407, lng: 32.803 },
        description: 'Zona de cana-de-açúcar',
        economicActivity: ['Cana-de-açúcar', 'Milho', 'Mandioca']
      },
      { 
        name: 'Marracuene', 
        coords: { lat: -25.567, lng: 32.667 },
        description: 'Agricultura diversificada',
        economicActivity: ['Horticultura', 'Milho', 'Mandioca', 'Pecuária']
      },
      { 
        name: 'Matutuíne', 
        coords: { lat: -26.967, lng: 32.833 },
        description: 'Fronteira com África do Sul',
        economicActivity: ['Agricultura familiar', 'Turismo', 'Pesca']
      },
      { 
        name: 'Moamba', 
        coords: { lat: -25.633, lng: 32.167 },
        description: 'Zona de irrigação',
        economicActivity: ['Arroz irrigado', 'Horticultura', 'Citros']
      },
      { 
        name: 'Namaacha', 
        coords: { lat: -25.983, lng: 32.017 },
        description: 'Montanhoso, clima fresco',
        economicActivity: ['Horticultura', 'Fruticultura', 'Flores']
      }
    ]
  },
  {
    name: 'Gaza',
    coords: { lat: -23.0, lng: 33.0 },
    description: 'Província de Gaza',
    districts: [
      { 
        name: 'Bilene', 
        coords: { lat: -25.283, lng: 33.283 },
        description: 'Costa com lagoas',
        economicActivity: ['Coco', 'Caju', 'Pesca', 'Turismo']
      },
      { 
        name: 'Chibuto', 
        coords: { lat: -24.683, lng: 33.533 },
        description: 'Vale do Limpopo',
        economicActivity: ['Arroz', 'Milho', 'Algodão']
      },
      { 
        name: 'Chicualacuala', 
        coords: { lat: -22.4, lng: 31.7 },
        description: 'Fronteira com Zimbabwe',
        economicActivity: ['Pecuária', 'Agricultura de subsistência']
      },
      { 
        name: 'Chigubo', 
        coords: { lat: -23.35, lng: 33.55 },
        description: 'Interior da província',
        economicActivity: ['Milho', 'Sorgo', 'Pecuária']
      },
      { 
        name: 'Chókwè', 
        coords: { lat: -24.533, lng: 33.0 },
        description: 'Maior projeto de irrigação',
        economicActivity: ['Arroz irrigado', 'Tomate', 'Cebola']
      },
      { 
        name: 'Guijá', 
        coords: { lat: -24.083, lng: 32.8 },
        description: 'Agricultura e pecuária',
        economicActivity: ['Milho', 'Feijão', 'Gado bovino']
      },
      { 
        name: 'Mabalane', 
        coords: { lat: -23.783, lng: 32.1 },
        description: 'Parque Nacional Limpopo',
        economicActivity: ['Turismo', 'Agricultura familiar']
      },
      { 
        name: 'Manjacaze', 
        coords: { lat: -24.7, lng: 33.933 },
        description: 'Zona costeira',
        economicActivity: ['Caju', 'Coco', 'Mandioca']
      },
      { 
        name: 'Mapai', 
        coords: { lat: -22.083, lng: 31.233 },
        description: 'Norte da província',
        economicActivity: ['Pecuária', 'Milho', 'Sorgo']
      },
      { 
        name: 'Massangena', 
        coords: { lat: -23.35, lng: 32.15 },
        description: 'Interior semi-árido',
        economicActivity: ['Pecuária', 'Agricultura resistente à seca']
      },
      { 
        name: 'Massingir', 
        coords: { lat: -23.883, lng: 32.167 },
        description: 'Barragem de Massingir',
        economicActivity: ['Agricultura irrigada', 'Pesca', 'Turismo']
      },
      { 
        name: 'Xai-Xai', 
        coords: { lat: -25.05, lng: 33.644 },
        description: 'Capital da província',
        economicActivity: ['Coco', 'Caju', 'Pesca', 'Turismo']
      }
    ]
  },
  {
    name: 'Inhambane',
    coords: { lat: -22.0, lng: 35.0 },
    description: 'Província de Inhambane',
    districts: [
      { 
        name: 'Funhalouro', 
        coords: { lat: -22.583, lng: 34.733 },
        description: 'Interior da província',
        economicActivity: ['Milho', 'Amendoim', 'Pecuária']
      },
      { 
        name: 'Govuro', 
        coords: { lat: -21.733, lng: 35.467 },
        description: 'Costa norte',
        economicActivity: ['Pesca', 'Caju', 'Coco']
      },
      { 
        name: 'Homoíne', 
        coords: { lat: -23.867, lng: 35.25 },
        description: 'Zona costeira central',
        economicActivity: ['Caju', 'Mandioca', 'Pesca']
      },
      { 
        name: 'Inhambane', 
        coords: { lat: -23.867, lng: 35.383 },
        description: 'Capital da província',
        economicActivity: ['Caju', 'Pesca', 'Turismo']
      },
      { 
        name: 'Inharrime', 
        coords: { lat: -24.467, lng: 35.0 },
        description: 'Sul da província',
        economicActivity: ['Caju', 'Mandioca', 'Coco']
      },
      { 
        name: 'Inhassoro', 
        coords: { lat: -21.5, lng: 35.183 },
        description: 'Norte costeiro',
        economicActivity: ['Pesca', 'Caju', 'Turismo']
      },
      { 
        name: 'Jangamo', 
        coords: { lat: -24.083, lng: 35.133 },
        description: 'Zona costeira',
        economicActivity: ['Caju', 'Pesca', 'Mandioca']
      },
      { 
        name: 'Mabote', 
        coords: { lat: -23.0, lng: 34.2 },
        description: 'Interior oeste',
        economicActivity: ['Milho', 'Sorgo', 'Pecuária']
      },
      { 
        name: 'Massinga', 
        coords: { lat: -23.2, lng: 35.4 },
        description: 'Centro da província',
        economicActivity: ['Caju', 'Mandioca', 'Coco']
      },
      { 
        name: 'Maxixe', 
        coords: { lat: -23.85, lng: 35.35 },
        description: 'Porto importante',
        economicActivity: ['Pesca', 'Comércio', 'Caju']
      },
      { 
        name: 'Morrumbene', 
        coords: { lat: -23.733, lng: 35.317 },
        description: 'Península',
        economicActivity: ['Pesca', 'Caju', 'Turismo']
      },
      { 
        name: 'Panda', 
        coords: { lat: -24.067, lng: 34.733 },
        description: 'Interior sul',
        economicActivity: ['Milho', 'Amendoim', 'Mandioca']
      },
      { 
        name: 'Vilanculos', 
        coords: { lat: -22.0, lng: 35.317 },
        description: 'Centro turístico',
        economicActivity: ['Turismo', 'Pesca', 'Caju']
      },
      { 
        name: 'Zavala', 
        coords: { lat: -24.7, lng: 34.867 },
        description: 'Sul interior',
        economicActivity: ['Mandioca', 'Amendoim', 'Caju']
      }
    ]
  },
  {
    name: 'Sofala',
    coords: { lat: -18.0, lng: 35.0 },
    description: 'Província de Sofala - Beira',
    districts: [
      { 
        name: 'Beira', 
        coords: { lat: -19.843, lng: 34.839 },
        description: 'Capital provincial e porto',
        economicActivity: ['Comércio', 'Indústria', 'Pesca', 'Horticultura']
      },
      { 
        name: 'Búzi', 
        coords: { lat: -19.983, lng: 34.433 },
        description: 'Delta do Búzi',
        economicActivity: ['Arroz', 'Coco', 'Cana-de-açúcar']
      },
      { 
        name: 'Caia', 
        coords: { lat: -17.883, lng: 35.4 },
        description: 'Norte da província',
        economicActivity: ['Milho', 'Algodão', 'Tabaco']
      },
      { 
        name: 'Chemba', 
        coords: { lat: -18.283, lng: 34.733 },
        description: 'Interior central',
        economicActivity: ['Milho', 'Sorgo', 'Pecuária']
      },
      { 
        name: 'Cheringoma', 
        coords: { lat: -18.45, lng: 35.15 },
        description: 'Centro-norte',
        economicActivity: ['Milho', 'Algodão', 'Pecuária']
      },
      { 
        name: 'Chibabava', 
        coords: { lat: -20.283, lng: 33.583 },
        description: 'Oeste da província',
        economicActivity: ['Milho', 'Algodão', 'Tabaco']
      },
      { 
        name: 'Dondo', 
        coords: { lat: -19.583, lng: 34.75 },
        description: 'Próximo à Beira',
        economicActivity: ['Cana-de-açúcar', 'Arroz', 'Horticultura']
      },
      { 
        name: 'Gorongosa', 
        coords: { lat: -18.833, lng: 34.0 },
        description: 'Parque Nacional',
        economicActivity: ['Turismo', 'Agricultura familiar', 'Conservação']
      },
      { 
        name: 'Machanga', 
        coords: { lat: -21.05, lng: 34.883 },
        description: 'Sul da província',
        economicActivity: ['Caju', 'Mandioca', 'Coco']
      },
      { 
        name: 'Marínguè', 
        coords: { lat: -19.333, lng: 33.8 },
        description: 'Oeste central',
        economicActivity: ['Milho', 'Algodão', 'Pecuária']
      },
      { 
        name: 'Marromeu', 
        coords: { lat: -18.283, lng: 35.9 },
        description: 'Delta do Zambeze',
        economicActivity: ['Arroz', 'Coco', 'Pesca']
      },
      { 
        name: 'Muanza', 
        coords: { lat: -19.683, lng: 33.6 },
        description: 'Interior oeste',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Nhamatanda', 
        coords: { lat: -19.7, lng: 34.433 },
        description: 'Corredor da Beira',
        economicActivity: ['Milho', 'Cana-de-açúcar', 'Horticultura']
      }
    ]
  },
  {
    name: 'Manica',
    coords: { lat: -18.5, lng: 33.0 },
    description: 'Província de Manica',
    districts: [
      { 
        name: 'Báruè', 
        coords: { lat: -17.733, lng: 33.15 },
        description: 'Norte da província',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Chimoio', 
        coords: { lat: -19.116, lng: 33.484 },
        description: 'Capital da província',
        economicActivity: ['Milho', 'Tabaco', 'Horticultura', 'Comércio']
      },
      { 
        name: 'Gondola', 
        coords: { lat: -19.2, lng: 33.267 },
        description: 'Montanhoso',
        economicActivity: ['Milho', 'Feijão', 'Horticultura']
      },
      { 
        name: 'Guro', 
        coords: { lat: -18.433, lng: 33.65 },
        description: 'Centro-norte',
        economicActivity: ['Milho', 'Algodão', 'Tabaco']
      },
      { 
        name: 'Macate', 
        coords: { lat: -18.05, lng: 33.083 },
        description: 'Norte montanhoso',
        economicActivity: ['Milho', 'Feijão', 'Horticultura']
      },
      { 
        name: 'Machaze', 
        coords: { lat: -20.15, lng: 33.0 },
        description: 'Sul da província',
        economicActivity: ['Milho', 'Algodão', 'Pecuária']
      },
      { 
        name: 'Manica', 
        coords: { lat: -18.933, lng: 32.867 },
        description: 'Fronteira com Zimbabwe',
        economicActivity: ['Milho', 'Horticultura', 'Comércio']
      },
      { 
        name: 'Mossurize', 
        coords: { lat: -20.05, lng: 33.1 },
        description: 'Sul montanhoso',
        economicActivity: ['Milho', 'Feijão', 'Café']
      },
      { 
        name: 'Sussundenga', 
        coords: { lat: -19.567, lng: 33.383 },
        description: 'Montanhas Chimanimani',
        economicActivity: ['Café', 'Chá', 'Horticultura']
      },
      { 
        name: 'Tambara', 
        coords: { lat: -18.7, lng: 33.483 },
        description: 'Centro da província',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Vanduzi', 
        coords: { lat: -18.95, lng: 33.733 },
        description: 'Leste da província',
        economicActivity: ['Milho', 'Algodão', 'Horticultura']
      }
    ]
  },
  {
    name: 'Tete',
    coords: { lat: -16.0, lng: 33.0 },
    description: 'Província de Tete',
    districts: [
      { 
        name: 'Angónia', 
        coords: { lat: -14.667, lng: 34.233 },
        description: 'Norte da província',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Cahora Bassa', 
        coords: { lat: -15.6, lng: 32.7 },
        description: 'Barragem hidrelétrica',
        economicActivity: ['Pesca', 'Energia', 'Agricultura irrigada']
      },
      { 
        name: 'Changara', 
        coords: { lat: -15.95, lng: 32.2 },
        description: 'Oeste da província',
        economicActivity: ['Milho', 'Algodão', 'Mineração']
      },
      { 
        name: 'Chifunde', 
        coords: { lat: -14.15, lng: 33.65 },
        description: 'Norte extremo',
        economicActivity: ['Milho', 'Tabaco', 'Pecuária']
      },
      { 
        name: 'Chiúta', 
        coords: { lat: -14.2, lng: 34.55 },
        description: 'Fronteira com Malawi',
        economicActivity: ['Milho', 'Tabaco', 'Comércio']
      },
      { 
        name: 'Dôa', 
        coords: { lat: -16.033, lng: 34.4 },
        description: 'Leste da província',
        economicActivity: ['Milho', 'Algodão', 'Tabaco']
      },
      { 
        name: 'Macanga', 
        coords: { lat: -14.533, lng: 33.95 },
        description: 'Norte central',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Magoè', 
        coords: { lat: -15.05, lng: 30.8 },
        description: 'Oeste extremo',
        economicActivity: ['Agricultura familiar', 'Pecuária', 'Mineração']
      },
      { 
        name: 'Marara', 
        coords: { lat: -16.583, lng: 33.233 },
        description: 'Sul da província',
        economicActivity: ['Milho', 'Algodão', 'Pecuária']
      },
      { 
        name: 'Moatize', 
        coords: { lat: -16.1, lng: 33.4 },
        description: 'Centro de mineração',
        economicActivity: ['Carvão', 'Milho', 'Horticultura']
      },
      { 
        name: 'Mutarara', 
        coords: { lat: -17.383, lng: 35.0 },
        description: 'Sul-leste',
        economicActivity: ['Milho', 'Algodão', 'Arroz']
      },
      { 
        name: 'Tete', 
        coords: { lat: -16.167, lng: 33.6 },
        description: 'Capital da província',
        economicActivity: ['Comércio', 'Mineração', 'Agricultura']
      },
      { 
        name: 'Tsangano', 
        coords: { lat: -15.583, lng: 33.783 },
        description: 'Centro-leste',
        economicActivity: ['Milho', 'Tabaco', 'Algodão']
      },
      { 
        name: 'Zumbo', 
        coords: { lat: -15.6, lng: 30.4 },
        description: 'Fronteira com Zâmbia',
        economicActivity: ['Comércio', 'Agricultura familiar', 'Pesca']
      }
    ]
  },
  {
    name: 'Zambézia',
    coords: { lat: -17.0, lng: 37.0 },
    description: 'Província da Zambézia',
    districts: [
      { 
        name: 'Alto Molócuè', 
        coords: { lat: -15.6, lng: 37.7 },
        description: 'Norte da província',
        economicActivity: ['Algodão', 'Milho', 'Sésamo']
      },
      { 
        name: 'Chinde', 
        coords: { lat: -18.583, lng: 36.483 },
        description: 'Delta do Zambeze',
        economicActivity: ['Arroz', 'Coco', 'Pesca']
      },
      { 
        name: 'Derre', 
        coords: { lat: -16.383, lng: 38.2 },
        description: 'Interior nordeste',
        economicActivity: ['Algodão', 'Milho', 'Sésamo']
      },
      { 
        name: 'Gilé', 
        coords: { lat: -16.183, lng: 37.4 },
        description: 'Norte central',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Gurué', 
        coords: { lat: -15.467, lng: 36.983 },
        description: 'Zona do chá',
        economicActivity: ['Chá', 'Milho', 'Feijão']
      },
      { 
        name: 'Ile', 
        coords: { lat: -16.133, lng: 36.05 },
        description: 'Oeste da província',
        economicActivity: ['Algodão', 'Milho', 'Tabaco']
      },
      { 
        name: 'Inhassunge', 
        coords: { lat: -17.967, lng: 36.733 },
        description: 'Sul da província',
        economicActivity: ['Arroz', 'Coco', 'Algodão']
      },
      { 
        name: 'Luabo', 
        coords: { lat: -18.05, lng: 36.5 },
        description: 'Delta do Zambeze',
        economicActivity: ['Arroz', 'Coco', 'Pesca']
      },
      { 
        name: 'Lugela', 
        coords: { lat: -16.75, lng: 37.283 },
        description: 'Centro da província',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Maganja da Costa', 
        coords: { lat: -17.65, lng: 37.133 },
        description: 'Costa central',
        economicActivity: ['Coco', 'Caju', 'Pesca']
      },
      { 
        name: 'Milange', 
        coords: { lat: -15.933, lng: 35.867 },
        description: 'Oeste montanhoso',
        economicActivity: ['Chá', 'Milho', 'Feijão']
      },
      { 
        name: 'Mocuba', 
        coords: { lat: -16.833, lng: 36.983 },
        description: 'Centro comercial',
        economicActivity: ['Algodão', 'Milho', 'Comércio']
      },
      { 
        name: 'Mocubela', 
        coords: { lat: -17.067, lng: 36.983 },
        description: 'Centro-sul',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Molumbo', 
        coords: { lat: -15.8, lng: 37.2 },
        description: 'Norte interior',
        economicActivity: ['Algodão', 'Milho', 'Sésamo']
      },
      { 
        name: 'Mopeia', 
        coords: { lat: -17.75, lng: 35.467 },
        description: 'Oeste sul',
        economicActivity: ['Arroz', 'Milho', 'Algodão']
      },
      { 
        name: 'Morrumbala', 
        coords: { lat: -17.433, lng: 35.3 },
        description: 'Oeste da província',
        economicActivity: ['Arroz', 'Milho', 'Pesca']
      },
      { 
        name: 'Namacurra', 
        coords: { lat: -17.717, lng: 36.9 },
        description: 'Costa sul',
        economicActivity: ['Coco', 'Arroz', 'Pesca']
      },
      { 
        name: 'Namarrói', 
        coords: { lat: -16.583, lng: 38.3 },
        description: 'Extremo nordeste',
        economicActivity: ['Algodão', 'Sésamo', 'Amendoim']
      },
      { 
        name: 'Nicoadala', 
        coords: { lat: -17.533, lng: 36.533 },
        description: 'Centro-sul',
        economicActivity: ['Arroz', 'Coco', 'Algodão']
      },
      { 
        name: 'Pebane', 
        coords: { lat: -17.283, lng: 38.183 },
        description: 'Costa nordeste',
        economicActivity: ['Caju', 'Coco', 'Pesca']
      },
      { 
        name: 'Quelimane', 
        coords: { lat: -17.883, lng: 36.883 },
        description: 'Capital da província',
        economicActivity: ['Coco', 'Arroz', 'Caju', 'Comércio']
      }
    ]
  },
  {
    name: 'Nampula',
    coords: { lat: -15.0, lng: 39.0 },
    description: 'Província de Nampula',
    districts: [
      { 
        name: 'Angoche', 
        coords: { lat: -16.233, lng: 39.9 },
        description: 'Costa sul',
        economicActivity: ['Pesca', 'Caju', 'Sal']
      },
      { 
        name: 'Eráti', 
        coords: { lat: -15.183, lng: 39.617 },
        description: 'Costa central',
        economicActivity: ['Caju', 'Algodão', 'Pesca']
      },
      { 
        name: 'Ilha de Moçambique', 
        coords: { lat: -15.033, lng: 40.733 },
        description: 'Ilha histórica',
        economicActivity: ['Turismo', 'Pesca', 'Artesanato']
      },
      { 
        name: 'Lalaua', 
        coords: { lat: -14.4, lng: 40.6 },
        description: 'Norte costeiro',
        economicActivity: ['Caju', 'Algodão', 'Pesca']
      },
      { 
        name: 'Larde', 
        coords: { lat: -14.933, lng: 39.2 },
        description: 'Interior oeste',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Liúpo', 
        coords: { lat: -15.25, lng: 38.85 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Sésamo']
      },
      { 
        name: 'Malema', 
        coords: { lat: -14.717, lng: 38.2 },
        description: 'Oeste da província',
        economicActivity: ['Algodão', 'Milho', 'Tabaco']
      },
      { 
        name: 'Meconta', 
        coords: { lat: -14.883, lng: 40.033 },
        description: 'Centro-leste',
        economicActivity: ['Caju', 'Algodão', 'Mandioca']
      },
      { 
        name: 'Mecubúri', 
        coords: { lat: -14.483, lng: 38.817 },
        description: 'Norte interior',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Memba', 
        coords: { lat: -15.2, lng: 40.7 },
        description: 'Costa leste',
        economicActivity: ['Pesca', 'Caju', 'Turismo']
      },
      { 
        name: 'Mogincual', 
        coords: { lat: -15.617, lng: 40.533 },
        description: 'Costa central',
        economicActivity: ['Caju', 'Pesca', 'Coco']
      },
      { 
        name: 'Mogovolas', 
        coords: { lat: -15.05, lng: 39.283 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Mandioca']
      },
      { 
        name: 'Moma', 
        coords: { lat: -16.783, lng: 39.55 },
        description: 'Sul da província',
        economicActivity: ['Caju', 'Algodão', 'Pesca']
      },
      { 
        name: 'Monapo', 
        coords: { lat: -15.05, lng: 39.85 },
        description: 'Centro-leste',
        economicActivity: ['Caju', 'Algodão', 'Mandioca']
      },
      { 
        name: 'Mossuril', 
        coords: { lat: -14.95, lng: 40.667 },
        description: 'Costa nordeste',
        economicActivity: ['Pesca', 'Caju', 'Turismo']
      },
      { 
        name: 'Muecate', 
        coords: { lat: -14.533, lng: 39.133 },
        description: 'Norte interior',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Murrupula', 
        coords: { lat: -15.15, lng: 38.433 },
        description: 'Oeste central',
        economicActivity: ['Algodão', 'Milho', 'Tabaco']
      },
      { 
        name: 'Nacala-a-Velha', 
        coords: { lat: -14.55, lng: 40.683 },
        description: 'Porto importante',
        economicActivity: ['Porto', 'Pesca', 'Comércio']
      },
      { 
        name: 'Nacala Porto', 
        coords: { lat: -14.533, lng: 40.667 },
        description: 'Porto de águas profundas',
        economicActivity: ['Porto', 'Indústria', 'Comércio']
      },
      { 
        name: 'Nacarôa', 
        coords: { lat: -15.55, lng: 38.65 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Nampula', 
        coords: { lat: -15.117, lng: 39.267 },
        description: 'Capital da província',
        economicActivity: ['Comércio', 'Indústria', 'Algodão', 'Caju']
      },
      { 
        name: 'Rapale', 
        coords: { lat: -14.05, lng: 38.6 },
        description: 'Norte da província',
        economicActivity: ['Algodão', 'Milho', 'Amendoim']
      },
      { 
        name: 'Ribaué', 
        coords: { lat: -14.933, lng: 38.317 },
        description: 'Oeste central',
        economicActivity: ['Algodão', 'Milho', 'Tabaco']
      }
    ]
  },
  {
    name: 'Cabo Delgado',
    coords: { lat: -12.0, lng: 40.0 },
    description: 'Província de Cabo Delgado',
    districts: [
      { 
        name: 'Ancuabe', 
        coords: { lat: -13.7, lng: 39.0 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Caju']
      },
      { 
        name: 'Balama', 
        coords: { lat: -13.333, lng: 38.5 },
        description: 'Interior oeste',
        economicActivity: ['Algodão', 'Milho', 'Sésamo']
      },
      { 
        name: 'Chiúre', 
        coords: { lat: -13.267, lng: 39.467 },
        description: 'Interior central',
        economicActivity: ['Caju', 'Algodão', 'Mandioca']
      },
      { 
        name: 'Ibo', 
        coords: { lat: -12.35, lng: 40.583 },
        description: 'Arquipélago das Quirimbas',
        economicActivity: ['Pesca', 'Turismo', 'Sal']
      },
      { 
        name: 'Macomia', 
        coords: { lat: -12.083, lng: 40.55 },
        description: 'Costa norte',
        economicActivity: ['Pesca', 'Caju', 'Gás natural']
      },
      { 
        name: 'Mecúfi', 
        coords: { lat: -12.8, lng: 40.65 },
        description: 'Costa central',
        economicActivity: ['Pesca', 'Caju', 'Coco']
      },
      { 
        name: 'Meluco', 
        coords: { lat: -13.05, lng: 39.2 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Caju']
      },
      { 
        name: 'Mocímboa da Praia', 
        coords: { lat: -11.35, lng: 40.367 },
        description: 'Extremo norte',
        economicActivity: ['Pesca', 'Gás natural', 'Caju']
      },
      { 
        name: 'Montepuez', 
        coords: { lat: -13.133, lng: 38.9 },
        description: 'Interior central',
        economicActivity: ['Algodão', 'Milho', 'Rubis']
      },
      { 
        name: 'Mueda', 
        coords: { lat: -11.683, lng: 39.567 },
        description: 'Planalto norte',
        economicActivity: ['Caju', 'Mandioca', 'Milho']
      },
      { 
        name: 'Muidumbe', 
        coords: { lat: -11.6, lng: 39.867 },
        description: 'Norte interior',
        economicActivity: ['Caju', 'Mandioca', 'Sésamo']
      },
      { 
        name: 'Namuno', 
        coords: { lat: -13.4, lng: 37.15 },
        description: 'Extremo oeste',
        economicActivity: ['Mineração', 'Agricultura familiar']
      },
      { 
        name: 'Nangade', 
        coords: { lat: -11.183, lng: 39.783 },
        description: 'Fronteira com Tanzânia',
        economicActivity: ['Caju', 'Comércio', 'Agricultura familiar']
      },
      { 
        name: 'Palma', 
        coords: { lat: -10.733, lng: 40.35 },
        description: 'Extremo nordeste',
        economicActivity: ['Gás natural', 'Pesca', 'Caju']
      },
      { 
        name: 'Pemba', 
        coords: { lat: -12.967, lng: 40.517 },
        description: 'Capital da província',
        economicActivity: ['Porto', 'Turismo', 'Pesca', 'Comércio']
      },
      { 
        name: 'Quissanga', 
        coords: { lat: -12.117, lng: 40.617 },
        description: 'Costa norte',
        economicActivity: ['Pesca', 'Caju', 'Turismo']
      }
    ]
  },
  {
    name: 'Niassa',
    coords: { lat: -13.0, lng: 35.0 },
    description: 'Província do Niassa',
    districts: [
      { 
        name: 'Chimbonila', 
        coords: { lat: -12.15, lng: 34.6 },
        description: 'Norte da província',
        economicActivity: ['Agricultura familiar', 'Pesca', 'Turismo']
      },
      { 
        name: 'Cuamba', 
        coords: { lat: -14.8, lng: 36.533 },
        description: 'Centro comercial',
        economicActivity: ['Comércio', 'Milho', 'Feijão']
      },
      { 
        name: 'Lago', 
        coords: { lat: -12.033, lng: 34.8 },
        description: 'Lago Niassa',
        economicActivity: ['Pesca', 'Turismo', 'Agricultura']
      },
      { 
        name: 'Lichinga', 
        coords: { lat: -13.317, lng: 35.233 },
        description: 'Capital da província',
        economicActivity: ['Comércio', 'Agricultura', 'Madeira']
      },
      { 
        name: 'Majune', 
        coords: { lat: -13.25, lng: 36.4 },
        description: 'Leste da província',
        economicActivity: ['Milho', 'Feijão', 'Tabaco']
      },
      { 
        name: 'Mandimba', 
        coords: { lat: -14.3, lng: 35.75 },
        description: 'Sul da província',
        economicActivity: ['Milho', 'Feijão', 'Mandioca']
      },
      { 
        name: 'Marrupa', 
        coords: { lat: -13.233, lng: 37.55 },
        description: 'Extremo leste',
        economicActivity: ['Milho', 'Feijão', 'Amendoim']
      },
      { 
        name: 'Maúa', 
        coords: { lat: -13.45, lng: 37.083 },
        description: 'Leste central',
        economicActivity: ['Milho', 'Feijão', 'Algodão']
      },
      { 
        name: 'Mavago', 
        coords: { lat: -14.15, lng: 37.4 },
        description: 'Sudeste',
        economicActivity: ['Milho', 'Feijão', 'Caça controlada']
      },
      { 
        name: 'Mecanhelas', 
        coords: { lat: -13.05, lng: 36.6 },
        description: 'Centro-leste',
        economicActivity: ['Milho', 'Feijão', 'Amendoim']
      },
      { 
        name: 'Mecula', 
        coords: { lat: -12.45, lng: 35.65 },
        description: 'Norte central',
        economicActivity: ['Agricultura familiar', 'Pesca', 'Madeira']
      },
      { 
        name: 'Metarica', 
        coords: { lat: -12.85, lng: 36.9 },
        description: 'Nordeste',
        economicActivity: ['Milho', 'Feijão', 'Amendoim']
      },
      { 
        name: 'Muembe', 
        coords: { lat: -14.6, lng: 36.4 },
        description: 'Sul central',
        economicActivity: ['Milho', 'Tabaco', 'Feijão']
      },
      { 
        name: 'Ngauma', 
        coords: { lat: -12.6, lng: 37.15 },
        description: 'Nordeste interior',
        economicActivity: ['Milho', 'Feijão', 'Sésamo']
      },
      { 
        name: 'Nipepe', 
        coords: { lat: -12.95, lng: 35.85 },
        description: 'Centro da província',
        economicActivity: ['Milho', 'Feijão', 'Mandioca']
      },
      { 
        name: 'Sanga', 
        coords: { lat: -12.5, lng: 35.1 },
        description: 'Oeste da província',
        economicActivity: ['Agricultura familiar', 'Pesca', 'Madeira']
      }
    ]
  }
];

export const getProvinceByName = (name: string): Province | undefined => {
  return MOZAMBIQUE_PROVINCES.find(province => province.name === name);
};

export const getDistrictByName = (provinceName: string, districtName: string): District | undefined => {
  const province = getProvinceByName(provinceName);
  return province?.districts.find(district => district.name === districtName);
};

export const getAllDistricts = (): Array<District & { province: string }> => {
  return MOZAMBIQUE_PROVINCES.flatMap(province => 
    province.districts.map(district => ({
      ...district,
      province: province.name
    }))
  );
};
