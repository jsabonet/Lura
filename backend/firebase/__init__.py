# Firebase Backend Module
# Este módulo configura e gerencia as integrações Firebase no backend Django

from .config import firebase_app, firebase_auth
from .ai_service import FirebaseAIService

__all__ = [
    'firebase_app',
    'firebase_auth', 
    'FirebaseAIService'
]