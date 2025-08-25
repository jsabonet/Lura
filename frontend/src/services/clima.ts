import { apiService } from './api';

export interface ClimaAtual {
  temperatura: number;
  sensacao_termica: number;
  umidade: number;
  pressao: number;
  velocidade_vento: number;
  direcao_vento: number;
  visibilidade: number;
  condicao: string;
  descricao: string;
  icone: string;
  cidade: string;
  pais: string;
  data_hora: string;
}

export interface PrevisaoClima {
  data: string;
  temperatura_max: number;
  temperatura_min: number;
  condicao: string;
  descricao: string;
  icone: string;
  probabilidade_chuva: number;
  umidade: number;
  velocidade_vento: number;
}

export interface AlertaClimatico {
  id: number;
  tipo_alerta: string;
  titulo: string;
  descricao: string;
  nivel_severidade: 'baixo' | 'moderado' | 'alto' | 'extremo' | null;
  data_inicio: string;
  data_fim: string;
  regioes_afetadas: string[] | null;
  recomendacoes: string[] | null;
  ativo: boolean;
  data_criacao: string;
}

export interface HistoricoClima {
  id: number;
  data: string;
  temperatura_max: number;
  temperatura_min: number;
  precipitacao: number;
  umidade_media: number;
  velocidade_vento_media: number;
  localizacao: string;
}

class ClimaService {
  async getClimaAtual(cidade?: string, lat?: number, lon?: number) {
    const params = new URLSearchParams();
    if (cidade) params.append('cidade', cidade);
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiService.get<ClimaAtual>(`/clima/atual/${query}`);
  }

  async getPrevisao(dias: number = 7, cidade?: string, lat?: number, lon?: number) {
    const params = new URLSearchParams();
    params.append('dias', dias.toString());
    if (cidade) params.append('cidade', cidade);
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());
    
    return apiService.get<PrevisaoClima[]>(`/clima/previsao/?${params.toString()}`);
  }

  async getAlertasClimaticos(regiao?: string) {
    const params = regiao ? `?regiao=${regiao}` : '';
    return apiService.get<AlertaClimatico[]>(`/clima/alertas/${params}`);
  }

  async getHistoricoClima(
    dataInicio: string,
    dataFim: string,
    localizacao?: string
  ) {
    const params = new URLSearchParams();
    params.append('data_inicio', dataInicio);
    params.append('data_fim', dataFim);
    if (localizacao) params.append('localizacao', localizacao);
    
    return apiService.get<HistoricoClima[]>(`/clima/historico/?${params.toString()}`);
  }
}

export const climaService = new ClimaService();
