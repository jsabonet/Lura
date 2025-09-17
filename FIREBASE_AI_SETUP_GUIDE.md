# Firebase AI Logic - Guia de Configuração Completo

## 1. Configuração do Projeto Firebase Console

### Passo 1: Criar/Configurar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie ou selecione o projeto "lura-ai"
3. Vá para "Project Settings" (ícone de engrenagem)

### Passo 2: Registrar Aplicativo Web
1. Na aba "General", clique em "Add app" > "Web" (ícone `</>`
2. Configure:
   - **App nickname**: `Lura Farm Web`
   - **Hosting**: ☑️ Also set up Firebase Hosting
   - Clique "Register app"

3. **Copie as configurações** mostradas:
```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "lura-ai.firebaseapp.com",
  projectId: "lura-ai",
  storageBucket: "lura-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### Passo 3: Ativar Firebase AI (Vertex AI)
1. No menu lateral, vá para "Build" > "AI"
2. Clique "Get started" 
3. Ative os seguintes modelos:
   - **Gemini Pro** (para texto)
   - **Gemini Pro Vision** (para imagens, se necessário)
4. Aceite os termos e condições

### Passo 4: Configurar Service Account (Backend)
1. Vá para "Project Settings" > "Service accounts"
2. Clique "Generate new private key"
3. Baixe o arquivo JSON (ex: `lura-ai-firebase-adminsdk.json`)
4. **IMPORTANTE**: Mantenha este arquivo seguro!

### Passo 5: Configurar Authentication (Opcional)
1. Vá para "Build" > "Authentication"
2. Clique "Get started"
3. Na aba "Sign-in method", ative:
   - Email/Password
   - Google (recomendado)

## 2. Estrutura de Arquivos Firebase

```
backend/
├── firebase/
│   ├── __init__.py
│   ├── config.py           # Configurações Firebase
│   ├── ai_service.py       # Serviço Vertex AI
│   └── credentials/
│       └── lura-ai-firebase-adminsdk.json
├── requirements.txt        # Atualizado com Firebase libs
└── agroalerta/
    └── settings.py         # Configurações Django atualizadas

frontend/
├── src/
│   ├── config/
│   │   └── firebase.ts     # Configuração Firebase SDK
│   ├── services/
│   │   └── aiService.ts    # Serviços AI Frontend
│   └── components/
│       └── AIChat/         # Componente de chat AI
├── package.json            # Atualizado com Firebase SDK
└── .env.local             # Variáveis ambiente Firebase
```

## 3. Variáveis de Ambiente Necessárias

### Backend (.env)
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=lura-ai
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@lura-ai.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### Frontend (.env.local)
```env
# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lura-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lura-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lura-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## 4. Próximos Passos

1. ✅ Configure o projeto Firebase conforme acima
2. ⏳ Instalar dependências (próximo passo)
3. ⏳ Implementar serviços AI
4. ⏳ Criar componentes frontend
5. ⏳ Configurar segurança e credenciais

## 5. Recursos Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Vertex AI Documentation](https://firebase.google.com/docs/vertex-ai)
- [Firebase Web SDK Guide](https://firebase.google.com/docs/web/setup)
- [Gemini API Documentation](https://ai.google.dev/docs)

---
**⚠️ SEGURANÇA**: Nunca commite arquivos de credenciais para o Git!