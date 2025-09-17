# 🤖 Firebase AI Logic - Integração Completa
## Lura Farm - Inteligência Artificial Agrícola

### 📋 Visão Geral
Este documento apresenta a integração completa do Firebase AI Logic (Vertex AI) no aplicativo Lura Farm, fornecendo capacidades de IA para agricultura inteligente.

---

## 🚀 Funcionalidades Implementadas

### ✅ Backend (Django)
- **Firebase Admin SDK**: Integração completa com autenticação e configuração
- **Vertex AI Service**: Serviços para Gemini Pro e outros modelos
- **API REST Completa**: 8 endpoints especializados
- **Modelos Django**: Conversas, mensagens, estatísticas e feedback
- **Sistema de Logs**: Rastreamento de uso e performance

### ✅ Frontend (Next.js + TypeScript)
- **Firebase SDK Web**: Configuração client-side
- **Componentes React**: Chat AI e análise de pragas
- **Serviços TypeScript**: Abstração para APIs AI
- **Interface Responsiva**: Design moderno e intuitivo
- **Página Demo**: Demonstração completa das funcionalidades

---

## 📁 Estrutura de Arquivos

```
Lura/
├── backend/
│   ├── ai/                          # App Django AI
│   │   ├── models.py               # Modelos de dados AI
│   │   ├── views.py                # API endpoints
│   │   ├── serializers.py          # Serializers REST
│   │   ├── urls.py                 # URLs da API
│   │   └── admin.py                # Django Admin
│   ├── firebase/                    # Módulo Firebase
│   │   ├── config.py               # Configuração Firebase
│   │   ├── ai_service.py           # Serviços Vertex AI
│   │   └── credentials/            # Credenciais (não commitadas)
│   ├── requirements.txt             # Dependências atualizadas
│   └── test_firebase_ai.py         # Script de teste

├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.ts         # Config Firebase client
│   │   ├── services/
│   │   │   └── aiService.ts        # Serviços AI frontend
│   │   ├── components/AI/
│   │   │   ├── AIChat.tsx          # Componente de chat
│   │   │   ├── PestAnalysis.tsx    # Análise de pragas
│   │   │   └── index.ts            # Exports
│   │   └── pages/
│   │       └── ai-demo.tsx         # Página de demonstração
│   ├── package.json                # Dependências atualizadas
│   └── .env.local.example          # Exemplo de configuração

├── FIREBASE_AI_SETUP_GUIDE.md      # Guia de configuração
├── FIREBASE_SECURITY_GUIDE.md      # Guia de segurança
└── README_AI_INTEGRATION.md        # Este documento
```

---

## 🔧 Configuração Rápida

### 1. Firebase Console
```bash
# 1. Criar projeto 'lura-ai' no Firebase Console
# 2. Ativar Authentication e Vertex AI
# 3. Registrar app web
# 4. Baixar credenciais service account
```

### 2. Backend Setup
```bash
cd backend

# Instalar dependências
pip install firebase-admin google-cloud-aiplatform

# Configurar credenciais (método 1 - arquivo)
mkdir -p firebase/credentials
# Copiar lura-ai-firebase-adminsdk.json para firebase/credentials/

# OU Configurar variáveis de ambiente (método 2 - recomendado)
# Adicionar no .env:
FIREBASE_PROJECT_ID=lura-ai
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@lura-ai.iam.gserviceaccount.com
# ... outras variáveis

# Migrar banco de dados
python manage.py makemigrations ai
python manage.py migrate

# Testar integração
python test_firebase_ai.py
```

### 3. Frontend Setup
```bash
cd frontend

# Instalar Firebase SDK
npm install firebase

# Configurar variáveis (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lura-ai
# ... outras variáveis

# Iniciar desenvolvimento
npm run dev

# Acessar demo: http://localhost:3000/ai-demo
```

---

## 🎯 API Endpoints

### Base URL: `/api/ai/`

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/status/` | GET | Status do serviço AI |
| `/generate/` | POST | Geração de texto simples |
| `/chat/` | POST | Chat com contexto |
| `/agriculture/` | POST | Assistente agrícola especializado |
| `/pest-analysis/` | POST | Análise de pragas e doenças |
| `/conversations/` | GET | Listar conversas do usuário |
| `/conversations/{id}/` | GET | Detalhes de uma conversa |
| `/feedback/` | POST | Feedback sobre respostas |
| `/usage/` | GET | Estatísticas de uso |

### Exemplos de Uso

#### 1. Geração de Texto
```bash
curl -X POST http://localhost:8000/api/ai/generate/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explique agricultura sustentável",
    "model": "gemini-pro",
    "temperature": 0.7
  }'
```

#### 2. Assistente Agrícola
```bash
curl -X POST http://localhost:8000/api/ai/agriculture/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Quando plantar milho em Moçambique?",
    "context": {
      "location": "Maputo",
      "season": "Verão"
    }
  }'
```

#### 3. Análise de Pragas
```bash
curl -X POST http://localhost:8000/api/ai/pest-analysis/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Folhas amarelas com manchas marrons",
    "crop_type": "Tomate",
    "symptoms": ["folhas amareladas", "manchas marrons"]
  }'
```

---

## 🎨 Componentes Frontend

### 1. AIChat Component
```typescript
import { AIChat } from '@/components/AI';

// Chat geral
<AIChat 
  type="general"
  placeholder="Faça uma pergunta..."
  onResponse={(response) => console.log(response)}
/>

// Assistente agrícola
<AIChat 
  type="agriculture"
  placeholder="Pergunte sobre agricultura..."
/>
```

### 2. PestAnalysis Component
```typescript
import { PestAnalysis } from '@/components/AI';

<PestAnalysis 
  onAnalysisComplete={(analysis) => {
    console.log('Análise:', analysis);
  }}
/>
```

### 3. Uso Direto do Serviço
```typescript
import { aiService } from '@/services/aiService';

// Geração de texto
const response = await aiService.generateText('Sua pergunta');

// Assistente agrícola
const advice = await aiService.getAgricultureAdvice(
  'Como melhorar a produtividade?',
  { crop: 'Milho', location: 'Maputo' }
);

// Análise de pragas
const analysis = await aiService.analyzePestDisease(
  'Sintomas observados...',
  'Tomate',
  ['folhas amarelas']
);
```

---

## 📊 Modelos de Dados

### AIConversation
- Armazena conversas completas
- Tipos: general, agriculture, pest_analysis
- Rastreamento de usuário e timestamps

### AIMessage
- Mensagens individuais (user/assistant)
- Metadados de uso (tokens, tempo)
- Conteúdo completo preservado

### AIUsageStats
- Estatísticas diárias por usuário
- Contadores por tipo de request
- Uso de tokens e tempo de processamento

### AIFeedback
- Avaliações das respostas (1-5 estrelas)
- Flags de utilidade e precisão
- Comentários dos usuários

---

## 🔐 Segurança

### Autenticação
- JWT obrigatório para todas as APIs
- Isolamento por usuário (user.id)
- Rate limiting recomendado

### Credenciais
- **Desenvolvimento**: Arquivo JSON local
- **Produção**: Variáveis de ambiente
- **Nunca commitar** arquivos de credencial

### Validação
- Sanitização de inputs
- Limite de caracteres (8000)
- Verificação de conteúdo perigoso

### Monitoramento
- Logs estruturados de uso
- Métricas de performance
- Alertas de abuso

---

## 🚀 Deploy em Produção

### 1. Configuração de Variáveis
```bash
# Servidor de produção
export FIREBASE_PROJECT_ID=lura-ai
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
export FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@lura-ai.iam.gserviceaccount.com
# ... outras variáveis
```

### 2. Otimizações
```python
# settings.py - Produção
DEBUG = False
ALLOWED_HOSTS = ['lurafarm.com']

# Cache para requests AI
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### 3. Monitoramento
```python
# Integrar com Sentry, New Relic, etc.
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    traces_sample_rate=1.0,
)
```

---

## 🧪 Testes

### Backend
```bash
# Executar testes da API
cd backend
python test_firebase_ai.py

# Testes unitários Django
python manage.py test ai
```

### Frontend
```bash
# Executar em desenvolvimento
cd frontend
npm run dev

# Acessar página de demo
# http://localhost:3000/ai-demo
```

### Testes de Integração
1. **Status do Serviço**: Verificar conectividade Firebase
2. **Geração de Texto**: Testar prompts simples
3. **Chat com Contexto**: Conversas multi-turn
4. **Especialistas**: Assistente agrícola e análise de pragas
5. **Persistência**: Salvar conversas e estatísticas

---

## 📈 Métricas e Analytics

### KPIs Importantes
- **Taxa de Sucesso**: % de requests bem-sucedidos
- **Tempo de Resposta**: Latência média das APIs
- **Uso por Usuário**: Requests e tokens por dia
- **Satisfação**: Ratings médios dos usuários
- **Tipos de Consulta**: Distribuição agriculture vs. pest vs. general

### Dashboard Sugerido
```sql
-- Consultas SQL úteis
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    AVG(total_processing_time) as avg_response_time,
    SUM(total_tokens_used) as total_tokens
FROM ai_aiusagestats 
WHERE created_at >= NOW() - INTERVAL 30 DAY
GROUP BY DATE(created_at);
```

---

## 🛠️ Manutenção

### Tarefas Regulares
1. **Rotação de Credenciais**: A cada 90 dias
2. **Limpeza de Dados**: Conversas antigas (LGPD)
3. **Monitoramento de Custos**: Uso de tokens Vertex AI
4. **Backup de Conversas**: Dados importantes
5. **Atualização de Dependências**: Security patches

### Troubleshooting Comum
```bash
# Erro: Firebase não configurado
# Solução: Verificar variáveis de ambiente

# Erro: Quota excedida
# Solução: Aumentar limites no Firebase Console

# Erro: Timeout
# Solução: Verificar conectividade e ajustar timeouts
```

---

## 🎯 Próximos Passos

### Melhorias Sugeridas
1. **Cache Inteligente**: Cache de respostas similares
2. **Streaming**: Respostas em tempo real
3. **Multimodal**: Análise de imagens (Gemini Pro Vision)
4. **RAG**: Integração com base de conhecimento agrícola
5. **Fine-tuning**: Modelos especializados para Moçambique

### Roadmap
- **Fase 1**: ✅ Integração básica (CONCLUÍDA)
- **Fase 2**: 🔄 Otimização e cache (EM ANDAMENTO)
- **Fase 3**: 📅 Funcionalidades avançadas (PLANEJADA)
- **Fase 4**: 📅 IA especializada local (FUTURA)

---

## 📞 Suporte

### Documentação
- 📖 [Firebase AI Setup Guide](./FIREBASE_AI_SETUP_GUIDE.md)
- 🔐 [Firebase Security Guide](./FIREBASE_SECURITY_GUIDE.md)
- 🧪 [Test Script](./backend/test_firebase_ai.py)

### Contato
- **Desenvolvedor**: jsabonet
- **Projeto**: Lura Farm
- **Repositório**: GitHub - jsabonet/Lura

---

**🎉 Parabéns! A integração Firebase AI Logic está completa e pronta para uso em produção.**

> **Importante**: Lembre-se de configurar adequadamente as credenciais e seguir as práticas de segurança antes do deploy em produção.