from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class TriangulationSession(models.Model):
    """Sessão de triangulação para logging e análise"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    accuracy_meters = models.FloatField()
    method = models.CharField(max_length=50, choices=[
        ('gps', 'GPS Nativo'),
        ('cell_triangulation', 'Triangulação Celular'),
        ('ip_fallback', 'Localização por IP'),
    ])
    towers_used = models.IntegerField(null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    processing_time_ms = models.IntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"Triangulação {self.method} - {self.timestamp.strftime('%d/%m/%Y %H:%M:%S')}"


class CellTowerReading(models.Model):
    """Leitura individual de torre celular"""
    session = models.ForeignKey(TriangulationSession, on_delete=models.CASCADE, related_name='towers')
    operator = models.CharField(max_length=50)
    cell_id = models.CharField(max_length=20)
    lac = models.CharField(max_length=20)
    rssi = models.IntegerField()  # Força do sinal em dBm
    distance_meters = models.FloatField()
    
    def __str__(self):
        return f"{self.operator} - Cell {self.cell_id} ({self.rssi}dBm)"
