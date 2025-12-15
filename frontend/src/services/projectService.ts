import { Project, ProjectDashboardResponse } from '@/types/project';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getProjects(token: string): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/api/projetos/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
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
  const response = await fetch(`${API_BASE}/api/projetos/`, {
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
