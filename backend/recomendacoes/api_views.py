from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from pragas.services.huggingface_service import huggingface_service
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])  # Mudando para AllowAny para funcionar sem autenticação
def chatbot_view(request):
    """
    View para chatbot de recomendações agrícolas inteligente
    """
    try:
        pergunta = request.data.get('pergunta', '')
        contexto_adicional = request.data.get('contexto', {})
        
        if not pergunta:
            return Response(
                {'erro': 'Pergunta é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determinar contexto do utilizador
        if hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
            localizacao = getattr(user, 'localizacao', 'Moçambique')
            culturas_interesse = getattr(user, 'culturas_interesse', [])
        else:
            # Usar contexto fornecido ou padrão
            localizacao = contexto_adicional.get('localizacao', 'Moçambique')
            culturas_interesse = contexto_adicional.get('culturas_interesse', ['milho'])
        
        # Gerar contexto enriquecido
        context_data = {
            'pergunta': pergunta,
            'localizacao': localizacao,
            'culturas_interesse': culturas_interesse,
            'historico_conversa': contexto_adicional.get('historico_conversa', [])
        }
        
        # Tentar HuggingFace primeiro
        try:
            resposta_ai = gerar_resposta_huggingface(context_data)
            if resposta_ai:
                return Response({
                    'resposta': resposta_ai,
                    'contexto': 'IA Avançada (HuggingFace)',
                    'confidence': 0.9,
                    'timestamp': '2025-08-21T15:30:00'
                })
        except Exception as e:
            logger.error(f"Erro HuggingFace: {e}")
        
        # Fallback para sistema inteligente local
        resposta_local = gerar_resposta_contextual_avancada(context_data)
        
        return Response({
            'resposta': resposta_local['resposta'],
            'contexto': resposta_local['fonte'],
            'confidence': resposta_local['confidence'],
            'recomendacoes_relacionadas': resposta_local.get('relacionadas', []),
            'timestamp': '2025-08-21T15:30:00'
        })
        
    except Exception as e:
        logger.error(f"Erro no chatbot: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def gerar_resposta_huggingface(context_data: dict) -> str:
    """
    Gerar resposta usando HuggingFace com contexto enriquecido
    """
    try:
        pergunta = context_data['pergunta']
        localizacao = context_data['localizacao']
        culturas = context_data['culturas_interesse']
        
        # Criar prompt contextualizado
        prompt = f"""Você é um especialista agrícola de Moçambique. 
        
Pergunta do agricultor de {localizacao}: {pergunta}
Culturas de interesse: {', '.join(culturas) if culturas else 'milho'}

Forneça uma resposta específica para as condições de Moçambique, considerando:
- Clima tropical/subtropical
- Épocas das chuvas (Outubro-Março)
- Variedades locais adaptadas
- Práticas de agricultura familiar
- Recursos limitados

Seja prático e específico."""

        # Tentar usar HuggingFace
        resposta = huggingface_service.generate_recommendation(prompt)
        return resposta
        
    except Exception as e:
        logger.error(f"Erro HuggingFace: {e}")
        return None

def gerar_resposta_contextual_avancada(context_data: dict) -> dict:
    """
    Sistema inteligente de respostas baseado em análise contextual
    """
    pergunta = context_data.get('pergunta', '').lower()
    localizacao = context_data.get('localizacao', context_data.get('regiao', 'Maputo'))
    culturas = context_data.get('culturas_interesse', context_data.get('cultura', 'milho'))
    
    # Garantir que culturas é uma lista
    if isinstance(culturas, str):
        culturas = [culturas]
    elif not culturas:
        culturas = ['milho']
    
    # Análise de intenção
    intencao = analisar_intencao(pergunta)
    cultura_detectada = detectar_cultura(pergunta, culturas)
    
    # Base de conhecimento contextual
    if intencao == 'plantio':
        return gerar_resposta_plantio(cultura_detectada, localizacao)
    elif intencao == 'pragas':
        return gerar_resposta_pragas(cultura_detectada, localizacao)
    elif intencao == 'irrigacao':
        return gerar_resposta_irrigacao(cultura_detectada, localizacao)
    elif intencao == 'fertilizacao':
        return gerar_resposta_fertilizacao(cultura_detectada, localizacao)
    elif intencao == 'mercado':
        return gerar_resposta_mercado(cultura_detectada, localizacao)
    elif intencao == 'clima':
        return gerar_resposta_clima(localizacao)
    else:
        return gerar_resposta_geral(pergunta, localizacao)

def analisar_intencao(pergunta: str) -> str:
    """Analisar a intenção da pergunta usando palavras-chave"""
    intencoes = {
        'plantio': ['plantar', 'plantio', 'semear', 'época', 'quando', 'variedade'],
        'pragas': ['praga', 'inseto', 'lagarta', 'fungo', 'doença', 'controle', 'tratamento'],
        'irrigacao': ['água', 'regar', 'rega', 'irrigar', 'quantidade', 'irrigação'],
        'fertilizacao': ['adubo', 'fertilizante', 'nutriente', 'npk', 'fertilizar'],
        'mercado': ['preço', 'vender', 'mercado', 'custo', 'lucro', 'rentabilidade'],
        'clima': ['tempo', 'chuva', 'seca', 'temperatura', 'clima', 'estação']
    }
    
    for intencao, palavras in intencoes.items():
        if any(palavra in pergunta for palavra in palavras):
            return intencao
    
    return 'geral'

def detectar_cultura(pergunta: str, culturas_interesse: list) -> str:
    """Detectar qual cultura está sendo mencionada"""
    culturas_conhecidas = ['milho', 'feijao', 'feijão', 'mandioca', 'arroz', 'tomate', 'amendoim']
    
    for cultura in culturas_conhecidas:
        if cultura in pergunta:
            return cultura
    
    # Se não detectou, usar a primeira das culturas de interesse
    if culturas_interesse:
        return culturas_interesse[0]
    
    return 'milho'  # Default

def gerar_resposta_plantio(cultura: str, localizacao: str) -> dict:
    """Gerar resposta específica sobre plantio"""
    base_conhecimento = {
        'milho': {
            'epoca': 'Outubro-Dezembro',
            'variedades': ['ZM521', 'ZM623', 'Matuba', 'PAN53'],
            'espacamento': '75cm x 25cm',
            'profundidade': '3-5cm',
            'ciclo': '120-140 dias'
        },
        'feijao': {
            'epoca': 'Novembro-Janeiro',
            'variedades': ['Nhemba', 'Feijão boer', 'Vulgar'],
            'espacamento': '40cm x 15cm',
            'profundidade': '2-3cm',
            'ciclo': '75-90 dias'
        },
        'mandioca': {
            'epoca': 'Outubro-Março',
            'variedades': ['Chaimite', 'Nicadzi', 'TMS'],
            'espacamento': '1m x 1m',
            'profundidade': '15cm',
            'ciclo': '8-12 meses'
        }
    }
    
    info = base_conhecimento.get(cultura, base_conhecimento['milho'])
    
    resposta = f"""🌱 **Plantio de {cultura.title()} em {localizacao}:**

**Época ideal:** {info['epoca']} (época das chuvas)
**Variedades recomendadas:** {', '.join(info['variedades'])}
**Espaçamento:** {info['espacamento']}
**Profundidade:** {info['profundidade']}
**Ciclo de produção:** {info['ciclo']}

**Preparação do solo:**
• Lavrar ou cavar 15-20cm de profundidade
• Adicionar matéria orgânica (estrume, compost)
• Fazer sulcos ou covas seguindo o espaçamento

**Dicas para {localizacao}:**
• Aproveite as primeiras chuvas consistentes
• Use variedades adaptadas ao clima local
• Prepare o terreno antes das chuvas começarem

💡 **Próximos passos:** Quer saber sobre rega, pragas ou fertilização para {cultura}?"""

    return {
        'resposta': resposta,
        'fonte': 'Base de Conhecimento Agrícola - Moçambique',
        'confidence': 0.85,
        'relacionadas': [
            f'Como irrigar {cultura}?',
            f'Que pragas atacam {cultura}?',
            f'Fertilizantes para {cultura}'
        ]
    }

def gerar_resposta_pragas(cultura: str, localizacao: str) -> dict:
    """Gerar resposta específica sobre pragas"""
    pragas_comuns = {
        'milho': {
            'principais': ['Lagarta do cartucho', 'Broca do colmo', 'Pulgões'],
            'tratamentos': ['Bt (Bacillus thuringiensis)', 'Óleo de neem', 'Rotação de culturas'],
            'prevencao': ['Monitoramento regular', 'Plantas armadilha', 'Diversificação']
        },
        'feijao': {
            'principais': ['Mosca branca', 'Vaquinha', 'Trips'],
            'tratamentos': ['Sabão neutro', 'Extrato de alho', 'Predadores naturais'],
            'prevencao': ['Mulching', 'Consórcio com plantas repelentes', 'Rotação']
        }
    }
    
    info = pragas_comuns.get(cultura, pragas_comuns['milho'])
    
    resposta = f"""🐛 **Controle de Pragas em {cultura.title()} - {localizacao}:**

**Pragas mais comuns:**
{chr(10).join([f'• {praga}' for praga in info['principais']])}

**Tratamentos naturais:**
{chr(10).join([f'• {tratamento}' for tratamento in info['tratamentos']])}

**Prevenção:**
{chr(10).join([f'• {prev}' for prev in info['prevencao']])}

**🎯 Estratégia integrada:**
1. **Monitoramento:** Inspecione as plantas 2-3x por semana
2. **Controle biológico:** Preserve inimigos naturais
3. **Rotação:** Alterne com culturas diferentes
4. **Higiene:** Remova restos culturais infectados

📸 **Use nossa ferramenta:** Fotografe pragas suspeitas para identificação automática!"""

    return {
        'resposta': resposta,
        'fonte': 'Sistema de Maneio Integrado de Pragas',
        'confidence': 0.88,
        'relacionadas': [
            'Detectar pragas por foto',
            'Receitas de defensivos naturais',
            'Calendário de monitoramento'
        ]
    }

def gerar_resposta_irrigacao(cultura: str, localizacao: str) -> dict:
    """Gerar resposta sobre rega"""
    necessidades = {
        'milho': '500-800mm por ciclo',
        'feijao': '300-500mm por ciclo',
        'mandioca': '1000-1500mm por ano',
        'tomate': '400-600mm por ciclo'
    }
    
    necessidade = necessidades.get(cultura, '500-700mm por ciclo')
    
    resposta = f"""💧 **Rega de {cultura.title()} em {localizacao}:**

**Necessidade hídrica:** {necessidade}
**Frequência:** A cada 2-3 dias (época seca)
**Melhor horário:** 6h-8h ou 17h-19h
**Método recomendado:** Gotejamento ou sulcos

**Sinais de falta de água:**
• Folhas murchas nas horas quentes
• Crescimento lento
• Folhas amareladas

**Sinais de excesso:**
• Folhas amarelas persistentes
• Fungos no solo
• Crescimento excessivo de folhas

**💡 Dicas para economizar água:**
• Use cobertura morta (palha, folhas)
• Faça rega localizada
• Aproveite água da chuva
• Irrigue no início da manhã

**Para {localizacao}:** Considere as chuvas sazonais no planeamento da rega."""

    return {
        'resposta': resposta,
        'fonte': 'Manual de Rega Eficiente',
        'confidence': 0.82,
        'relacionadas': [
            'Sistemas de irrigação caseiros',
            'Captação de água da chuva',
            'Sinais de estresse hídrico'
        ]
    }

def gerar_resposta_fertilizacao(cultura: str, localizacao: str) -> dict:
    """Gerar resposta sobre fertilização"""
    resposta = f"""🌿 **Fertilização de {cultura.title()} em {localizacao}:**

**Adubação orgânica (preferencial):**
• Esterco bovino: 2-3 toneladas/hectare
• Compost caseiro: 1-2 toneladas/hectare
• Aplicar 2 semanas antes do plantio

**Adubação química (se necessário):**
• NPK 12-24-12: 200-300 kg/hectare no plantio
• Ureia: 100-150 kg/hectare (cobertura após 30 dias)

**Fertilizantes naturais:**
• Cinza de madeira (potássio)
• Farinha de osso (fósforo)
• Esterco de galinha (nitrogênio)

**📅 Cronograma:**
1. **Pré-plantio:** Matéria orgânica + fósforo
2. **Plantio:** NPK equilibrado
3. **30 dias:** Nitrogênio (cobertura)
4. **60 dias:** Nitrogênio (se necessário)

**⚠️ Cuidados:**
• Não exagere no nitrogênio (favorece pragas)
• Faça análise de solo quando possível
• Regue após aplicação de fertilizantes"""

    return {
        'resposta': resposta,
        'fonte': 'Guia de Nutrição Vegetal',
        'confidence': 0.80,
        'relacionadas': [
            'Como fazer compost caseiro',
            'Sinais de deficiência nutricional',
            'Análise de solo'
        ]
    }

def gerar_resposta_mercado(cultura: str, localizacao: str) -> dict:
    """Gerar resposta sobre mercado"""
    resposta = f"""📈 **Mercado de {cultura.title()} em {localizacao}:**

**💰 Estratégias de comercialização:**
• Venda direta ao consumidor (melhor margem)
• Cooperativas de agricultores
• Mercados locais e feiras
• Contratos com empresas/escolas

**📊 Fatores que influenciam preços:**
• Época do ano (safra/entressafra)
• Qualidade do produto
• Oferta e demanda regional
• Condições de armazenamento

**🎯 Para maximizar lucros:**
• Escalone plantios para venda contínua
• Invista em qualidade e apresentação
• Forme grupos para negociação
• Diversifique canais de venda

**📱 Use nossa calculadora:** Calcule custos e rentabilidade da sua produção!

**⏰ Melhor época para vender {cultura}:**
• Entressafra: preços mais altos
• Evite vender logo após colheita (preços baixos)
• Monitore preços regionais regularmente"""

    return {
        'resposta': resposta,
        'fonte': 'Central de Inteligência de Mercado Agrícola',
        'confidence': 0.75,
        'relacionadas': [
            'Preços atuais na sua região',
            'Calculadora de rentabilidade',
            'Cooperativas próximas'
        ]
    }

def gerar_resposta_clima(localizacao: str) -> dict:
    """Gerar resposta sobre clima"""
    resposta = f"""🌤️ **Condições Climáticas em {localizacao}:**

**🌧️ Padrão de chuvas em Moçambique:**
• **Época chuvosa:** Outubro/Novembro a Março/Abril
• **Época seca:** Maio a Setembro
• **Pico das chuvas:** Dezembro a Fevereiro

**📊 Planejamento agrícola por época:**

**Outubro-Dezembro:** 
• Preparação e plantio das culturas principais
• Aproveitamento das primeiras chuvas

**Janeiro-Março:**
• Manutenção e cuidados das culturas
• Atenção para pragas e doenças (umidade alta)

**Abril-Junho:**
• Colheita das culturas de ciclo curto
• Preparação para época seca

**Julho-Setembro:**
• Culturas de sequeiro
• Irrigação intensiva
• Preparo para próxima safra

**💡 Use nossa previsão meteorológica:** Para decisões mais precisas sobre plantio e maneio!"""

    return {
        'resposta': resposta,
        'fonte': 'Meteorologia Agrícola',
        'confidence': 0.85,
        'relacionadas': [
            'Previsão do tempo para agricultura',
            'Alertas climáticos',
            'Calendário agrícola'
        ]
    }

def gerar_resposta_geral(pergunta: str, localizacao: str) -> dict:
    """Resposta geral quando não consegue categorizar"""
    resposta = f"""🤖 **Assistente Agrícola - {localizacao}**

Obrigado pela sua pergunta! Para dar a melhor recomendação, preciso entender melhor o que você quer saber.

**🌾 Posso ajudar com:**

**🌱 Plantio e Cultivo:**
• Épocas ideais de plantio
• Variedades recomendadas
• Espaçamento e profundidade
• Rotação de culturas

**🐛 Controle de Pragas:**
• Identificação de pragas e doenças
• Tratamentos naturais e químicos
• Prevenção integrada

**💧 Irrigação:**
• Necessidades hídricas
• Sistemas de irrigação
• Economia de água

**🌿 Fertilização:**
• Adubação orgânica e química
• Cronograma de aplicação
• Deficiências nutricionais

**📈 Mercado:**
• Preços e tendências
• Estratégias de venda
• Rentabilidade

**🌤️ Clima:**
• Previsões meteorológicas
• Alertas climáticos
• Planejamento sazonal

**Como posso ajudar especificamente?** Reformule sua pergunta mencionando a cultura e o aspecto que te interessa!"""

    return {
        'resposta': resposta,
        'fonte': 'Assistente Geral AgroAlerta',
        'confidence': 0.60,
        'relacionadas': [
            'Como plantar milho?',
            'Pragas em feijão',
            'Preços de mandioca'
        ]
    }
    """
    Gerar resposta baseada em contexto local de Moçambique
    """
    pergunta_lower = pergunta.lower()
    
    # Respostas sobre milho
    if any(palavra in pergunta_lower for palavra in ['milho', 'maiz']):
        if 'plantar' in pergunta_lower or 'plantio' in pergunta_lower:
            return """🌽 **Plantio de Milho em Moçambique:**

**Melhor época:** Outubro a Dezembro (início das chuvas)
**Variedades recomendadas:** ZM521, ZM623, Matuba
**Espaçamento:** 75cm entre fileiras, 25cm entre plantas
**Profundidade:** 3-5cm
**Sementes por cova:** 2-3 sementes

**Dicas específicas para sua região:**
• Prepare o solo antes das primeiras chuvas
• Use variedades resistentes à seca se em zona semi-árida
• Faça rotação com leguminosas para melhorar o solo

Precisa de mais detalhes sobre algum aspecto específico?"""
        
        elif 'praga' in pergunta_lower or 'lagarta' in pergunta_lower:
            return """🐛 **Controle de Pragas no Milho:**

**Principais pragas em Moçambique:**
• Lagarta do cartucho (Spodoptera frugiperda)
• Broca do colmo
• Pulgões

**Controle biológico:**
• Bacillus thuringiensis para lagartas
• Plantio de plantas repelentes (tagetes, manjericão)
• Conservação de inimigos naturais

**Monitoramento:**
• Inspeção semanal das plantas
• Ação rápida nos primeiros sinais
• Use o detector de pragas do AgroAlerta!

**Controle químico (se necessário):**
• Siga sempre as recomendações do rótulo
• Use equipamentos de proteção
• Respeite períodos de carência"""
    
    # Respostas sobre irrigação
    elif any(palavra in pergunta_lower for palavra in ['água', 'irrigação', 'rega']):
        return """💧 **Irrigação Eficiente:**

**Necessidades hídricas:**
• Milho: 500-800mm por ciclo
• Feijão: 300-500mm por ciclo  
• Mandioca: 1000-1500mm por ano
• Hortaliças: 400-600mm por ciclo

**Melhores práticas:**
• Irrigar de manhã cedo (6-8h) ou final da tarde
• Evitar molhar as folhas (previne doenças)
• Usar mulching para conservar umidade
• Verificar umidade do solo com os dedos

**Sinais de estresse hídrico:**
• Folhas murchas ao meio-dia
• Crescimento lento
• Amarelecimento precoce

**Economia de água:**
• Gotejamento para culturas de alto valor
• Microaspersão para pomares
• Captação de água de chuva"""
    
    # Respostas sobre fertilização
    elif any(palavra in pergunta_lower for palavra in ['fertilizante', 'adubo', 'nutrição']):
        return """🌱 **Fertilização Balanceada:**

**NPK recomendado por hectare:**
• **Milho:** 120-80-60 kg/ha
• **Feijão:** 40-60-40 kg/ha
• **Mandioca:** 60-40-80 kg/ha
• **Hortaliças:** 150-100-120 kg/ha

**Adubação orgânica:**
• Esterco bovino: 10-20 t/ha
• Compostagem de restos vegetais
• Adubação verde com mucuna, feijão-de-porco

**Épocas de aplicação:**
• **Base:** no plantio (50% N, 100% P, 50% K)
• **Cobertura:** 30-45 dias após plantio (50% N, 50% K)

**Sinais de deficiência:**
• Amarelecimento: falta de nitrogênio
• Folhas roxas: falta de fósforo
• Bordas queimadas: falta de potássio

Recomendo análise de solo para precisão!"""
    
    # Respostas sobre mercado
    elif any(palavra in pergunta_lower for palavra in ['preço', 'venda', 'mercado']):
        return """💰 **Estratégias de Mercado:**

**Melhores épocas para venda:**
• **Milho:** Março-Maio (pós-colheita)
• **Feijão:** Junho-Agosto
• **Hortaliças:** Durante escassez no mercado

**Como obter melhores preços:**
• Armazenamento adequado (secagem, controle de pragas)
• Venda direta ao consumidor
• Formação de grupos de produtores
• Agregação de valor (processamento)

**Mercados em Moçambique:**
• Mercados locais: menores quantidades, preços variáveis
• Compradores institucionais: quantidades maiores, preços estáveis
• Exportação: padrões de qualidade específicos

Consulte a seção Mercado do app para preços atualizados!"""
    
    # Resposta sobre clima
    elif any(palavra in pergunta_lower for palavra in ['clima', 'chuva', 'seca', 'tempo']):
        return """🌤️ **Gestão Climática:**

**Preparação para época chuvosa:**
• Plantio no início das chuvas (Outubro-Dezembro)
• Drenagem adequada para evitar encharcamento
• Variedades de ciclo adequado

**Estratégias para seca:**
• Variedades tolerantes à seca
• Mulching para conservar umidade
• Sistemas de captação de água
• Irrigação de salvação

**Uso da informação climática:**
• Consulte previsões no app AgroAlerta
• Planeje atividades com base no clima
• Ajuste calendário agrícola conforme precipitação

**Mudanças climáticas:**
• Diversificação de culturas
• Práticas de conservação do solo
• Agrofloresta para resiliência"""
    
    # Resposta genérica
    else:
        return f"""🤔 Interessante pergunta sobre agricultura! 

Com base na experiência em Moçambique, recomendo:

**Práticas gerais:**
• Sempre adaptar técnicas ao clima local
• Usar variedades adaptadas à região
• Considerar práticas sustentáveis
• Buscar assistência técnica quando necessário

**Recursos do AgroAlerta:**
• 📱 Use o detector de pragas para problemas visuais
• 🌤️ Consulte dados climáticos para planejamento
• 💰 Verifique preços de mercado antes de vender
• 🌾 Explore recomendações por cultura

**Para informações específicas:**
Pode reformular sua pergunta mencionando:
• Que cultura você cultiva?
• Qual região de Moçambique?
• Qual problema específico enfrenta?

Estou aqui para ajudar! 🌾"""

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def gerar_resposta_contextual_avancada_view(request):
    """
    Endpoint para gerar respostas contextuais avançadas do chatbot
    """
    try:
        data = request.data
        pergunta = data.get('pergunta', '')
        contexto = data.get('contexto', {})
        
        if not pergunta:
            return Response({
                'erro': 'Pergunta é obrigatória'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Combina pergunta e contexto
        context_data = {
            'pergunta': pergunta,
            **contexto
        }
        
        # Gera resposta contextual avançada
        resposta = gerar_resposta_contextual_avancada(context_data)
        
        return Response(resposta, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Erro ao gerar resposta contextual: {e}")
        return Response({
            'erro': 'Erro interno do servidor',
            'detalhes': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def recomendacoes_gerais_view(request):
    """
    View para recomendações gerais por cultura e região
    """
    try:
        cultura = request.GET.get('cultura', '')
        regiao = request.GET.get('regiao', 'Maputo')
        
        recomendacoes = {
            'cultura': cultura,
            'regiao': regiao,
            'recomendacoes': [
                {
                    'categoria': 'Plantio',
                    'dica': f'Para {cultura} em {regiao}, plante no início da época chuvosa',
                    'prioridade': 'alta'
                },
                {
                    'categoria': 'Irrigação',
                    'dica': 'Mantenha o solo com umidade adequada, sem encharcamento',
                    'prioridade': 'média'
                },
                {
                    'categoria': 'Fertilização',
                    'dica': 'Faça análise de solo e aplique fertilizantes conforme necessidade',
                    'prioridade': 'alta'
                }
            ],
            'timestamp': '2025-08-21T15:30:00'
        }
        
        return Response(recomendacoes)
        
    except Exception as e:
        logger.error(f"Erro nas recomendações: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
