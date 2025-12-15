from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, FieldActivityViewSet

router = DefaultRouter()
router.register('', ProjectViewSet, basename='project')  # /api/projetos/
router.register('atividades', FieldActivityViewSet, basename='activity')  # /api/projetos/atividades/

urlpatterns = [
    path('', include(router.urls)),
]
