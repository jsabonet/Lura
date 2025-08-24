from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    TIPO_CHOICES = [
        ('agricultor', 'Agricultor'),
        ('tecnico', 'Técnico Agrícola'),
        ('admin', 'Administrador'),
    ]
    
    telefone = models.CharField(max_length=20, blank=True, null=True)
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_CHOICES, default='agricultor')
    localizacao = models.CharField(max_length=200, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    distrito = models.CharField(max_length=100, blank=True, null=True)
    culturas_interesse = models.JSONField(default=list, blank=True)
    receber_sms = models.BooleanField(default=True)
    receber_whatsapp = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_tipo_usuario_display()}"

class PerfilAgricultor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_agricultor')
    tamanho_propriedade = models.FloatField(help_text="Tamanho em hectares", null=True, blank=True)
    tipo_agricultura = models.CharField(
        max_length=50,
        choices=[
            ('familiar', 'Agricultura Familiar'),
            ('comercial', 'Agricultura Comercial'),
            ('subsistencia', 'Agricultura de Subsistência'),
        ],
        default='familiar'
    )
    experiencia_anos = models.IntegerField(null=True, blank=True)
    tem_irrigacao = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Perfil de {self.user.username}"
