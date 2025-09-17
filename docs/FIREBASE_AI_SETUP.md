# Firebase AI Logic - Configuração

## Configuração do Firebase AI Logic

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env.local` (frontend) e `.env` (backend) e configure:

```bash
# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_USE_BACKEND_PROXY=false  # true para usar proxy backend

# Backend (.env)
FIREBASE_PROJECT_ID=lura-ai
VERTEX_AI_LOCATION=us-central1
FIREBASE_AI_DEV_MOCK=false  # true para desenvolvimento local
AI_USE_BACKEND_PROXY=true   # habilitar endpoints de proxy
```

### 2. Desenvolvimento Local

Para desenvolvimento local sem acesso aos modelos do Vertex AI:

1. Ative o modo mock no backend:
```bash
FIREBASE_AI_DEV_MOCK=true
```

2. Use o cliente direto no frontend (recomendado para prototipagem):
```bash
NEXT_PUBLIC_USE_BACKEND_PROXY=false
```

### 3. Produção Segura

Para ambiente de produção, recomendamos:

1. **Habilitar Firebase App Check**
   - Configure no Console Firebase
   - Ative validação no backend: `FIREBASE_APP_CHECK_ENABLED=true`
   - Passe token no frontend: header `X-Firebase-AppCheck`

2. **Usar Proxy Backend**
   - Ative: `NEXT_PUBLIC_USE_BACKEND_PROXY=true`
   - Configure rate limiting no backend
   - Valide App Check nos endpoints

3. **Configurar Credenciais**
   - Use arquivo JSON de service account no backend
   - Local: `backend/firebase/credentials/lura-ai-firebase-adminsdk.json`
   - Ou configure via variáveis de ambiente

### 4. Rate Limiting

O backend implementa rate limiting por usuário:

- `/api/proxy/generate/`: 30 requisições/minuto
- `/api/proxy/chat/`: 20 requisições/minuto

Configure os limites em `views.py`:
```python
@rate_limit("ai_generate", limit=30, period=60)
@rate_limit("ai_chat", limit=20, period=60)
```

### 5. Exemplos de Uso

#### Frontend Direto (Desenvolvimento)
```typescript
// Usar Firebase AI Logic diretamente
const result = await aiService.generateText("Sua pergunta aqui");
const chat = await aiService.chatWithContext(messages);
```

#### Via Proxy Backend (Produção)
```typescript
// Usar proxy backend seguro
const result = await fetch('/api/proxy/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Firebase-AppCheck': token // Requerido em produção
  },
  body: JSON.stringify({ prompt: "Sua pergunta" })
});
```

### 6. Troubleshooting

1. **Erro "Vertex AI não disponível"**
   - Verifique configuração do Firebase
   - Ative `FIREBASE_AI_DEV_MOCK=true` para desenvolvimento

2. **Erro de App Check**
   - Verifique token no frontend
   - Confirme configuração no Firebase Console

3. **Rate Limit Excedido**
   - Aumente limites em `views.py` se necessário
   - Implemente cache client-side

4. **Acesso Negado aos Modelos**
   - Solicite acesso aos modelos no GCP
   - Use mock durante aprovação