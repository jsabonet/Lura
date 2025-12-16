import { Project, ProjectDashboardResponse } from '@/types/project';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getProjects(token: string): Promise<Project[]> {
  console.log('🔍 getProjects - Fazendo requisição para:', `${API_BASE}/api/projetos/`);
  console.log('🔑 Token presente:', token ? 'Sim' : 'Não');
  
  const response = await fetch(`${API_BASE}/api/projetos/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  console.log('📊 Status da resposta:', response.status);
  
  if (!response.ok) {
    console.error('❌ Erro na resposta:', response.status, response.statusText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('✅ Dados recebidos:', data);
  
  // A API pode retornar um objeto paginado {count, results} ou array direto
  if (data.results && Array.isArray(data.results)) {
    console.log('📦 Objeto paginado detectado. Projetos:', data.results.length);
    return data.results;
  }
  
  console.log('📈 Array direto. Projetos:', Array.isArray(data) ? data.length : 'Não é array');
  return Array.isArray(data) ? data : [];
}

export async function getProjectDashboard(projectId: string, token: string): Promise<ProjectDashboardResponse> {
  const response = await fetch(`${API_BASE}/api/projetos/${projectId}/dashboard/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createProject(data: any, token: string): Promise<Project> {
  console.log('🌱 Criando projeto no backend:', data);
  console.log('📍 URL:', `${API_BASE}/api/projetos/`);
  
  const response = await fetch(`${API_BASE}/api/projetos/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  console.log('📊 Status da resposta:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    console.error('❌ Erro ao criar projeto:', errorData);
    
    // Extrair mensagens de erro mais detalhadas
    if (typeof errorData === 'object') {
      const errors = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      throw new Error(errors || 'Erro ao criar projeto');
    }
    
    throw new Error(errorData.detail || `Erro HTTP ${response.status}`);
  }
  
  const createdProject = await response.json();
  console.log('✅ Projeto criado com sucesso:', createdProject);
  
  return createdProject;
}

export async function createActivity(data: any, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/atividades/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function getActivities(projectId: string, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/atividades/?project=${projectId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createCost(data: any, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/custos/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function uploadFieldPhoto(formData: FormData, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/fotos/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Não adicionar Content-Type para FormData - browser adiciona automaticamente
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}
