// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      let data: any = null;
      let errorText: string | undefined = undefined;

      // Try to parse JSON always; fall back to text if needed
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          // ignore parse errors; data remains null
        }
      } else {
        try {
          const text = await response.text();
          if (text) {
            // Attempt to parse as JSON first
            try {
              data = JSON.parse(text);
            } catch {
              errorText = text;
            }
          }
        } catch (e) {
          // ignore
        }
      }

      if (!response.ok) {
        // Prefer DRF-style error messages if present
        if (data && typeof data === 'object') {
          const details: string[] = [];
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              details.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
              details.push(`${key}: ${value}`);
            } else {
              details.push(`${key}: ${JSON.stringify(value)}`);
            }
          }
          errorText = details.length ? details.join(' | ') : errorText;
        }
      }

      return {
        data: response.ok ? (data as T) : undefined,
        status: response.status,
        error: response.ok ? undefined : (errorText || `HTTP ${response.status}: ${response.statusText}`),
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const token = localStorage.getItem('access_token');
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }
}

export const apiService = new ApiService();
