from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, FieldActivityViewSet, CostTrackingViewSet, FieldPhotoViewSet

router = DefaultRouter()
router.register('', ProjectViewSet, basename='project')  # /api/projetos/
router.register('atividades', FieldActivityViewSet, basename='activity')  # /api/projetos/atividades/
router.register('custos', CostTrackingViewSet, basename='cost')  # /api/projetos/custos/
router.register('fotos', FieldPhotoViewSet, basename='photo')  # /api/projetos/fotos/

urlpatterns = [
    path('', include(router.urls)),
]
