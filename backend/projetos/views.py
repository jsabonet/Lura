from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Project, ProjectDashboard, FieldActivity, CostTracking
from .serializers import (ProjectSerializer, DashboardSerializer, 
                          FieldActivitySerializer, CostTrackingSerializer)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Project.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        project = serializer.save(usuario=self.request.user)
        # Criar dashboard automático
        ProjectDashboard.objects.create(
            project=project,
            fase_atual='plantio',
            dias_restantes=(project.data_colheita_estimada - project.data_plantio).days
        )
    
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """Endpoint para buscar dashboard completo"""
        project = self.get_object()
        dashboard = project.dashboard
        
        return Response({
            'project': ProjectSerializer(project).data,
            'dashboard': DashboardSerializer(dashboard).data,
            'atividades_recentes': FieldActivitySerializer(
                project.atividades.all()[:5], many=True
            ).data,
            'custos': CostTrackingSerializer(
                project.custos.all(), many=True
            ).data,
        })


class FieldActivityViewSet(viewsets.ModelViewSet):
    serializer_class = FieldActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FieldActivity.objects.filter(
            project__usuario=self.request.user
        )
