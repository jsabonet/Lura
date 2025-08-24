from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .services.huggingface_service import huggingface_service
from .models import DeteccaoPraga, TipoPraga, Cultura
from notificacoes.services.twilio_service import twilio_service
import base64
import uuid
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detectar_praga_view(request):
    """
    View para detectar pragas em imagens usando HuggingFace AI
    """
    try:
        # Obter dados da requisição
        image_data = request.data.get('image')
        crop_type = request.data.get('crop_type', 'desconhecido')
        location = request.data.get('location', request.user.localizacao)
        
        if not image_data:
            return Response(
                {'erro': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Processar imagem (se base64, converter para bytes)
        if isinstance(image_data, str) and image_data.startswith('data:'):
            # Remover prefixo data:image/...;base64,
            image_data = image_data.split(',')[1]
        
        # Analisar imagem com IA
        analysis_result = huggingface_service.analyze_crop_health(
            image_data, crop_type
        )
        
        # Salvar detecção no banco se pragas foram encontradas
        if analysis_result.get('pest_detection', {}).get('pests_detected'):
            detection_record = DeteccaoPraga.objects.create(
                agricultor=request.user,
                localizacao=location,
                tipo_cultura=crop_type,
                confianca=analysis_result['pest_detection']['confidence'],
                resultado_analise=analysis_result,
                coordenadas=request.data.get('coordinates', '')
            )
            
            # Enviar notificação se confiança alta
            if analysis_result['pest_detection']['confidence'] > 0.7:
                user_data = {
                    'first_name': request.user.first_name,
                    'telefone': request.user.telefone,
                    'receber_sms': request.user.receber_sms,
                    'receber_whatsapp': request.user.receber_whatsapp,
                    'localizacao': location
                }
                
                pest_data = {
                    'nome': analysis_result['pest_detection']['pests_detected'][0]['name'],
                    'confidence_score': analysis_result['pest_detection']['confidence'],
                    'localizacao': location,
                    'culturas_afetadas': [crop_type]
                }
                
                # Enviar notificação via Twilio
                twilio_service.send_pest_detection_alert(user_data, pest_data)
            
            analysis_result['detection_id'] = detection_record.id
        
        return Response(analysis_result)
        
    except Exception as e:
        logger.error(f"Erro na detecção de pragas: {e}")
        return Response(
            {'erro': 'Erro interno do servidor', 'detalhes': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def listar_pragas_view(request):
    """
    View para listar pragas conhecidas
    """
    try:
        pragas = TipoPraga.objects.all()
        cultura = request.GET.get('cultura')
        
        if cultura:
            pragas = pragas.filter(culturas_afetadas__nome__icontains=cultura)
        
        data = []
        for praga in pragas:
            culturas_nomes = [c.nome for c in praga.culturas_afetadas.all()]
            data.append({
                'id': praga.id,
                'nome': praga.nome,
                'nome_cientifico': praga.nome_cientifico,
                'tipo': praga.tipo,
                'descricao': praga.descricao,
                'culturas_afetadas': culturas_nomes,
                'sintomas': praga.sintomas
            })
        
        return Response(data)
        
    except Exception as e:
        logger.error(f"Erro ao listar pragas: {e}")
        return Response(
            {'erro': 'Erro ao carregar pragas'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_deteccoes_view(request):
    """
    View para obter histórico de detecções do usuário
    """
    try:
        deteccoes = DeteccaoPraga.objects.filter(
            agricultor=request.user
        ).order_by('-data_deteccao')[:20]
        
        data = []
        for deteccao in deteccoes:
            data.append({
                'id': deteccao.id,
                'data_deteccao': deteccao.data_deteccao,
                'localizacao': deteccao.localizacao,
                'tipo_cultura': deteccao.tipo_cultura,
                'confianca': deteccao.confianca,
                'resultado_analise': deteccao.resultado_analise,
                'coordenadas': deteccao.coordenadas
            })
        
        return Response(data)
        
    except Exception as e:
        logger.error(f"Erro ao obter histórico: {e}")
        return Response(
            {'erro': 'Erro ao carregar histórico'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def gerar_recomendacao_view(request):
    """
    View para gerar recomendações usando IA
    """
    try:
        contexto = request.data.get('context', '')
        
        if not contexto:
            return Response(
                {'erro': 'Contexto é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Gerar recomendação usando HuggingFace
        recomendacao = huggingface_service.generate_recommendation(contexto)
        
        return Response({
            'recomendacao': recomendacao,
            'contexto': contexto,
            'data_geracao': huggingface_service._get_current_timestamp()
        })
        
    except Exception as e:
        logger.error(f"Erro ao gerar recomendação: {e}")
        return Response(
            {'erro': 'Erro ao gerar recomendação'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
