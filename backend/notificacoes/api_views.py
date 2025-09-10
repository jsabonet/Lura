from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from .services.twilio_service import twilio_service
from .models import Notificacao, AlertSubscription
from .serializers import AlertSubscriptionSerializer
from users.models import User
# from clima.services.openweather_service import openweather_service  # Comentado até implementar
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enviar_notificacao_view(request):
    """
    View para enviar notificações via SMS/WhatsApp
    """
    try:
        tipo = request.data.get('tipo', 'geral')
        titulo = request.data.get('titulo', '')
        mensagem = request.data.get('mensagem', '')
        destinatarios = request.data.get('destinatarios', [])
        
        if not mensagem:
            return Response(
                {'erro': 'Mensagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        resultados = []
        
        # Se destinatários não especificados, enviar para o usuário atual
        if not destinatarios:
            destinatarios = [request.user.id]
        
        for user_id in destinatarios:
            try:
                user = User.objects.get(id=user_id)
                
                user_data = {
                    'first_name': user.first_name,
                    'telefone': user.telefone,
                    'receber_sms': user.receber_sms,
                    'receber_whatsapp': user.receber_whatsapp,
                    'localizacao': user.localizacao
                }
                
                # Criar notificação no banco
                notificacao = Notificacao.objects.create(
                    usuario=user,
                    titulo=titulo,
                    mensagem=mensagem,
                    tipo_notificacao=tipo
                )
                
                # Enviar via SMS se habilitado
                if user.receber_sms and user.telefone:
                    sms_result = twilio_service.send_sms(user.telefone, mensagem)
                    if sms_result and sms_result.get('success'):
                        notificacao.entregue_sms = True
                        resultados.append(sms_result)
                
                # Enviar via WhatsApp se habilitado
                if user.receber_whatsapp and user.telefone:
                    whatsapp_result = twilio_service.send_whatsapp(user.telefone, mensagem)
                    if whatsapp_result and whatsapp_result.get('success'):
                        notificacao.entregue_whatsapp = True
                        resultados.append(whatsapp_result)
                
                notificacao.save()
                
            except User.DoesNotExist:
                logger.error(f"Usuário {user_id} não encontrado")
                continue
            except Exception as e:
                logger.error(f"Erro ao enviar para usuário {user_id}: {e}")
                continue
        
        return Response({
            'success': True,
            'mensagem': 'Notificações enviadas',
            'resultados': resultados,
            'total_enviadas': len(resultados)
        })
        
    except Exception as e:
        logger.error(f"Erro ao enviar notificações: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_notificacoes_view(request):
    """
    View para listar notificações do usuário
    """
    try:
        notificacoes = Notificacao.objects.filter(
            usuario=request.user
        ).order_by('-data_criacao')[:50]
        
        data = []
        for notif in notificacoes:
            data.append({
                'id': notif.id,
                'titulo': notif.titulo,
                'mensagem': notif.mensagem,
                'tipo_notificacao': notif.tipo_notificacao,
                'lida': notif.lida,
                'entregue_sms': notif.entregue_sms,
                'entregue_whatsapp': notif.entregue_whatsapp,
                'data_criacao': notif.data_criacao,
                'data_leitura': notif.data_leitura
            })
        
        return Response(data)
        
    except Exception as e:
        logger.error(f"Erro ao listar notificações: {e}")
        return Response(
            {'erro': 'Erro ao carregar notificações'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def marcar_lida_view(request, notificacao_id):
    """
    View para marcar notificação como lida
    """
    try:
        notificacao = Notificacao.objects.get(
            id=notificacao_id,
            usuario=request.user
        )
        
        notificacao.marcar_como_lida()
        
        return Response({
            'success': True,
            'mensagem': 'Notificação marcada como lida'
        })
        
    except Notificacao.DoesNotExist:
        return Response(
            {'erro': 'Notificação não encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Erro ao marcar notificação como lida: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teste_twilio_view(request):
    """
    View para testar integração Twilio
    """
    try:
        telefone = request.data.get('telefone', request.user.telefone)
        tipo = request.data.get('tipo', 'sms')  # sms ou whatsapp
        
        if not telefone:
            return Response(
                {'erro': 'Telefone é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mensagem = "🧪 Teste do AgroAlerta - Esta é uma mensagem de teste do sistema de notificações."
        
        if tipo == 'whatsapp':
            resultado = twilio_service.send_whatsapp(telefone, mensagem)
        else:
            resultado = twilio_service.send_sms(telefone, mensagem)
        
        return Response({
            'success': resultado.get('success', False) if resultado else False,
            'resultado': resultado,
            'mensagem': 'Teste enviado com sucesso!' if resultado and resultado.get('success') else 'Falha no envio'
        })
        
    except Exception as e:
        logger.error(f"Erro no teste Twilio: {e}")
        return Response(
            {'erro': 'Erro no teste', 'detalhes': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def alertas_inteligentes_view(request):
    """
    Gerar alertas inteligentes baseados em localização e cultura
    """
    try:
        if request.method == 'POST':
            data = request.data
            localizacao = data.get('localizacao', 'Maputo')
            culturas = data.get('culturas', ['milho'])
            tipos_alertas = data.get('tipo_alertas', ['clima', 'pragas', 'mercado'])
            user_id = data.get('user_id')
        else:
            localizacao = request.GET.get('localizacao', 'Maputo')
            culturas = request.GET.get('cultura', 'milho').split(',')
            tipos_alertas = request.GET.get('tipos', 'clima,pragas,mercado').split(',')
            user_id = request.GET.get('user_id')
        
        alertas = []
        
        # Processar para cada cultura
        for cultura in culturas:
            # 1. Alertas de Época de Plantio
            if 'plantio' in tipos_alertas or 'clima' in tipos_alertas:
                alertas.extend(gerar_alertas_plantio(cultura, localizacao))
            
            # 2. Alertas de Pragas Sazonais
            if 'pragas' in tipos_alertas:
                alertas.extend(gerar_alertas_pragas(cultura, localizacao))
            
            # 3. Alertas de Mercado
            if 'mercado' in tipos_alertas:
                alertas.extend(gerar_alertas_mercado(cultura, localizacao))
        
        # 4. Alertas Personalizados por Usuário
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                alertas.extend(gerar_alertas_personalizados(user))
            except User.DoesNotExist:
                pass
        
        # Ordenar por prioridade
        alertas.sort(key=lambda x: x.get('prioridade', 0), reverse=True)
        
        return Response({
            'alertas': alertas[:10],  # Máximo 10 alertas
            'total': len(alertas),
            'localizacao': localizacao,
            'cultura': cultura,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Erro ao gerar alertas: {e}")
        return Response(
            {'erro': 'Erro interno do servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def gerar_alertas_plantio(cultura, localizacao):
    """Gerar alertas sobre épocas de plantio"""
    alertas = []
    agora = datetime.now()
    mes_atual = agora.month
    
    # Definir épocas de plantio por cultura em Moçambique
    epocas_plantio = {
        'milho': {
            'inicio': 10,  # Outubro
            'fim': 12,     # Dezembro
            'meses_nomes': 'Outubro-Dezembro'
        },
        'feijao': {
            'inicio': 11,  # Novembro
            'fim': 1,      # Janeiro
            'meses_nomes': 'Novembro-Janeiro'
        },
        'mandioca': {
            'inicio': 10,  # Outubro
            'fim': 3,      # Março
            'meses_nomes': 'Outubro-Março'
        },
        'arroz': {
            'inicio': 11,  # Novembro
            'fim': 1,      # Janeiro
            'meses_nomes': 'Novembro-Janeiro'
        }
    }
    
    epoca = epocas_plantio.get(cultura)
    if epoca:
        inicio = epoca['inicio']
        fim = epoca['fim']
        
        # Verificar se estamos na época de plantio
        if fim < inicio:  # Época atravessa o ano (ex: Nov-Jan)
            na_epoca = mes_atual >= inicio or mes_atual <= fim
        else:
            na_epoca = inicio <= mes_atual <= fim
        
        if na_epoca:
            alertas.append({
                'id': f'plantio_{cultura}_{localizacao}',
                'titulo': f'🌱 Época Ideal para Plantio de {cultura.title()}',
                'tipo': 'plantio',
                'nivel': 'baixo',
                'prioridade': 5,
                'descricao': f'Estamos na época ideal para plantar {cultura} em {localizacao} ({epoca["meses_nomes"]}).',
                'recomendacoes': [
                    'Preparar o solo com antecedência',
                    'Adquirir sementes certificadas',
                    'Verificar disponibilidade de água',
                    'Planejar cronograma de cuidados'
                ],
                'urgencia': 'baixa',
                'valido_ate': (datetime.now() + timedelta(days=30)).isoformat()
            })
    
    return alertas

def gerar_alertas_pragas(cultura, localizacao):
    """Gerar alertas sobre pragas sazonais"""
    alertas = []
    mes_atual = datetime.now().month
    
    # Pragas comuns por cultura e época
    pragas_sazonais = {
        'milho': {
            'lagarta_cartucho': {
                'meses': [10, 11, 12, 1, 2],
                'nivel': 'alto',
                'nome': 'Lagarta do Cartucho'
            },
            'broca_colmo': {
                'meses': [12, 1, 2, 3],
                'nivel': 'medio',
                'nome': 'Broca do Colmo'
            }
        },
        'feijao': {
            'mosca_branca': {
                'meses': [11, 12, 1, 2],
                'nivel': 'alto',
                'nome': 'Mosca Branca'
            }
        }
    }
    
    pragas_cultura = pragas_sazonais.get(cultura, {})
    
    for praga_id, praga_info in pragas_cultura.items():
        if mes_atual in praga_info['meses']:
            nivel_prioridade = 8 if praga_info['nivel'] == 'alto' else 6
            
            alertas.append({
                'id': f'praga_{praga_id}_{cultura}_{localizacao}',
                'titulo': f'🐛 Alerta: {praga_info["nome"]}',
                'tipo': 'praga',
                'nivel': praga_info['nivel'],
                'prioridade': nivel_prioridade,
                'descricao': f'Época de maior incidência de {praga_info["nome"]} em {cultura}. Monitore sua plantação.',
                'recomendacoes': [
                    'Inspeção diária das plantas',
                    'Aplicação preventiva de controle biológico',
                    'Use nosso detector de pragas por foto'
                ],
                'urgencia': 'alta' if praga_info['nivel'] == 'alto' else 'media',
                'valido_ate': (datetime.now() + timedelta(days=15)).isoformat()
            })
    
    return alertas

def gerar_alertas_mercado(cultura, localizacao):
    """Gerar alertas sobre oportunidades de mercado"""
    alertas = []
    
    # Simulação de dados de mercado
    import random
    variacao_preco = random.uniform(-0.15, 0.20)
    
    if variacao_preco > 0.10:
        alertas.append({
            'id': f'mercado_alta_{cultura}_{localizacao}',
            'titulo': f'📈 Preços de {cultura.title()} em Alta',
            'tipo': 'mercado',
            'nivel': 'baixo',
            'prioridade': 4,
            'descricao': f'Preços de {cultura} subiram {variacao_preco*100:.1f}% em {localizacao}.',
            'recomendacoes': [
                'Considere vender parte da produção',
                'Monitore tendências de preço'
            ],
            'urgencia': 'baixa',
            'valido_ate': (datetime.now() + timedelta(days=7)).isoformat()
        })
    
    return alertas

def gerar_alertas_personalizados(user):
    """Gerar alertas personalizados baseados no perfil do usuário"""
    alertas = []
    
    if hasattr(user, 'culturas_interesse') and user.culturas_interesse:
        for cultura in user.culturas_interesse[:2]:
            alertas.extend(gerar_alertas_plantio(cultura, user.localizacao))
    
    return alertas

# Alert Subscription Views
class AlertSubscriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = AlertSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AlertSubscription.objects.filter(usuario=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Implementar lógica de create-or-update como no frontend
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cultura = serializer.validated_data['cultura']
        regiao = serializer.validated_data['regiao']
        
        # Tentar encontrar assinatura existente
        subscription, created = AlertSubscription.objects.get_or_create(
            usuario=request.user,
            cultura=cultura,
            regiao=regiao,
            defaults=serializer.validated_data
        )
        
        if not created:
            # Atualizar se já existe
            for attr, value in serializer.validated_data.items():
                setattr(subscription, attr, value)
            subscription.save()
        
        response_serializer = self.get_serializer(subscription)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        
        return Response(response_serializer.data, status=status_code)

class AlertSubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AlertSubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AlertSubscription.objects.filter(usuario=self.request.user)
