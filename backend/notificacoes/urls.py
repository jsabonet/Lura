from django.urls import path
from . import views
from .api_views import (
    enviar_notificacao_view,
    listar_notificacoes_view,
    marcar_lida_view,
    teste_twilio_view,
    alertas_inteligentes_view,
    AlertSubscriptionListCreateView,
    AlertSubscriptionDetailView
)

app_name = 'notificacoes'

urlpatterns = [
    path('enviar/', enviar_notificacao_view, name='enviar-notificacao'),
    path('listar/', listar_notificacoes_view, name='listar-notificacoes'),
    path('marcar-lida/<int:notificacao_id>/', marcar_lida_view, name='marcar-lida'),
    path('teste-twilio/', teste_twilio_view, name='teste-twilio'),
    
    # Novo endpoint de alertas inteligentes
    path('alertas-inteligentes/', alertas_inteligentes_view, name='alertas-inteligentes'),
    
    # Alert Subscriptions endpoints
    path('assinaturas/', AlertSubscriptionListCreateView.as_view(), name='alert-subscriptions'),
    path('assinaturas/<int:pk>/', AlertSubscriptionDetailView.as_view(), name='alert-subscription-detail'),
]
