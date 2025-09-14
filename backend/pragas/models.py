from django.db import models
from users.models import User

class Cultura(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    nome_cientifico = models.CharField(max_length=200, blank=True)
    descricao = models.TextField(blank=True)
    epoca_plantio = models.CharField(max_length=200, blank=True)
    tempo_colheita = models.IntegerField(help_text="Dias até colheita", null=True, blank=True)
    
    def __str__(self):
        return self.nome

class TipoPraga(models.Model):
    nome = models.CharField(max_length=100)
    nome_cientifico = models.CharField(max_length=200, blank=True)
    tipo = models.CharField(
        max_length=20,
        choices=[
            ('inseto', 'Inseto'),
            ('fungo', 'Fungo'),
            ('bacteria', 'Bactéria'),
            ('virus', 'Vírus'),
            ('nematoide', 'Nematóide'),
            ('erva_daninha', 'Erva Daninha'),
        ]
    )
    descricao = models.TextField()
    sintomas = models.TextField()
    culturas_afetadas = models.ManyToManyField(Cultura)
    
    def __str__(self):
        return f"{self.nome} ({self.get_tipo_display()})"

class MetodoControle(models.Model):
    praga = models.ForeignKey(TipoPraga, on_delete=models.CASCADE, related_name='metodos_controle')
    tipo_controle = models.CharField(
        max_length=20,
        choices=[
            ('biologico', 'Controle Biológico'),
            ('quimico', 'Controle Químico'),
            ('cultural', 'Controle Cultural'),
            ('mecanico', 'Controle Mecânico'),
            ('integrado', 'Maneio Integrado'),
        ]
    )
    descricao = models.TextField()
    produtos_recomendados = models.TextField(blank=True)
    custo_estimado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    eficacia = models.IntegerField(help_text="Eficácia de 1-10", null=True, blank=True)
    
    def __str__(self):
        return f"{self.praga.nome} - {self.get_tipo_controle_display()}"

class DeteccaoPraga(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='deteccoes_pragas/')
    cultura = models.ForeignKey(Cultura, on_delete=models.SET_NULL, null=True)
    resultado_ia = models.JSONField(blank=True, null=True)
    praga_detectada = models.ForeignKey(TipoPraga, on_delete=models.SET_NULL, null=True, blank=True)
    confianca_deteccao = models.FloatField(null=True, blank=True)
    localizacao = models.CharField(max_length=200, blank=True)
    observacoes_usuario = models.TextField(blank=True)
    verificado_por_especialista = models.BooleanField(default=False)
    especialista = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='verificacoes_praga'
    )
    data_deteccao = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Detecção {self.id} - {self.usuario.username}"

class RelatorioOcorrencia(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    praga = models.ForeignKey(TipoPraga, on_delete=models.CASCADE)
    cultura = models.ForeignKey(Cultura, on_delete=models.CASCADE)
    localizacao = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    nivel_infestacao = models.CharField(
        max_length=10,
        choices=[
            ('baixo', 'Baixo'),
            ('medio', 'Médio'),
            ('alto', 'Alto'),
            ('severo', 'Severo'),
        ]
    )
    area_afetada = models.FloatField(help_text="Área em hectares")
    data_primeira_observacao = models.DateField()
    descricao = models.TextField()
    fotos = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('ativo', 'Ativo'),
            ('controlado', 'Controlado'),
            ('resolvido', 'Resolvido'),
        ],
        default='ativo'
    )
    data_relatorio = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.praga.nome} - {self.localizacao} ({self.nivel_infestacao})"
