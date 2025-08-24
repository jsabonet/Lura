from django.db import models
from users.models import User
from pragas.models import Cultura

class Mercado(models.Model):
    nome = models.CharField(max_length=200)
    localizacao = models.CharField(max_length=200)
    provincia = models.CharField(max_length=100)
    distrito = models.CharField(max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    tipo_mercado = models.CharField(
        max_length=20,
        choices=[
            ('local', 'Mercado Local'),
            ('regional', 'Mercado Regional'),
            ('grossista', 'Mercado Grossista'),
            ('exportacao', 'Mercado de Exportação'),
        ]
    )
    contato = models.CharField(max_length=200, blank=True)
    horario_funcionamento = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.nome} - {self.localizacao}"

class ProdutoAgricola(models.Model):
    cultura = models.ForeignKey(Cultura, on_delete=models.CASCADE)
    variedade = models.CharField(max_length=100, blank=True)
    unidade_medida = models.CharField(
        max_length=20,
        choices=[
            ('kg', 'Quilograma'),
            ('ton', 'Tonelada'),
            ('saca', 'Saca'),
            ('caixa', 'Caixa'),
            ('unidade', 'Unidade'),
        ],
        default='kg'
    )
    descricao = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.cultura.nome} {self.variedade} ({self.unidade_medida})"

class PrecoMercado(models.Model):
    produto = models.ForeignKey(ProdutoAgricola, on_delete=models.CASCADE)
    mercado = models.ForeignKey(Mercado, on_delete=models.CASCADE)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    preco_compra = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    qualidade = models.CharField(
        max_length=20,
        choices=[
            ('primeira', 'Primeira Qualidade'),
            ('segunda', 'Segunda Qualidade'),
            ('terceira', 'Terceira Qualidade'),
            ('exportacao', 'Qualidade Exportação'),
        ],
        default='primeira'
    )
    disponibilidade = models.CharField(
        max_length=20,
        choices=[
            ('abundante', 'Abundante'),
            ('normal', 'Normal'),
            ('escasso', 'Escasso'),
            ('indisponivel', 'Indisponível'),
        ],
        default='normal'
    )
    data_registro = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    fonte_informacao = models.CharField(max_length=200, blank=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-data_registro']
        unique_together = ['produto', 'mercado', 'qualidade', 'data_registro']
    
    def __str__(self):
        return f"{self.produto} - {self.mercado.nome} - {self.preco_venda}"

class TendenciaMercado(models.Model):
    produto = models.ForeignKey(ProdutoAgricola, on_delete=models.CASCADE)
    regiao = models.CharField(max_length=200)
    tendencia = models.CharField(
        max_length=20,
        choices=[
            ('alta', 'Tendência de Alta'),
            ('baixa', 'Tendência de Baixa'),
            ('estavel', 'Estável'),
            ('volatil', 'Volátil'),
        ]
    )
    preco_medio_atual = models.DecimalField(max_digits=10, decimal_places=2)
    preco_medio_anterior = models.DecimalField(max_digits=10, decimal_places=2)
    variacao_percentual = models.FloatField()
    periodo_analise = models.CharField(max_length=50)
    fatores_influencia = models.TextField(blank=True)
    previsao_proximos_30_dias = models.TextField(blank=True)
    data_analise = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.produto} - {self.regiao} - {self.get_tendencia_display()}"

class AlertaPreco(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(ProdutoAgricola, on_delete=models.CASCADE)
    mercado = models.ForeignKey(Mercado, on_delete=models.CASCADE, null=True, blank=True)
    preco_alvo = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_alerta = models.CharField(
        max_length=20,
        choices=[
            ('acima', 'Preço Acima de'),
            ('abaixo', 'Preço Abaixo de'),
            ('mudanca', 'Mudança Significativa'),
        ]
    )
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ultima_notificacao = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Alerta {self.usuario.username} - {self.produto}"

class DemandaMercado(models.Model):
    produto = models.ForeignKey(ProdutoAgricola, on_delete=models.CASCADE)
    mercado = models.ForeignKey(Mercado, on_delete=models.CASCADE)
    nivel_demanda = models.CharField(
        max_length=20,
        choices=[
            ('muito_baixa', 'Muito Baixa'),
            ('baixa', 'Baixa'),
            ('normal', 'Normal'),
            ('alta', 'Alta'),
            ('muito_alta', 'Muito Alta'),
        ]
    )
    quantidade_demandada = models.FloatField(help_text="Quantidade em unidades do produto")
    periodo_demanda = models.CharField(max_length=100)
    preco_sugerido = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    contato_comprador = models.CharField(max_length=200, blank=True)
    requisitos_qualidade = models.TextField(blank=True)
    data_necessidade = models.DateField(null=True, blank=True)
    data_registro = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Demanda {self.produto} - {self.mercado.nome}"
