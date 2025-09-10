import { apiService } from './api';

export type AlertChannel = 'sms' | 'whatsapp';

export interface AlertSubscription {
  id: number;
  usuario?: number;
  cultura: string;
  regiao: string;
  latitude?: number | null;
  longitude?: number | null;
  canal: AlertChannel;
  ativo: boolean;
  metadados?: Record<string, any>;
  criado_em?: string;
  atualizado_em?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const alertsService = {
  async list(): Promise<AlertSubscription[]> {
    const res = await apiService.get<PaginatedResponse<AlertSubscription>>('/notificacoes/assinaturas/');
    if (res.data !== undefined) {
      // Handle paginated response from Django Rest Framework
      if ('results' in res.data) {
        return res.data.results;
      }
      // Handle direct array response (fallback)
      return Array.isArray(res.data) ? res.data : [];
    }
    throw new Error(res.error || 'Erro ao listar assinaturas');
  },
  async createOrUpdate(payload: Omit<AlertSubscription, 'id'>): Promise<AlertSubscription> {
    const res = await apiService.post<AlertSubscription>('/notificacoes/assinaturas/', payload);
    if (res.data !== undefined) return res.data;
    throw new Error(res.error || 'Erro ao salvar assinatura');
  },
  async update(id: number, payload: Partial<AlertSubscription>): Promise<AlertSubscription> {
    const res = await apiService.put<AlertSubscription>(`/notificacoes/assinaturas/${id}/`, payload);
    if (res.data !== undefined) return res.data;
    throw new Error(res.error || 'Erro ao atualizar assinatura');
  },
  async remove(id: number): Promise<void> {
    const res = await apiService.delete(`/notificacoes/assinaturas/${id}/`);
    if (res.status >= 200 && res.status < 300) return;
    throw new Error(res.error || 'Erro ao remover assinatura');
  },
};
