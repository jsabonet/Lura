from django.db import models
from users.models import User

class TipoNotificacao(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    template_sms = models.TextField(blank=True)
    template_whatsapp = models.TextField(blank=True)
    template_email = models.TextField(blank=True)
    template_push = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nome

class Notificacao(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('enviada', 'Enviada'),
        ('falhada', 'Falhada'),
        ('entregue', 'Entregue'),
        ('lida', 'Lida'),
    ]
    
    CANAL_CHOICES = [
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
        ('push', 'Push Notification'),
        ('app', 'In-App'),
    ]
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoNotificacao, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    canal = models.CharField(max_length=20, choices=CANAL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    prioridade = models.CharField(
        max_length=20,
        choices=[
            ('baixa', 'Baixa'),
            ('normal', 'Normal'),
            ('alta', 'Alta'),
            ('urgente', 'Urgente'),
        ],
        default='normal'
    )
    agendada_para = models.DateTimeField(null=True, blank=True)
    tentativas_envio = models.IntegerField(default=0)
    ultima_tentativa = models.DateTimeField(null=True, blank=True)
    data_envio = models.DateTimeField(null=True, blank=True)
    data_entrega = models.DateTimeField(null=True, blank=True)
    data_leitura = models.DateTimeField(null=True, blank=True)
    erro_envio = models.TextField(blank=True)
    metadados = models.JSONField(default=dict, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-data_criacao']
    
    def __str__(self):
        return f"{self.titulo} - {self.usuario.username} ({self.canal})"

class PreferenciaNotificacao(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferencias_notificacao')
    receber_clima = models.BooleanField(default=True)
    receber_pragas = models.BooleanField(default=True)
    receber_mercado = models.BooleanField(default=True)
    receber_recomendacoes = models.BooleanField(default=True)
    receber_alertas_urgentes = models.BooleanField(default=True)
    
    # Horários preferenciais
    horario_inicio = models.TimeField(default='07:00')
    horario_fim = models.TimeField(default='19:00')
    
    # Canais preferenciais por tipo
    canal_clima = models.CharField(max_length=20, choices=Notificacao.CANAL_CHOICES, default='sms')
    canal_pragas = models.CharField(max_length=20, choices=Notificacao.CANAL_CHOICES, default='sms')
    canal_mercado = models.CharField(max_length=20, choices=Notificacao.CANAL_CHOICES, default='sms')
    canal_recomendacoes = models.CharField(max_length=20, choices=Notificacao.CANAL_CHOICES, default='app')
    
    # Frequência
    frequencia_clima = models.CharField(
        max_length=20,
        choices=[
            ('diaria', 'Diária'),
            ('semanal', 'Semanal'),
            ('importantes', 'Apenas Importantes'),
        ],
        default='importantes'
    )
    
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Preferências de {self.usuario.username}"

class LogEnvio(models.Model):
    notificacao = models.ForeignKey(Notificacao, on_delete=models.CASCADE, related_name='logs_envio')
    tentativa = models.IntegerField()
    status_tentativa = models.CharField(max_length=20)
    resposta_api = models.TextField(blank=True)
    codigo_resposta = models.CharField(max_length=10, blank=True)
    tempo_resposta = models.FloatField(null=True, blank=True)
    data_tentativa = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Log {self.notificacao.id} - Tentativa {self.tentativa}"

class CampanhaNotificacao(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    tipo = models.ForeignKey(TipoNotificacao, on_delete=models.CASCADE)
    titulo_template = models.CharField(max_length=200)
    conteudo_template = models.TextField()
    canais = models.JSONField(default=list)
    filtros_usuario = models.JSONField(default=dict, blank=True)
    data_agendamento = models.DateTimeField(null=True, blank=True)
    ativa = models.BooleanField(default=False)
    usuarios_alvo = models.ManyToManyField(User, blank=True)
    total_envios = models.IntegerField(default=0)
    total_sucessos = models.IntegerField(default=0)
    total_falhas = models.IntegerField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_execucao = models.DateTimeField(null=True, blank=True)
    criada_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='campanhas_criadas')
    
    def __str__(self):
        return self.nome
