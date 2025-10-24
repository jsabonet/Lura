# URLs da API AI
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# URLs da API AI
urlpatterns = [
    # Status do serviço
    path('status/', views.AIStatusView.as_view(), name='ai-status'),
    
    # Endpoints de proxy para Firebase AI Logic
    path('proxy/generate/', views.AIProxyGenerateView.as_view(), name='ai-proxy-generate'),
    path('proxy/chat/', views.AIChatProxyView.as_view(), name='ai-proxy-chat'),
    path('proxy/chat/stream/', views.AIChatStreamView.as_view(), name='ai-proxy-chat-stream'),
    
    # Geração de texto
    path('generate/', views.TextGenerationView.as_view(), name='ai-generate'),
    
    # Chat e conversas
    path('chat/', views.ChatConversationView.as_view(), name='ai-chat'),
    path('conversations/', views.ConversationListView.as_view(), name='ai-conversations'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='ai-conversation-detail'),
    
    # Assistentes especializados
    path('agriculture/', views.AgricultureAssistantView.as_view(), name='ai-agriculture'),
    path('pest-analysis/', views.PestAnalysisView.as_view(), name='ai-pest-analysis'),
    
    # Feedback e estatísticas
    path('feedback/', views.AIFeedbackView.as_view(), name='ai-feedback'),
    path('usage/', views.UsageStatsView.as_view(), name='ai-usage-stats'),
]