from rest_framework import serializers
from .models import AlertSubscription

class AlertSubscriptionSerializer(serializers.ModelSerializer):
    # Tornar campos opcionais para permitir atualizações parciais
    cultura = serializers.CharField(max_length=100, required=False)
    regiao = serializers.CharField(max_length=100, required=False)
    canal = serializers.CharField(max_length=20, required=False)
    
    class Meta:
        model = AlertSubscription
        fields = ['id', 'cultura', 'regiao', 'canal', 'ativo', 'data_criacao']
        read_only_fields = ['id', 'data_criacao']
    
    def create(self, validated_data):
        # Para criação, campos são obrigatórios
        required_fields = ['cultura', 'regiao']
        for field in required_fields:
            if field not in validated_data:
                raise serializers.ValidationError({field: 'Este campo é obrigatório.'})
        
        # Adiciona o utilizador do request
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)
