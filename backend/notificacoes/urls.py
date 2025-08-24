from django.urls import path
from . import views
from .api_views import (
    enviar_notificacao_view,
    listar_notificacoes_view,
    marcar_lida_view,
    teste_twilio_view,
    alertas_inteligentes_view
)

app_name = 'notificacoes'

urlpatterns = [
    path('enviar/', enviar_notificacao_view, name='enviar-notificacao'),
    path('listar/', listar_notificacoes_view, name='listar-notificacoes'),
    path('marcar-lida/<int:notificacao_id>/', marcar_lida_view, name='marcar-lida'),
    path('teste-twilio/', teste_twilio_view, name='teste-twilio'),
    
    # Novo endpoint de alertas inteligentes
    path('alertas-inteligentes/', alertas_inteligentes_view, name='alertas-inteligentes'),
]
