from rest_framework import serializers
from .models import Project, ProjectDashboard, FieldActivity, FieldPhoto, CostTracking


class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDashboard
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    dashboard = DashboardSerializer(read_only=True)
    
    class Meta:
        model = Project
        exclude = ['usuario']
        read_only_fields = ['created_at']


class FieldActivitySerializer(serializers.ModelSerializer):
    fotos = serializers.SerializerMethodField()
    
    def get_fotos(self, obj):
        return [foto.imagem.url for foto in obj.fotos.all()]
    
    class Meta:
        model = FieldActivity
        fields = '__all__'


class CostTrackingSerializer(serializers.ModelSerializer):
    variacao_percent = serializers.SerializerMethodField()
    
    def get_variacao_percent(self, obj):
        if obj.valor_orcado == 0:
            return 0
        return ((obj.valor_real - obj.valor_orcado) / obj.valor_orcado) * 100
    
    class Meta:
        model = CostTracking
        fields = '__all__'
