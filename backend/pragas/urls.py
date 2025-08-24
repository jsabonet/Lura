from django.urls import path
from . import views
from .api_views import (
    detectar_praga_view,
    listar_pragas_view, 
    historico_deteccoes_view,
    gerar_recomendacao_view
)

app_name = 'pragas'

urlpatterns = [
    path('detectar/', detectar_praga_view, name='detectar-praga'),
    path('listar/', listar_pragas_view, name='listar-pragas'),
    path('historico/', historico_deteccoes_view, name='historico-deteccoes'),
    path('recomendacao/', gerar_recomendacao_view, name='gerar-recomendacao'),
]
