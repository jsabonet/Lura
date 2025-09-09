/**
 * Teste simples para verificar a configuração da API OpenWeather
 * Este arquivo pode ser usado para testar se a API está funcionando corretamente
 */

import { validateApiKeys } from '../config/apis';

export const testOpenWeatherConfig = async () => {
  console.log('🔍 Testando configuração do OpenWeather...');
  
  // Verifica se as chaves estão configuradas
  const validation = validateApiKeys();
  if (!validation.isValid) {
    console.error('❌ Erro na configuração:', validation.errors);
    return false;
  }
  
  console.log('✅ Chaves da API configuradas corretamente');
  
  // Teste básico da API
  const testUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const testParams = new URLSearchParams({
    lat: '-25.9162',
    lon: '32.5485', 
    units: 'metric',
    lang: 'pt_br',
    appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
  });
  
  const fullUrl = `${testUrl}?${testParams.toString()}`;
  console.log('🌐 URL de teste:', fullUrl);
  
  try {
    const response = await fetch(fullUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API funcionando! Dados recebidos:', {
        location: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description
      });
      return true;
    } else {
      console.error('❌ Erro da API:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return false;
  }
};

// Auto-executar se este arquivo for executado diretamente
if (typeof window !== 'undefined') {
  // Executa apenas no cliente
  testOpenWeatherConfig();
}
