# 🎯 LuraFarm: Plano Executivo de Implementação Completo
**Data:** 05 de Dezembro de 2025  
**Status:** Roadmap Técnico Detalhado (Backend + Frontend)  
**Objetivo:** Plataforma Production-Ready em 12 Semanas  
**Stack:** Django 4.2.7 + Next.js 14 + PostgreSQL + Gemini AI

---

## 📋 ÍNDICE DE PROGRESSO

| Fase | Entregas | Status | Semanas | Prioridade |
|------|----------|--------|---------|------------|
| **Fase 1** | Fundação PWA & Navegação | 🔴 Não Iniciado | 1-2 | 🔥 Crítica |
| **Fase 2** | Dashboard Dinâmico (Core) | � Em Progresso | 3-6 | 🔥 Crítica |
| **Fase 3** | Monetização & Marketplace | 🔴 Não Iniciado | 7-9 | ⚡ Alta |
| **Fase 4** | Inteligência & Automação | 🔴 Não Iniciado | 10-11 | ⚡ Alta |
| **Fase 5** | Lançamento & Go-Live | 🔴 Não Iniciado | 12 | 🚀 Launch |

---

# 🏗️ FASE 1: FUNDAÇÃO PWA & NAVEGAÇÃO (Semanas 1-2)

## 1.1. Configuração PWA (Progressive Web App)

### Backend: Nenhuma mudança necessária
*O PWA é puramente frontend.*

### Frontend: `/frontend/`

#### ✅ **Tarefa 1.1.1: Criar Manifest.json**
**Arquivo:** `frontend/public/manifest.json`
```json
{
  "name": "LuraFarm - Assistente Agrícola Inteligente",
  "short_name": "LuraFarm",
  "description": "Seu parceiro digital para agricultura de precisão",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F2027",
  "theme_color": "#00A86B",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**Ação:** Criar os ícones em `/frontend/public/icons/` (usar logo da LuraFarm).

---

#### ✅ **Tarefa 1.1.2: Configurar Service Worker**
**Arquivo:** `frontend/public/sw.js`
```javascript
const CACHE_NAME = 'lurafarm-v1';
const urlsToCache = [
  '/',
  '/campos',
  '/lura',
  '/negocios',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

**Ação:** Registrar o Service Worker no `layout.tsx`.

---

#### ✅ **Tarefa 1.1.3: Meta Tags PWA**
**Arquivo:** `frontend/src/app/layout.tsx`

Adicionar no `<head>`:
```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#00A86B" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

---

#### ✅ **Tarefa 1.1.4: Install Prompt Component**
**Arquivo:** `frontend/src/components/InstallPrompt.tsx`
```tsx
'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setShowPrompt(false);
        setDeferredPrompt(null);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white p-4 rounded-lg shadow-xl z-50">
      <p className="font-bold mb-2">Instalar LuraFarm</p>
      <p className="text-sm mb-3">Adicione à tela inicial para acesso rápido!</p>
      <div className="flex gap-2">
        <button onClick={handleInstall} className="bg-white text-[#00A86B] px-4 py-2 rounded-lg font-bold">
          Instalar
        </button>
        <button onClick={() => setShowPrompt(false)} className="border border-white px-4 py-2 rounded-lg">
          Agora não
        </button>
      </div>
    </div>
  );
}
```

---

## 1.2. Sistema de Navegação (Mobile-First)

### ✅ **Tarefa 1.2.1: Bottom Navigation Component**
**Arquivo:** `frontend/src/components/navigation/BottomNav.tsx`
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sprout, DollarSign } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/campos', icon: Sprout, label: 'Campos' },
    { href: '/negocios', icon: DollarSign, label: 'Negócios' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1B2735] border-t border-[#00A86B] z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#00A86B]' : 'text-gray-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

### ✅ **Tarefa 1.2.2: Lura FAB (Floating Action Button)**
**Arquivo:** `frontend/src/components/navigation/LuraFAB.tsx`
```tsx
'use client';
import Link from 'next/link';
import { Mic } from 'lucide-react';

export default function LuraFAB() {
  return (
    <Link href="/lura">
      <button className="fixed bottom-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#00A86B] to-[#3BB273] rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-[#0F2027] hover:scale-110 transition-transform active:scale-95">
        <Mic size={28} className="text-white" strokeWidth={2.5} />
      </button>
    </Link>
  );
}
```

---

### ✅ **Tarefa 1.2.3: Layout Principal com Navegação**
**Arquivo:** `frontend/src/app/layout.tsx`

Modificar para incluir navegação:
```tsx
import BottomNav from '@/components/navigation/BottomNav';
import LuraFAB from '@/components/navigation/LuraFAB';
import InstallPrompt from '@/components/InstallPrompt';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>{/* Meta tags aqui */}</head>
      <body className="pb-16"> {/* Padding para a bottom nav */}
        {children}
        <BottomNav />
        <LuraFAB />
        <InstallPrompt />
      </body>
    </html>
  );
}
```

---

## 1.3. Rotas Principais (Next.js App Router)

### ✅ **Tarefa 1.3.1: Criar Estrutura de Pastas**
```
frontend/src/app/
├── page.tsx              (Home: "Dia de Hoje")
├── campos/
│   ├── page.tsx          (Lista de Campos)
│   └── [id]/
│       └── page.tsx      (Dashboard do Campo)
├── lura/
│   └── page.tsx          (Chat IA - já existe)
├── negocios/
│   └── page.tsx          (Marketplace + Finanças)
├── novo-projeto/
│   └── page.tsx          (Wizard de Criação)
└── perfil/
    └── page.tsx          (Configurações)
```

---

### ✅ **Tarefa 1.3.2: Página Inicial (Feed)**
**Arquivo:** `frontend/src/app/page.tsx`
```tsx
import WeatherWidget from '@/components/home/WeatherWidget';
import TaskChecklist from '@/components/home/TaskChecklist';
import AlertsCard from '@/components/home/AlertsCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-20">
      <h1 className="text-2xl font-bold text-white mb-4">Bom dia, João!</h1>
      
      <WeatherWidget />
      <AlertsCard />
      <TaskChecklist />
      
      <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-xl">
        <p className="text-[#F2C94C] font-bold text-lg">Sua safra está 85% saudável</p>
        <p className="text-white/70 text-sm">Continue assim para colher em 45 dias</p>
      </div>
    </main>
  );
}
```

**Ação:** Criar os componentes `WeatherWidget`, `TaskChecklist`, `AlertsCard` (podem ser mock inicialmente).

---

---

# 🎯 FASE 2: DASHBOARD DINÂMICO (Semanas 3-6)

## 2.1. Backend - Models Django ✅ CONCLUÍDO

### ✅ **Tarefa 2.1.1: Criar App Django 'projetos'** ✅
**Terminal Backend:**
```bash
cd backend
python manage.py startapp projetos
```

**Adicionar em `backend/lurafarm/settings.py`:**
```python
INSTALLED_APPS = [
    # ... apps existentes
    'projetos',
]
```

---

### ✅ **Tarefa 2.1.2: Models do Dashboard** ✅
**Arquivo:** `backend/projetos/models.py`
```python
from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    """Projeto agrícola (ex: Milho 2025)"""
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    cultura = models.CharField(max_length=100)  # Milho, Tomate, etc
    area_hectares = models.DecimalField(max_digits=10, decimal_places=2)
    data_plantio = models.DateField()
    data_colheita_estimada = models.DateField()
    orcamento_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('planejamento', 'Planejamento'),
        ('ativo', 'Em Andamento'),
        ('colhido', 'Colhido'),
        ('vendido', 'Vendido')
    ], default='planejamento')
    localizacao_gps = models.CharField(max_length=100, blank=True)
    foto_capa = models.ImageField(upload_to='projetos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} - {self.cultura}"


class ProjectDashboard(models.Model):
    """Dashboard dinâmico do projeto"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='dashboard')
    fase_atual = models.CharField(max_length=50)  # plantio, vegetativo, maturacao, colheita
    progresso_percent = models.IntegerField(default=0)  # 0-100
    dias_decorridos = models.IntegerField(default=0)
    dias_restantes = models.IntegerField(default=0)
    saude_score = models.FloatField(default=0)  # 0-100 (calculado por IA)
    rendimento_estimado = models.FloatField(default=0)  # kg
    alertas_json = models.JSONField(default=list)  # Lista de alertas ativos
    updated_at = models.DateTimeField(auto_now=True)


class FieldActivity(models.Model):
    """Diário de campo - cada registro"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='atividades')
    tipo = models.CharField(max_length=50, choices=[
        ('plantio', 'Plantio'),
        ('adubo', 'Adubação'),
        ('defensivo', 'Aplicação Defensivo'),
        ('capina', 'Capina'),
        ('irrigacao', 'Irrigação'),
        ('inspecao', 'Inspeção'),
        ('colheita', 'Colheita'),
        ('outro', 'Outro')
    ])
    descricao = models.TextField()
    data = models.DateField()
    custo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nota_voz = models.FileField(upload_to='notas_voz/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data', '-created_at']


class FieldPhoto(models.Model):
    """Fotos do campo com análise IA"""
    atividade = models.ForeignKey(FieldActivity, on_delete=models.CASCADE, related_name='fotos')
    imagem = models.ImageField(upload_to='campo_fotos/')
    analise_ia_json = models.JSONField(default=dict)  # {altura_cm, saude, pragas_detectadas}
    gps_coords = models.CharField(max_length=100, blank=True)
    data_captura = models.DateTimeField(auto_now_add=True)


class CostTracking(models.Model):
    """Controle financeiro"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='custos')
    categoria = models.CharField(max_length=50, choices=[
        ('insumo', 'Insumos'),
        ('mao_obra', 'Mão de Obra'),
        ('maquina', 'Maquinário'),
        ('transporte', 'Transporte'),
        ('outro', 'Outro')
    ])
    descricao = models.CharField(max_length=200)
    valor_orcado = models.DecimalField(max_digits=10, decimal_places=2)
    valor_real = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    data = models.DateField()
    nota_fiscal = models.ImageField(upload_to='notas_fiscais/', null=True, blank=True)
```

**Ação:** Rodar migrações:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### ✅ **Tarefa 2.1.3: Serializers** ✅
**Arquivo:** `backend/projetos/serializers.py`
```python
from rest_framework import serializers
from .models import Project, ProjectDashboard, FieldActivity, FieldPhoto, CostTracking

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['usuario', 'created_at']

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDashboard
        fields = '__all__'

class FieldActivitySerializer(serializers.ModelSerializer):
    fotos = serializers.SerializerMethodField()
    
    def get_fotos(self, obj):
        return [foto.imagem.url for foto in obj.fotos.all()]
    
    class Meta:
        model = FieldActivity
        fields = '__all__'

class CostTrackingSerializer(serializers.ModelSerializer):
    variacao_percent = serializers.SerializerMethodField()
    
    def get_variacao_percent(self, obj):
        if obj.valor_orcado == 0:
            return 0
        return ((obj.valor_real - obj.valor_orcado) / obj.valor_orcado) * 100
    
    class Meta:
        model = CostTracking
        fields = '__all__'
```

---

### ✅ **Tarefa 2.1.4: Views/API Endpoints** ✅
**Arquivo:** `backend/projetos/views.py`
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Project, ProjectDashboard, FieldActivity, CostTracking
from .serializers import (ProjectSerializer, DashboardSerializer, 
                          FieldActivitySerializer, CostTrackingSerializer)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        project = serializer.save(usuario=self.request.user)
        # Criar dashboard automático
        ProjectDashboard.objects.create(
            project=project,
            fase_atual='plantio',
            dias_restantes=(project.data_colheita_estimada - project.data_plantio).days
        )
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """Endpoint para buscar dashboard completo"""
        project = self.get_object()
        dashboard = project.dashboard
        
        return Response({
            'project': ProjectSerializer(project).data,
            'dashboard': DashboardSerializer(dashboard).data,
            'atividades_recentes': FieldActivitySerializer(
                project.atividades.all()[:5], many=True
            ).data,
            'custos': CostTrackingSerializer(
                project.custos.all(), many=True
            ).data,
        })

class FieldActivityViewSet(viewsets.ModelViewSet):
    serializer_class = FieldActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FieldActivity.objects.filter(
            project__usuario=self.request.user
        )
```

---

### ✅ **Tarefa 2.1.5: URLs do App** ✅
**Arquivo:** `backend/projetos/urls.py`
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, FieldActivityViewSet

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('activities', FieldActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]
```

**Adicionar em `backend/lurafarm/urls.py`:**
```python
urlpatterns = [
    # ... existentes
    path('api/projetos/', include('projetos.urls')),
]
```

---

## 2.2. Frontend - Dashboard UI

### ✅ **Tarefa 2.2.1: Service para API de Projetos** ✅
**Arquivo:** `frontend/src/services/projectService.ts`
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getProjects(token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/projects/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

export async function getProjectDashboard(projectId: string, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/projects/${projectId}/dashboard/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

export async function createActivity(data: any, token: string) {
  const response = await fetch(`${API_BASE}/api/projetos/activities/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

---

### ✅ **Tarefa 2.2.2: Página de Listagem de Campos** ✅
**Arquivo:** `frontend/src/app/campos/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import { getProjects } from '@/services/projectService';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function CamposPage() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    // Assumindo que tem token no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      getProjects(token).then(setProjects);
    }
  }, []);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Meus Campos</h1>
      
      <div className="grid gap-4">
        {projects.map((project: any) => (
          <Link key={project.id} href={`/campos/${project.id}`}>
            <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
              {project.foto_capa && (
                <img src={project.foto_capa} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg">{project.nome}</h3>
                <p className="text-[#F2C94C]">{project.cultura}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-[#00A86B] h-2 rounded-full"
                      style={{ width: `${project.dashboard?.progresso_percent || 0}%` }}
                    />
                  </div>
                  <span className="text-white/70 text-sm">
                    {project.dashboard?.progresso_percent || 0}%
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <Link href="/novo-projeto">
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-[#F2C94C] rounded-full shadow-xl flex items-center justify-center">
          <Plus size={28} className="text-[#0F2027]" strokeWidth={3} />
        </button>
      </Link>
    </main>
  );
}
```

---

### ✅ **Tarefa 2.2.3: Dashboard do Campo (Painel Detalhado)** ✅
**Arquivo:** `frontend/src/app/campos/[id]/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProjectDashboard } from '@/services/projectService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CampoDashboard() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && params.id) {
      getProjectDashboard(params.id as string, token).then(setData);
    }
  }, [params.id]);
  
  if (!data) return <div>Carregando...</div>;
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-24">
      <h1 className="text-2xl font-bold text-white mb-2">{data.project.nome}</h1>
      <p className="text-[#F2C94C] mb-6">{data.project.cultura} - {data.project.area_hectares} ha</p>
      
      {/* Barra de Progresso */}
      <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white">Fase: {data.dashboard.fase_atual}</span>
          <span className="text-[#F2C94C]">{data.dashboard.progresso_percent}%</span>
        </div>
        <div className="bg-white/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[#00A86B] to-[#3BB273] h-3 rounded-full"
            style={{ width: `${data.dashboard.progresso_percent}%` }}
          />
        </div>
        <p className="text-white/70 text-sm mt-2">
          {data.dashboard.dias_restantes} dias restantes até a colheita
        </p>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="diario">Diário</TabsTrigger>
          <TabsTrigger value="galeria">Galeria</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <h3 className="text-white font-bold mb-2">Saúde da Lavoura</h3>
            <div className="text-4xl font-bold text-[#00A86B]">
              {data.dashboard.saude_score}/100
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="diario">
          <div className="space-y-3">
            {data.atividades_recentes.map((ativ: any) => (
              <div key={ativ.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#F2C94C] font-bold">{ativ.tipo}</span>
                    <p className="text-white text-sm mt-1">{ativ.descricao}</p>
                  </div>
                  <span className="text-white/50 text-xs">{ativ.data}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custos">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <h3 className="text-white font-bold mb-4">Orçado vs Real</h3>
            {data.custos.map((custo: any) => (
              <div key={custo.id} className="mb-3 pb-3 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-white">{custo.descricao}</span>
                  <span className={custo.valor_real > custo.valor_orcado ? 'text-red-400' : 'text-[#00A86B]'}>
                    {custo.valor_real} MT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
```

---

## 2.3. Wizard de Novo Projeto ✅ CONCLUÍDO

### ✅ **Tarefa 2.3.1: Wizard Multi-Step** ✅
**Arquivo:** `frontend/src/app/novo-projeto/page.tsx`
```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoProjetoWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cultura: '',
    area_hectares: 0,
    orcamento_total: 0,
    data_plantio: ''
  });
  
  const culturas = [
    { id: 'milho', nome: 'Milho', icon: '🌽' },
    { id: 'tomate', nome: 'Tomate', icon: '🍅' },
    { id: 'feijao', nome: 'Feijão', icon: '🫘' },
  ];
  
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projetos/projects/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        nome: `${formData.cultura} ${new Date().getFullYear()}`,
        data_colheita_estimada: '2026-06-01', // Calcular dinamicamente
      })
    });
    const project = await response.json();
    router.push(`/campos/${project.id}`);
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-2xl font-bold text-white mb-6">Novo Plantio</h1>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className={`flex-1 h-2 rounded ${i <= step ? 'bg-[#00A86B]' : 'bg-white/20'}`} />
          ))}
        </div>
        
        {/* Step 1: Cultura */}
        {step === 1 && (
          <div>
            <h2 className="text-white text-xl mb-4">O que vai plantar?</h2>
            <div className="grid gap-3">
              {culturas.map(cult => (
                <button
                  key={cult.id}
                  onClick={() => {
                    setFormData({...formData, cultura: cult.nome});
                    setStep(2);
                  }}
                  className="bg-white/10 backdrop-blur rounded-xl p-6 text-left hover:bg-white/20 transition"
                >
                  <span className="text-4xl mb-2 block">{cult.icon}</span>
                  <span className="text-white font-bold text-lg">{cult.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 2: Área */}
        {step === 2 && (
          <div>
            <h2 className="text-white text-xl mb-4">Qual o tamanho da área?</h2>
            <input
              type="number"
              placeholder="Hectares"
              className="w-full bg-white/10 text-white rounded-xl p-4 text-lg mb-4"
              onChange={(e) => setFormData({...formData, area_hectares: parseFloat(e.target.value)})}
            />
            <button
              onClick={() => setStep(3)}
              className="w-full bg-[#00A86B] text-white rounded-xl p-4 font-bold"
            >
              Próximo
            </button>
          </div>
        )}
        
        {/* Step 3: Orçamento */}
        {step === 3 && (
          <div>
            <h2 className="text-white text-xl mb-4">Quanto quer investir?</h2>
            <input
              type="number"
              placeholder="Meticais (MT)"
              className="w-full bg-white/10 text-white rounded-xl p-4 text-lg mb-4"
              onChange={(e) => setFormData({...formData, orcamento_total: parseFloat(e.target.value)})}
            />
            <button
              onClick={() => setStep(4)}
              className="w-full bg-[#00A86B] text-white rounded-xl p-4 font-bold"
            >
              Próximo
            </button>
          </div>
        )}
        
        {/* Step 4: Data Plantio */}
        {step === 4 && (
          <div>
            <h2 className="text-white text-xl mb-4">Quando vai plantar?</h2>
            <input
              type="date"
              className="w-full bg-white/10 text-white rounded-xl p-4 text-lg mb-4"
              onChange={(e) => setFormData({...formData, data_plantio: e.target.value})}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold"
            >
              Criar Projeto
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
```

---

---

# 💰 FASE 3: MONETIZAÇÃO & MARKETPLACE (Semanas 7-9)

## 3.1. Sistema de Assinaturas

### ✅ **Tarefa 3.1.1: Models de Subscription (Backend)**
**Arquivo:** `backend/subscriptions/models.py` (criar app novo)
```python
from django.db import models
from django.contrib.auth.models import User

class SubscriptionPlan(models.Model):
    nome = models.CharField(max_length=50)  # Free, Pro, Pro+
    preco_mensal = models.DecimalField(max_digits=10, decimal_places=2)
    limite_projetos = models.IntegerField()
    limite_sms_mes = models.IntegerField()
    marketplace_acesso = models.BooleanField(default=False)
    pdf_completo = models.BooleanField(default=False)

class UserSubscription(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    plano = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    data_inicio = models.DateField(auto_now_add=True)
    data_renovacao = models.DateField()
    ativo = models.BooleanField(default=True)
    sms_usados_mes = models.IntegerField(default=0)
```

### ✅ **Tarefa 3.1.2: Feature Gating Decorator**
**Arquivo:** `backend/subscriptions/decorators.py`
```python
from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def require_plan(plan_level):
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            try:
                sub = request.user.usersubscription
                if sub.plano.nome in ['Pro', 'Pro+'] if plan_level == 'pro' else True:
                    return func(self, request, *args, **kwargs)
                return Response(
                    {'error': 'Upgrade necessário para esta funcionalidade'},
                    status=status.HTTP_403_FORBIDDEN
                )
            except:
                return Response({'error': 'Sem assinatura'}, status=403)
        return wrapper
    return decorator

# Uso:
# @require_plan('pro')
# def export_pdf(self, request):
#     pass
```

---

## 3.2. Marketplace Básico

### ✅ **Tarefa 3.2.1: Model de Anúncio**
**Arquivo:** `backend/marketplace/models.py`
```python
class ProductListing(models.Model):
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey('projetos.Project', on_delete=models.CASCADE)
    produto = models.CharField(max_length=100)  # Milho Branco
    quantidade_kg = models.FloatField()
    preco_por_kg = models.DecimalField(max_digits=10, decimal_places=2)
    qualidade = models.CharField(max_length=100)  # 12% umidade
    data_disponibilidade = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('ativo', 'Ativo'),
        ('vendido', 'Vendido'),
        ('cancelado', 'Cancelado')
    ], default='ativo')
    created_at = models.DateTimeField(auto_now_add=True)

class Offer(models.Model):
    listing = models.ForeignKey(ProductListing, on_delete=models.CASCADE)
    comprador = models.ForeignKey(User, on_delete=models.CASCADE)
    preco_ofertado = models.DecimalField(max_digits=10, decimal_places=2)
    mensagem = models.TextField()
    status = models.CharField(max_length=20, choices=[
        ('pendente', 'Pendente'),
        ('aceita', 'Aceita'),
        ('rejeitada', 'Rejeitada')
    ], default='pendente')
```

---

### ✅ **Tarefa 3.2.2: Página de Negócios (Frontend)**
**Arquivo:** `frontend/src/app/negocios/page.tsx`
```tsx
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NegociosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F2027] to-[#1B2735] p-4 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Negócios</h1>
      
      <Tabs defaultValue="vender">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="vender">Vender</TabsTrigger>
          <TabsTrigger value="financas">Finanças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vender">
          <button className="w-full bg-gradient-to-r from-[#00A86B] to-[#3BB273] text-white rounded-xl p-4 font-bold mb-4">
            + Anunciar Colheita
          </button>
          
          <div className="space-y-3">
            {/* Lista de anúncios */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <h3 className="text-[#F2C94C] font-bold">Milho Branco - 2000kg</h3>
              <p className="text-white/70 text-sm">45 MT/kg</p>
              <p className="text-white/50 text-xs mt-2">3 ofertas recebidas</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="financas">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
            <h3 className="text-white/70 text-sm">Saldo Estimado</h3>
            <div className="text-3xl font-bold text-[#00A86B]">15.450 MT</div>
          </div>
          
          {/* Livro Caixa Simplificado */}
          <div className="space-y-2">
            <div className="bg-white/5 rounded-xl p-3 flex justify-between">
              <span className="text-white">Sementes</span>
              <span className="text-red-400">-1.200 MT</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex justify-between">
              <span className="text-white">Venda Tomate</span>
              <span className="text-[#00A86B]">+8.500 MT</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
```

---

---

# 🔔 FASE 4: INTELIGÊNCIA & AUTOMAÇÃO (Semanas 10-11)

## 4.1. Sistema de Alertas SMS

### ✅ **Tarefa 4.1.1: Background Worker (Celery)**
**Arquivo:** `backend/alerts/tasks.py`
```python
from celery import shared_task
from twilio.rest import Client
from django.conf import settings
from projetos.models import Project
import requests

@shared_task
def check_weather_alerts():
    """Rodar diariamente às 6h"""
    projects = Project.objects.filter(status='ativo')
    
    for project in projects:
        # Buscar clima na API
        weather_data = requests.get(
            f"https://api.openweathermap.org/data/2.5/forecast?lat={project.lat}&lon={project.lon}"
        ).json()
        
        # Verificar chuva forte
        if weather_data['rain'] and weather_data['rain']['3h'] > 30:
            send_sms(
                project.usuario.phone,
                f"⚠️ LuraFarm: Chuva forte prevista para hoje no {project.nome}. Evite aplicações."
            )

@shared_task
def send_sms(phone, message):
    client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
    client.messages.create(
        to=phone,
        from_=settings.TWILIO_PHONE,
        body=message
    )
```

---

## 4.2. Relatório Automático de Safra

### ✅ **Tarefa 4.2.1: Gerador de PDF Final**
**Arquivo:** `backend/projetos/pdf_generator.py`
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

def gerar_relatorio_safra(project):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Título
    p.setFont("Helvetica-Bold", 20)
    p.drawString(100, 750, f"Relatório de Safra: {project.nome}")
    
    # Resumo Financeiro
    p.setFont("Helvetica", 12)
    custos_totais = sum(c.valor_real for c in project.custos.all())
    p.drawString(100, 700, f"Custos Totais: {custos_totais} MT")
    
    # ROI
    roi = ((project.receita_total - custos_totais) / custos_totais) * 100
    p.drawString(100, 680, f"ROI: {roi:.1f}%")
    
    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer
```

---

---

# 🚀 FASE 5: LANÇAMENTO (Semana 12)

## 5.1. Testes & QA

### ✅ **Checklist de Testes**
- [ ] Testar em Android (Chrome) e iPhone (Safari)
- [ ] Testar em rede 3G (simular velocidade lenta)
- [ ] Testar sob sol forte (verificar contraste)
- [ ] Testar em celular com memória baixa (4GB RAM)
- [ ] Teste de upload de 10 imagens simultâneas
- [ ] Teste de carga: 100 usuários simultâneos

---

## 5.2. Deploy Produção

### ✅ **Tarefa 5.2.1: Deploy Backend (Railway/Render)**
**Terminal Backend:**
```bash
# Criar Procfile
echo "web: gunicorn lurafarm.wsgi" > Procfile

# Criar runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
railway up  # ou render deploy
```

---

### ✅ **Tarefa 5.2.2: Deploy Frontend (Vercel)**
**Terminal Frontend:**
```bash
npm install -g vercel
vercel --prod
```

---

### ✅ **Tarefa 5.2.3: Configurar Domínio**
- Comprar domínio `lurafarm.co.mz` ou `.com`
- Apontar DNS para Vercel (frontend)
- Configurar subdomínio `api.lurafarm.com` para backend

---

## 5.3. Launch Checklist Final

- [ ] Criar 3 projetos de exemplo (seed data)
- [ ] Preparar vídeo demo de 60 segundos
- [ ] Criar post no LinkedIn anunciando
- [ ] Enviar link via WhatsApp para 10 agricultores piloto
- [ ] Configurar Google Analytics
- [ ] Configurar Hotjar (heatmap de cliques)

---

# 📊 MÉTRICAS DE SUCESSO (KPIs)

## Semana 1-4:
- 50 usuários cadastrados
- 10 projetos criados
- Taxa de retenção D7: 40%

## Semana 5-8:
- 200 usuários ativos
- 50 projetos em andamento
- 5 assinaturas Pro vendidas

## Semana 9-12:
- 500 usuários totais
- 20 assinaturas pagas (R$ 980/mês MRR)
- 3 vendas pelo marketplace

---

**Status Atual:** Pronto para Iniciar Fase 1 ✅  
**Primeiro Commit:** "feat: configurar PWA e navegação mobile-first"  
**Próximo Milestone:** Bottom Navigation funcional em 2 dias 🎯
