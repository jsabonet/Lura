from django.urls import path
from .views import (
    PrevisaoClimaticaListView,
    obter_clima_atual,
    AlertaClimaticoListView,
    HistoricoClimaListView
)
from .test_views import clima_atual_view, alertas_climaticos_view, previsao_tempo_view

app_name = 'clima'

urlpatterns = [
    path('previsao/', previsao_tempo_view, name='previsao'),
    path('atual/', clima_atual_view, name='clima_atual'),
    path('alertas/', alertas_climaticos_view, name='alertas'),
    path('historico/', HistoricoClimaListView.as_view(), name='historico'),
]
