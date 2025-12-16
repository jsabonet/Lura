from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Project, ProjectDashboard, FieldActivity, CostTracking, FieldPhoto
from .serializers import (ProjectSerializer, DashboardSerializer, 
                          FieldActivitySerializer, CostTrackingSerializer, FieldPhotoSerializer)


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
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    queryset = FieldActivity.objects.all()
    
    def get_queryset(self):
        return FieldActivity.objects.filter(
            project__usuario=self.request.user
        )
    
    def create(self, request, *args, **kwargs):
        # Validar que o projeto pertence ao usuário
        project_id = request.data.get('project')
        if project_id:
            try:
                Project.objects.get(id=project_id, usuario=request.user)
            except Project.DoesNotExist:
                return Response(
                    {'error': 'Projeto não encontrado ou não pertence ao usuário'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return super().create(request, *args, **kwargs)


class CostTrackingViewSet(viewsets.ModelViewSet):
    serializer_class = CostTrackingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    queryset = CostTracking.objects.all()
    
    def get_queryset(self):
        return CostTracking.objects.filter(
            project__usuario=self.request.user
        )
    
    def create(self, request, *args, **kwargs):
        # Validar que o projeto pertence ao usuário
        project_id = request.data.get('project')
        if project_id:
            try:
                Project.objects.get(id=project_id, usuario=request.user)
            except Project.DoesNotExist:
                return Response(
                    {'error': 'Projeto não encontrado ou não pertence ao usuário'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return super().create(request, *args, **kwargs)


class FieldPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = FieldPhotoSerializer
    permission_classes = [IsAuthenticated]
    queryset = FieldPhoto.objects.all()
    
    def get_queryset(self):
        return FieldPhoto.objects.filter(
            atividade__project__usuario=self.request.user
        )
    
    def create(self, request, *args, **kwargs):
        # Criar atividade automática para a foto
        project_id = request.data.get('project')
        if not project_id:
            return Response({'error': 'project é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se o projeto pertence ao usuário
        try:
            project = Project.objects.get(id=project_id, usuario=request.user)
        except Project.DoesNotExist:
            return Response({'error': 'Projeto não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Criar atividade automática
        atividade = FieldActivity.objects.create(
            project=project,
            tipo='inspecao',
            descricao='Foto do campo adicionada',
            data=timezone.now().date(),
            custo=0
        )
        
        # Preparar dados para o serializer
        data = request.data.copy()
        data['atividade'] = atividade.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
