// Firebase Configuration
// Este arquivo configura e inicializa o Firebase SDK para uso no frontend

import { initializeApp } from 'firebase/app';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração Firebase obtida do Console Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('Missing Firebase environment variables:', missingVars);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Se definido, permite que o frontend use um proxy no backend (/api/ai/*)
// Útil para evitar expor certas funcionalidades diretamente do cliente.
export const useBackendProxy = (process.env.NEXT_PUBLIC_USE_BACKEND_PROXY === 'true' || process.env.NEXT_PUBLIC_USE_BACKEND_PROXY === '1');

// Inicializar Vertex AI
let vertexAI: any = null;
let geminiModel: any = null;

// Apenas inicializa Vertex AI no cliente quando NÃO estivermos usando o proxy
if (!useBackendProxy) {
  try {
    vertexAI = getVertexAI(app);
    geminiModel = getGenerativeModel(vertexAI, { model: 'gemini-pro' });
  } catch (error) {
    console.warn('Vertex AI not available on client:', error);
  }
} else {
  console.info('Using backend AI proxy — vertex ai SDK not initialized on client');
}

export { app, vertexAI, geminiModel };

// Função utilitária para verificar se o Firebase está configurado
export const isFirebaseConfigured = () => {
  return missingVars.length === 0;
};

// Função utilitária para verificar se o Vertex AI está disponível
export const isVertexAIAvailable = () => {
  // Se estivermos usando proxy no backend, consideramos Vertex AI "disponível" via proxy
  if (useBackendProxy) return true;
  return vertexAI !== null && geminiModel !== null;
};

/*
Environment variables used by the frontend:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_USE_BACKEND_PROXY (optional) -> 'true' to route AI calls to /api/ai/*

Security notes:
- For production, enable Firebase App Check and pass the App Check token to your backend
  (header 'X-Firebase-AppCheck') if you use a backend proxy. The proxy should validate
  the App Check token server-side before forwarding requests to Vertex AI.
- Prefer using a backend proxy for sensitive or billable model calls to keep credentials
  and quotas under server control.
*/
 