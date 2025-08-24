from rest_framework import serializers
from .models import PrevisaoClimatica, AlertaClimatico, HistoricoClima

class PrevisaoClimaticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrevisaoClimatica
        fields = '__all__'

class AlertaClimaticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertaClimatico
        fields = '__all__'

class HistoricoClimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoClima
        fields = '__all__'
