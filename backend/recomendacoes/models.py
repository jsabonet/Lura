from django.db import models
from users.models import User
from pragas.models import Cultura

class CategoriaRecomendacao(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    icone = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.nome

class Recomendacao(models.Model):
    categoria = models.ForeignKey(CategoriaRecomendacao, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    culturas_aplicaveis = models.ManyToManyField(Cultura, blank=True)
    epoca_aplicacao = models.CharField(
        max_length=20,
        choices=[
            ('pre_plantio', 'Pré-plantio'),
            ('plantio', 'Plantio'),
            ('crescimento', 'Crescimento'),
            ('floracao', 'Floração'),
            ('frutificacao', 'Frutificação'),
            ('colheita', 'Colheita'),
            ('pos_colheita', 'Pós-colheita'),
            ('qualquer', 'Qualquer época'),
        ],
        default='qualquer'
    )
    nivel_dificuldade = models.CharField(
        max_length=10,
        choices=[
            ('facil', 'Fácil'),
            ('medio', 'Médio'),
            ('dificil', 'Difícil'),
        ],
        default='facil'
    )
    custo_estimado = models.CharField(
        max_length=10,
        choices=[
            ('baixo', 'Baixo'),
            ('medio', 'Médio'),
            ('alto', 'Alto'),
        ],
        default='baixo'
    )
    tempo_implementacao = models.CharField(max_length=100, blank=True)
    materiais_necessarios = models.TextField(blank=True)
    passos_implementacao = models.JSONField(default=list)
    beneficios_esperados = models.TextField(blank=True)
    autor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True)
    likes = models.ManyToManyField(User, through='LikeRecomendacao', related_name='recomendacoes_curtidas')
    visualizacoes = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-data_criacao']
    
    def __str__(self):
        return self.titulo

class LikeRecomendacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    recomendacao = models.ForeignKey(Recomendacao, on_delete=models.CASCADE)
    data_like = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['usuario', 'recomendacao']

class ComentarioRecomendacao(models.Model):
    recomendacao = models.ForeignKey(Recomendacao, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    conteudo = models.TextField()
    data_comentario = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['data_comentario']
    
    def __str__(self):
        return f"Comentário de {self.usuario.username} em {self.recomendacao.titulo}"

class PerguntaChatbot(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    pergunta = models.TextField()
    resposta = models.TextField()
    categoria_pergunta = models.CharField(
        max_length=50,
        choices=[
            ('cultivo', 'Cultivo'),
            ('pragas', 'Pragas e Doenças'),
            ('clima', 'Clima'),
            ('irrigacao', 'Irrigação'),
            ('adubacao', 'Adubação'),
            ('colheita', 'Colheita'),
            ('mercado', 'Mercado'),
            ('outros', 'Outros'),
        ],
        default='outros'
    )
    satisfacao = models.IntegerField(
        null=True, 
        blank=True,
        choices=[(i, i) for i in range(1, 6)],
        help_text="Avaliação de 1 a 5"
    )
    data_pergunta = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Pergunta {self.id} - {self.usuario.username}"

class CalendarioAgricola(models.Model):
    cultura = models.ForeignKey(Cultura, on_delete=models.CASCADE)
    atividade = models.CharField(max_length=200)
    descricao = models.TextField()
    mes_inicio = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    mes_fim = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    regiao_aplicavel = models.CharField(max_length=100, blank=True)
    importancia = models.CharField(
        max_length=10,
        choices=[
            ('baixa', 'Baixa'),
            ('media', 'Média'),
            ('alta', 'Alta'),
            ('critica', 'Crítica'),
        ],
        default='media'
    )
    
    def __str__(self):
        return f"{self.cultura.nome} - {self.atividade}"
