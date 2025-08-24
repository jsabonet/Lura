from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def precos_mercado_view(request):
    """
    View para obter preços de mercado por localização
    """
    try:
        localizacao = request.GET.get('localizacao', 'Maputo')
        
        # Em produção, integrar com APIs de dados de mercado reais
        # Por agora, retornar dados simulados baseados na localização
        
        precos_base = {
            'Maputo': {
                'milho': 28.50,
                'feijao': 95.00,
                'mandioca': 18.00,
                'arroz': 45.00,
                'amendoim': 85.00,
                'tomate': 35.00
            },
            'Beira': {
                'milho': 26.00,
                'feijao': 90.00,
                'mandioca': 16.50,
                'arroz': 42.00,
                'amendoim': 80.00,
                'tomate': 32.00
            },
            'Nampula': {
                'milho': 25.00,
                'feijao': 88.00,
                'mandioca': 15.00,
                'arroz': 40.00,
                'amendoim': 78.00,
                'tomate': 30.00
            }
        }
        
        precos_localizacao = precos_base.get(localizacao, precos_base['Maputo'])
        
        # Simular variações de preço
        import random
        
        dados_mercado = []
        for produto, preco_base in precos_localizacao.items():
            # Variação aleatória de -5% a +10%
            variacao = random.uniform(-0.05, 0.10)
            preco_atual = preco_base * (1 + variacao)
            preco_anterior = preco_base
            
            tendencia = 'alta' if variacao > 0.02 else 'baixa' if variacao < -0.02 else 'estavel'
            
            dados_mercado.append({
                'id': f"{produto}_{localizacao}",
                'produto': produto.capitalize(),
                'preco_atual': round(preco_atual, 2),
                'preco_anterior': round(preco_anterior, 2),
                'unidade': 'MT/kg',
                'localizacao': localizacao,
                'data_atualizacao': datetime.now().isoformat(),
                'tendencia': tendencia,
                'variacao_percentual': round(variacao * 100, 1)
            })
        
        return Response(dados_mercado)
        
    except Exception as e:
        logger.error(f"Erro ao obter preços de mercado: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def tendencias_mercado_view(request):
    """
    View para obter tendências de mercado
    """
    try:
        produto = request.GET.get('produto', 'milho')
        periodo = int(request.GET.get('periodo', 30))  # dias
        
        # Simular dados históricos
        tendencias = []
        base_price = 25.0
        
        for i in range(periodo):
            data = datetime.now() - timedelta(days=periodo-i)
            # Simular flutuação de preços
            import math
            variacao = math.sin(i * 0.2) * 3 + (i * 0.1)  # Tendência crescente com oscilações
            preco = base_price + variacao
            
            tendencias.append({
                'data': data.strftime('%Y-%m-%d'),
                'preco': round(preco, 2),
                'volume_transacionado': round(1000 + (i * 10) + (variacao * 50), 0)
            })
        
        resultado = {
            'produto': produto,
            'periodo_dias': periodo,
            'dados_historicos': tendencias,
            'analise': {
                'tendencia_geral': 'alta',
                'variacao_percentual': '+12.5%',
                'melhor_epoca_venda': 'Final de Março a Maio',
                'recomendacao': 'Preços em alta. Considere vender parte da produção agora e armazenar o restante.'
            }
        }
        
        return Response(resultado)
        
    except Exception as e:
        logger.error(f"Erro ao obter tendências: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def calcular_rentabilidade_view(request):
    """
    View para calcular rentabilidade de culturas
    """
    try:
        dados = request.data
        
        cultura = dados.get('cultura', 'milho')
        area = float(dados.get('area', 1))
        custos = {
            'sementes': float(dados.get('custo_sementes', 0)),
            'fertilizantes': float(dados.get('custo_fertilizantes', 0)),
            'mao_obra': float(dados.get('custo_mao_obra', 0)),
            'outros': float(dados.get('custo_outros', 0))
        }
        producao_estimada = float(dados.get('producao_estimada', 0))
        preco_venda = float(dados.get('preco_venda', 0))
        
        # Cálculos
        custo_total_por_ha = sum(custos.values())
        custo_total = custo_total_por_ha * area
        producao_total = producao_estimada * area
        receita_total = producao_total * preco_venda
        lucro = receita_total - custo_total
        roi = (lucro / custo_total * 100) if custo_total > 0 else 0
        
        resultado = {
            'cultura': cultura,
            'area_hectares': area,
            'custos_detalhados': custos,
            'custo_total': round(custo_total, 2),
            'custo_por_hectare': round(custo_total_por_ha, 2),
            'producao_total_kg': round(producao_total, 2),
            'receita_total': round(receita_total, 2),
            'lucro': round(lucro, 2),
            'lucro_por_hectare': round(lucro / area, 2) if area > 0 else 0,
            'roi_percentual': round(roi, 1),
            'analise': {
                'viabilidade': 'viavel' if roi > 20 else 'moderada' if roi > 0 else 'nao_viavel',
                'recomendacao': get_recomendacao_rentabilidade(roi),
                'break_even_kg': round(custo_total / preco_venda, 2) if preco_venda > 0 else 0
            }
        }
        
        return Response(resultado)
        
    except Exception as e:
        logger.error(f"Erro no cálculo de rentabilidade: {e}")
        return Response(
            {'erro': 'Erro nos dados fornecidos'},
            status=status.HTTP_400_BAD_REQUEST
        )

def get_recomendacao_rentabilidade(roi):
    """
    Gerar recomendação baseada no ROI
    """
    if roi > 50:
        return "Excelente rentabilidade! Considere expandir a produção desta cultura."
    elif roi > 20:
        return "Boa rentabilidade. Continue com esta cultura e otimize custos."
    elif roi > 0:
        return "Rentabilidade baixa. Revise custos e considere melhorar produtividade."
    else:
        return "Cultura não rentável com estes parâmetros. Revise estratégia ou mude de cultura."

@api_view(['GET'])
@permission_classes([AllowAny])
def alertas_mercado_view(request):
    """
    View para alertas de oportunidades de mercado
    """
    try:
        localizacao = request.GET.get('localizacao', 'Maputo')
        
        alertas = [
            {
                'id': 'alert_1',
                'tipo': 'oportunidade',
                'produto': 'Tomate',
                'titulo': 'Alta demanda por tomate',
                'descricao': f'Preços do tomate subiram 15% em {localizacao}. Boa oportunidade para venda.',
                'preco_atual': 35.00,
                'variacao': '+15%',
                'urgencia': 'media',
                'data_expiracao': (datetime.now() + timedelta(days=7)).isoformat()
            },
            {
                'id': 'alert_2',
                'tipo': 'aviso',
                'produto': 'Milho',
                'titulo': 'Época de plantio se aproxima',
                'descricao': 'Prepare-se para o plantio de milho. Preços de sementes podem subir.',
                'urgencia': 'baixa',
                'data_expiracao': (datetime.now() + timedelta(days=30)).isoformat()
            }
        ]
        
        return Response(alertas)
        
    except Exception as e:
        logger.error(f"Erro nos alertas de mercado: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
