from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class AIConversation(models.Model):
    """
    Modelo para armazenar conversas com AI
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_conversations')
    title = models.CharField(max_length=200, blank=True)
    conversation_type = models.CharField(
        max_length=50,
        choices=[
            ('general', 'Geral'),
            ('agriculture', 'Agricultura'),
            ('pest_analysis', 'Análise de Pragas'),
            ('weather', 'Clima'),
            ('market', 'Mercado'),
        ],
        default='general'
    )
    model_used = models.CharField(max_length=50, default='gemini-pro')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Conversa AI'
        verbose_name_plural = 'Conversas AI'
    
    def __str__(self):
        return f"{self.user.username} - {self.title or 'Conversa'} ({self.created_at.strftime('%d/%m/%Y')})"


class AIMessage(models.Model):
    """
    Modelo para armazenar mensagens individuais da conversa
    """
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(
        max_length=20,
        choices=[
            ('user', 'Usuário'),
            ('assistant', 'Assistente'),
            ('system', 'Sistema'),
        ]
    )
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    # Metadados opcionais
    metadata = models.JSONField(default=dict, blank=True)
    token_usage = models.JSONField(default=dict, blank=True)
    processing_time = models.FloatField(null=True, blank=True)  # em segundos
    
    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Mensagem AI'
        verbose_name_plural = 'Mensagens AI'
    
    def __str__(self):
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.role}: {preview}"


class AIUsageStats(models.Model):
    """
    Modelo para rastrear estatísticas de uso da AI
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_usage_stats')
    date = models.DateField(default=timezone.now)
    
    # Contadores
    total_requests = models.PositiveIntegerField(default=0)
    total_tokens_used = models.PositiveIntegerField(default=0)
    total_conversations = models.PositiveIntegerField(default=0)
    
    # Por tipo de conversa
    agriculture_requests = models.PositiveIntegerField(default=0)
    pest_analysis_requests = models.PositiveIntegerField(default=0)
    general_requests = models.PositiveIntegerField(default=0)
    
    # Tempo total de processamento
    total_processing_time = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
        verbose_name = 'Estatística de Uso AI'
        verbose_name_plural = 'Estatísticas de Uso AI'
    
    def __str__(self):
        return f"{self.user.username} - {self.date} ({self.total_requests} requests)"


class AIFeedback(models.Model):
    """
    Modelo para feedback sobre respostas da AI
    """
    message = models.OneToOneField(AIMessage, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    rating = models.IntegerField(
        choices=[
            (1, 'Muito Ruim'),
            (2, 'Ruim'),
            (3, 'Regular'),
            (4, 'Bom'),
            (5, 'Excelente'),
        ]
    )
    
    comment = models.TextField(blank=True)
    is_helpful = models.BooleanField()
    is_accurate = models.BooleanField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Feedback AI'
        verbose_name_plural = 'Feedbacks AI'
    
    def __str__(self):
        return f"{self.user.username} - Rating: {self.rating}/5"
