import { apiService } from './api';

export interface Praga {
  id: number;
  nome: string;
  nome_cientifico: string;
  descricao: string;
  sintomas: string[] | null;
  culturas_afetadas: string[] | null;
  epoca_ocorrencia: string;
  nivel_dano: 'baixo' | 'moderado' | 'alto' | 'severo' | null;
  metodos_controle: string[] | null;
  prevencao: string[] | null;
  imagem_url?: string;
  ativa: boolean;
}

export interface DeteccaoPraga {
  id: number;
  praga_detectada: Praga;
  confianca: number;
  cultura: string;
  localizacao?: string;
  imagem_original: string;
  imagem_processada?: string;
  data_deteccao: string;
  usuario: number;
  observacoes?: string;
}

export interface RecomendacaoPraga {
  praga: Praga;
  recomendacoes_imediatas: string[] | null;
  recomendacoes_preventivas: string[] | null;
  produtos_recomendados: string[] | null;
  monitoramento: string[] | null;
  urgencia: 'baixa' | 'media' | 'alta' | 'critica' | null;
}

class PragasService {
  async detectarPraga(
    imagem: File,
    cultura: string,
    localizacao?: string,
    observacoes?: string
  ) {
    const additionalData = {
      cultura,
      ...(localizacao && { localizacao }),
      ...(observacoes && { observacoes }),
    };

    return apiService.uploadFile<DeteccaoPraga>(
      '/pragas/detectar/',
      imagem,
      additionalData
    );
  }

  async listarPragas(cultura?: string, nivel_dano?: string) {
    const params = new URLSearchParams();
    if (cultura) params.append('cultura', cultura);
    if (nivel_dano) params.append('nivel_dano', nivel_dano);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiService.get<Praga[]>(`/pragas/listar/${query}`);
  }

  async getHistoricoDeteccoes(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return apiService.get<DeteccaoPraga[]>(`/pragas/historico/${params}`);
  }

  async gerarRecomendacao(pragaId: number, cultura: string) {
    return apiService.post<RecomendacaoPraga>('/pragas/recomendacao/', {
      praga_id: pragaId,
      cultura,
    });
  }

  async getPragaDetalhes(pragaId: number) {
    return apiService.get<Praga>(`/pragas/listar/?id=${pragaId}`);
  }
}

export const pragasService = new PragasService();
