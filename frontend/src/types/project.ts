export interface Project {
  id: number;
  nome: string;
  cultura: string;
  area_hectares: number;
  data_plantio: string;
  data_colheita_estimada: string;
  orcamento_total: number;
  status: 'planejamento' | 'ativo' | 'colhido' | 'vendido';
  localizacao_gps?: string;
  foto_capa?: string;
  created_at: string;
  updated_at: string;
  dashboard?: ProjectDashboard;
}

export interface ProjectDashboard {
  id?: number;
  project?: number;
  fase_atual: string;
  progresso_percent: number;
  dias_decorridos: number;
  dias_restantes: number;
  saude_score: number;
  rendimento_estimado: number;
  alertas_json: any[];
  proxima_atividade?: string;
  data_proxima_atividade?: string;
  total_custos?: number;
  custos_mes_atual?: number;
  ultima_atualizacao?: string;
  updated_at?: string;
}

export interface FieldActivity {
  id: number;
  project: number;
  tipo: 'plantio' | 'adubo' | 'defensivo' | 'capina' | 'irrigacao' | 'inspecao' | 'colheita' | 'outro';
  descricao: string;
  data: string;
  custo: number;
  nota_voz?: string;
  created_at: string;
  fotos?: string[];
}

export interface CostTracking {
  id: number;
  project: number;
  categoria: 'insumo' | 'mao_obra' | 'maquina' | 'transporte' | 'outro';
  descricao: string;
  valor_orcado: number;
  valor_real: number;
  data: string;
  nota_fiscal?: string;
}

export interface ProjectDashboardResponse {
  project: Project;
  dashboard: ProjectDashboard;
  atividades_recentes: FieldActivity[];
  custos: CostTracking[];
}
