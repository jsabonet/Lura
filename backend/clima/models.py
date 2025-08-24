from django.db import models
from users.models import User

class PrevisaoClimatica(models.Model):
    localizacao = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    data_previsao = models.DateField()
    temperatura_min = models.FloatField()
    temperatura_max = models.FloatField()
    umidade = models.IntegerField()
    precipitacao = models.FloatField(default=0.0)
    velocidade_vento = models.FloatField()
    condicao_clima = models.CharField(max_length=100)
    descricao = models.TextField()
    fonte_dados = models.CharField(max_length=50, default='OpenWeather')
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['localizacao', 'data_previsao']
        ordering = ['data_previsao']
    
    def __str__(self):
        return f"{self.localizacao} - {self.data_previsao}"

class AlertaClimatico(models.Model):
    TIPO_ALERTA_CHOICES = [
        ('chuva_forte', 'Chuva Forte'),
        ('seca', 'Seca'),
        ('tempestade', 'Tempestade'),
        ('ciclone', 'Ciclone'),
        ('geada', 'Geada'),
        ('calor_extremo', 'Calor Extremo'),
    ]
    
    NIVEL_CHOICES = [
        ('baixo', 'Baixo'),
        ('medio', 'Médio'),
        ('alto', 'Alto'),
        ('critico', 'Crítico'),
    ]
    
    tipo_alerta = models.CharField(max_length=20, choices=TIPO_ALERTA_CHOICES)
    nivel = models.CharField(max_length=10, choices=NIVEL_CHOICES)
    localizacao = models.CharField(max_length=200)
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField()
    ativo = models.BooleanField(default=True)
    usuarios_notificados = models.ManyToManyField(User, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_tipo_alerta_display()} - {self.nivel} - {self.localizacao}"

class HistoricoClima(models.Model):
    localizacao = models.CharField(max_length=200)
    data = models.DateField()
    temperatura_media = models.FloatField()
    precipitacao_total = models.FloatField()
    umidade_media = models.IntegerField()
    fonte_dados = models.CharField(max_length=50)
    data_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['localizacao', 'data']
        ordering = ['-data']
    
    def __str__(self):
        return f"{self.localizacao} - {self.data}"
