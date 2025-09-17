# Firebase Configuration - Backend
# Configuração do Firebase Admin SDK para uso server-side

import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings
from decouple import config

# Instância global do Firebase App
firebase_app = None

def initialize_firebase():
    """
    Inicializa o Firebase Admin SDK usando variáveis de ambiente ou arquivo de credencial
    """
    global firebase_app
    
    if firebase_app:
        return firebase_app
    
    try:
        # Método 1: Usar variáveis de ambiente (recomendado para produção)
        if config('FIREBASE_PRIVATE_KEY', default=None):
            service_account_info = {
                "type": "service_account",
                "project_id": config('FIREBASE_PROJECT_ID'),
                "private_key_id": config('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": config('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": config('FIREBASE_CLIENT_EMAIL'),
                "client_id": config('FIREBASE_CLIENT_ID'),
                "auth_uri": config('FIREBASE_AUTH_URI', default="https://accounts.google.com/o/oauth2/auth"),
                "token_uri": config('FIREBASE_TOKEN_URI', default="https://oauth2.googleapis.com/token"),
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{config('FIREBASE_CLIENT_EMAIL')}"
            }
            
            cred = credentials.Certificate(service_account_info)
        
        # Método 2: Usar arquivo de credencial (desenvolvimento)
        else:
            credential_path = os.path.join(
                os.path.dirname(__file__), 
                'credentials', 
                'lura-ai-firebase-adminsdk.json'
            )
            
            if os.path.exists(credential_path):
                cred = credentials.Certificate(credential_path)
            else:
                raise FileNotFoundError(
                    f"Arquivo de credencial não encontrado em {credential_path}. "
                    "Configure as variáveis de ambiente FIREBASE_* ou adicione o arquivo de credencial."
                )
        
        # Inicializar Firebase Admin
        firebase_app = firebase_admin.initialize_app(cred, {
            'projectId': config('FIREBASE_PROJECT_ID', default='lura-ai'),
        })
        
        print("✅ Firebase Admin SDK inicializado com sucesso")
        return firebase_app
        
    except Exception as e:
        print(f"❌ Erro ao inicializar Firebase: {e}")
        firebase_app = None
        return None

# Inicializar Firebase automaticamente na importação
initialize_firebase()

# Exportar instâncias dos serviços
firebase_auth = auth if firebase_app else None

def get_firebase_app():
    """Retorna a instância do Firebase App"""
    return firebase_app

def is_firebase_configured():
    """Verifica se o Firebase está configurado corretamente"""
    return firebase_app is not None