# Serializers para API AI
from rest_framework import serializers
from .models import AIConversation, AIMessage, AIFeedback


class AIMessageSerializer(serializers.ModelSerializer):
    """Serializer para mensagens AI"""
    
    class Meta:
        model = AIMessage
        fields = [
            'id', 'role', 'content', 'timestamp', 
            'metadata', 'token_usage', 'processing_time'
        ]
        read_only_fields = ['id', 'timestamp']


class AIConversationSerializer(serializers.ModelSerializer):
    """Serializer para conversas AI"""
    messages = AIMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AIConversation
        fields = [
            'id', 'title', 'conversation_type', 'model_used', 
            'created_at', 'updated_at', 'is_active', 
            'messages', 'message_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()


class AIFeedbackSerializer(serializers.ModelSerializer):
    """Serializer para feedback AI"""
    message_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = AIFeedback
        fields = [
            'id', 'message_id', 'rating', 'comment', 
            'is_helpful', 'is_accurate', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating deve estar entre 1 e 5")
        return value


class TextGenerationSerializer(serializers.Serializer):
    """Serializer para requisições de geração de texto"""
    prompt = serializers.CharField(max_length=8000)
    model = serializers.CharField(max_length=50, default='gemini-pro')
    max_tokens = serializers.IntegerField(default=1024, min_value=1, max_value=4096)
    temperature = serializers.FloatField(default=0.7, min_value=0.0, max_value=2.0)
    
    def validate_prompt(self, value):
        if not value.strip():
            raise serializers.ValidationError("Prompt não pode estar vazio")
        return value.strip()


class ChatRequestSerializer(serializers.Serializer):
    """Serializer para requisições de chat"""
    message = serializers.CharField(max_length=8000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)
    type = serializers.ChoiceField(
        choices=[
            ('general', 'Geral'),
            ('agriculture', 'Agricultura'),
            ('pest_analysis', 'Análise de Pragas'),
            ('weather', 'Clima'),
            ('market', 'Mercado'),
        ],
        default='general'
    )
    
    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Mensagem não pode estar vazia")
        return value.strip()


class AgricultureRequestSerializer(serializers.Serializer):
    """Serializer para consultas agrícolas"""
    query = serializers.CharField(max_length=8000)
    context = serializers.DictField(required=False)
    
    def validate_query(self, value):
        if not value.strip():
            raise serializers.ValidationError("Query não pode estar vazia")
        return value.strip()


class PestAnalysisRequestSerializer(serializers.Serializer):
    """Serializer para análise de pragas"""


class AIProxyGenerateSerializer(serializers.Serializer):
    """Serializer para proxy de geração de texto"""
    prompt = serializers.CharField(max_length=8000)
    model = serializers.CharField(max_length=50, required=False, default='gemini-pro')
    
    def validate_prompt(self, value):
        if not value.strip():
            raise serializers.ValidationError("Prompt não pode estar vazio")
        return value.strip()


class AIProxyChatSerializer(serializers.Serializer):
    """Serializer para proxy de chat"""
    messages = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=8000)
        ),
        min_length=1
    )
    image_data = serializers.CharField(required=False, allow_null=True, allow_blank=True, max_length=5000000)  # 5MB limit for base64 images
    
    def validate_messages(self, value):
        if not value:
            raise serializers.ValidationError("Lista de mensagens não pode estar vazia")
        
        required_fields = {'role', 'content'}
        valid_roles = {'user', 'assistant', 'system'}
        
        for msg in value:
            if not all(field in msg for field in required_fields):
                raise serializers.ValidationError(
                    f"Cada mensagem deve ter os campos: {required_fields}"
                )
            if msg['role'] not in valid_roles:
                raise serializers.ValidationError(
                    f"Role deve ser um de: {valid_roles}"
                )
            if not msg['content'].strip():
                raise serializers.ValidationError(
                    "Conteúdo da mensagem não pode estar vazio"
                )
        
        return value