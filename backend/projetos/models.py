from django.db import models
from django.conf import settings


class Project(models.Model):
    """Projeto agrícola (ex: Milho 2025)"""
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    cultura = models.CharField(max_length=100)  # Milho, Tomate, etc
    area_hectares = models.DecimalField(max_digits=10, decimal_places=2)
    data_plantio = models.DateField()
    data_colheita_estimada = models.DateField()
    orcamento_total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('planejamento', 'Planejamento'),
        ('ativo', 'Em Andamento'),
        ('colhido', 'Colhido'),
        ('vendido', 'Vendido')
    ], default='planejamento')
    localizacao_gps = models.CharField(max_length=100, blank=True)
    foto_capa = models.ImageField(upload_to='projetos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nome} - {self.cultura}"


class ProjectDashboard(models.Model):
    """Dashboard dinâmico do projeto"""
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='dashboard')
    fase_atual = models.CharField(max_length=50)  # plantio, vegetativo, maturacao, colheita
    progresso_percent = models.IntegerField(default=0)  # 0-100
    dias_decorridos = models.IntegerField(default=0)
    dias_restantes = models.IntegerField(default=0)
    saude_score = models.FloatField(default=0)  # 0-100 (calculado por IA)
    rendimento_estimado = models.FloatField(default=0)  # kg
    alertas_json = models.JSONField(default=list)  # Lista de alertas ativos
    updated_at = models.DateTimeField(auto_now=True)


class FieldActivity(models.Model):
    """Diário de campo - cada registro"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='atividades')
    tipo = models.CharField(max_length=50, choices=[
        ('plantio', 'Plantio'),
        ('adubo', 'Adubação'),
        ('defensivo', 'Aplicação Defensivo'),
        ('capina', 'Capina'),
        ('irrigacao', 'Irrigação'),
        ('inspecao', 'Inspeção'),
        ('colheita', 'Colheita'),
        ('outro', 'Outro')
    ])
    descricao = models.TextField()
    data = models.DateField()
    custo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nota_voz = models.FileField(upload_to='notas_voz/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data', '-created_at']


class FieldPhoto(models.Model):
    """Fotos do campo com análise IA"""
    atividade = models.ForeignKey(FieldActivity, on_delete=models.CASCADE, related_name='fotos')
    imagem = models.ImageField(upload_to='campo_fotos/')
    analise_ia_json = models.JSONField(default=dict)  # {altura_cm, saude, pragas_detectadas}
    gps_coords = models.CharField(max_length=100, blank=True)
    data_captura = models.DateTimeField(auto_now_add=True)


class CostTracking(models.Model):
    """Controle financeiro"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='custos')
    categoria = models.CharField(max_length=50, choices=[
        ('insumo', 'Insumos'),
        ('mao_obra', 'Mão de Obra'),
        ('maquina', 'Maquinário'),
        ('transporte', 'Transporte'),
        ('outro', 'Outro')
    ])
    descricao = models.CharField(max_length=200)
    valor_orcado = models.DecimalField(max_digits=10, decimal_places=2)
    valor_real = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    data = models.DateField()
    nota_fiscal = models.ImageField(upload_to='notas_fiscais/', null=True, blank=True)
