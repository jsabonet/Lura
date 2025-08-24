from django.urls import path
from . import views
from . import api_views

app_name = 'mercado'

urlpatterns = [
    # URLs básicas - as views serão implementadas depois
    
    # API endpoints (sem api/ prefix pois já está no urls principal)
    path('precos/', api_views.precos_mercado_view, name='precos_mercado'),
    path('tendencias/', api_views.tendencias_mercado_view, name='tendencias_mercado'),
    path('rentabilidade/', api_views.calcular_rentabilidade_view, name='calcular_rentabilidade'),
    path('alertas/', api_views.alertas_mercado_view, name='alertas_mercado'),
]
