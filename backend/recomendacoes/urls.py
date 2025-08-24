from django.urls import path
from .api_views import chatbot_view, recomendacoes_gerais_view, gerar_resposta_contextual_avancada_view

app_name = 'recomendacoes'

urlpatterns = [
    path('chatbot/', chatbot_view, name='chatbot'),
    path('gerar-resposta/', gerar_resposta_contextual_avancada_view, name='gerar_resposta_contextual'),
    path('', recomendacoes_gerais_view, name='recomendacoes_gerais'),
]
