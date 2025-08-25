import { apiService } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  telefone?: string;
  tipo_usuario: 'agricultor' | 'tecnico' | 'admin';
  localizacao?: string;
  provincia?: string;
  distrito?: string;
  culturas_interesse?: string[];
  receber_sms?: boolean;
  receber_whatsapp?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefone?: string;
  tipo_usuario: string;
  localizacao?: string;
  provincia?: string;
  distrito?: string;
  culturas_interesse: string[];
  receber_sms: boolean;
  receber_whatsapp: boolean;
  data_criacao: string;
  ativo: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface PerfilAgricultor {
  tamanho_propriedade?: number;
  tipo_agricultura: 'familiar' | 'comercial' | 'subsistencia';
  experiencia_anos?: number;
  tem_irrigacao: boolean;
}

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await apiService.post<AuthTokens>('/users/login/', credentials);
    
    if (response.data) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    
    return response;
  }

  async register(userData: RegisterData) {
    return apiService.post<User>('/users/register/', userData);
  }

  async getCurrentUser() {
    return apiService.get<User>('/users/profile/');
  }

  async updateProfile(userData: Partial<User>) {
    return apiService.put<User>('/users/profile/', userData);
  }

  async getPerfilAgricultor() {
    return apiService.get<PerfilAgricultor>('/users/perfil-agricultor/');
  }

  async updatePerfilAgricultor(perfilData: Partial<PerfilAgricultor>) {
    return apiService.put<PerfilAgricultor>('/users/perfil-agricultor/', perfilData);
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ access: string }>('/users/token/refresh/', {
      refresh: refreshToken,
    });

    if (response.data) {
      localStorage.setItem('access_token', response.data.access);
    }

    return response;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
