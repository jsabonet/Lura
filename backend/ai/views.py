from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import F
from django.http import StreamingHttpResponse
import asyncio
import time
import json

from .models import AIConversation, AIMessage, AIUsageStats, AIFeedback
from .serializers import (
    AIConversationSerializer, 
    AIMessageSerializer,
    AIFeedbackSerializer,
    ChatRequestSerializer,
    TextGenerationSerializer,
    AIProxyGenerateSerializer,
    AIProxyChatSerializer
)
from firebase.ai_service import FirebaseAIService
import logging

logger = logging.getLogger(__name__)

def _extract_content_from_result(result: dict) -> str:
    # Support both 'content' (legacy) and 'text' (new) result keys
    if not isinstance(result, dict):
        return ''
    text = result.get('content') or result.get('text') or result.get('message') or ''
    return text


# Rate limiting e App Check decorators
from django.conf import settings
from functools import wraps
from django.core.cache import cache
from rest_framework.exceptions import Throttled
import firebase_admin.app_check

def validate_app_check(view_func):
    """Decorator para validar App Check token do Firebase"""
    @wraps(view_func)
    def wrapper(view, request, *args, **kwargs):
        if not settings.DEBUG and settings.FIREBASE_APP_CHECK_ENABLED:
            token = request.headers.get('X-Firebase-AppCheck')
            if not token:
                return Response(
                    {'error': 'App Check token não fornecido'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            try:
                app = firebase_admin.get_app()
                firebase_admin.app_check.verify_token(token, app)
            except Exception as e:
                return Response(
                    {'error': 'App Check token inválido'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        return view_func(view, request, *args, **kwargs)
    return wrapper

def rate_limit(key_prefix, limit=60, period=60):
    """Decorator para rate limiting baseado em cache"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(view, request, *args, **kwargs):
            if hasattr(request, 'user') and request.user.is_authenticated:
                key = f"rate_limit:{key_prefix}:{request.user.id}"
            else:
                key = f"rate_limit:{key_prefix}:{request.META.get('REMOTE_ADDR')}"
            
            count = cache.get(key, 0)
            if count >= limit:
                raise Throttled(wait=period)
            
            cache.set(key, count + 1, period)
            return view_func(view, request, *args, **kwargs)
        return wrapper
    return decorator


class AIProxyGenerateView(APIView):
    """View para proxy de geração de texto via Firebase AI Logic"""
    permission_classes = [permissions.IsAuthenticated]

    @validate_app_check
    @rate_limit("ai_generate", limit=30, period=60)
    def post(self, request):
        serializer = AIProxyGenerateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ai_service = FirebaseAIService()
        if not ai_service.is_configured:
            return Response(
                {'error': 'Firebase AI não está configurado'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        start_time = time.time()
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                ai_service.generate_text(
                    prompt=serializer.validated_data['prompt'],
                    model_name=serializer.validated_data.get('model', 'gemini-pro')
                )
            )
        finally:
            loop.close()

        processing_time = time.time() - start_time
        
        if result['success']:
            content = _extract_content_from_result(result)
            if not content:
                logger.error('AI generate_text succeeded but returned no content: %s', result)
                return Response({'success': False, 'error': 'Modelo retornou sem conteúdo'}, status=status.HTTP_502_BAD_GATEWAY)
            return Response({
                'success': True,
                'content': content,
                'content_html': result.get('content_html'),
                'model': result.get('model', 'unknown'),
                'usage': result.get('usage', {}),
                'truncated': result.get('truncated', False),
                'finish_reason': result.get('finish_reason'),
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIChatProxyView(APIView):
    """View para proxy de chat via Firebase AI Logic"""
    permission_classes = [permissions.IsAuthenticated]

    @validate_app_check
    @rate_limit("ai_chat", limit=20, period=60)
    def post(self, request):
        serializer = AIProxyChatSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ai_service = FirebaseAIService()
        if not ai_service.is_configured:
            return Response(
                {'error': 'Firebase AI não está configurado'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        start_time = time.time()
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                ai_service.chat_completion(
                    messages=serializer.validated_data['messages']
                )
            )
        finally:
            loop.close()

        processing_time = time.time() - start_time

        if result['success']:
            return Response({
                'success': True,
                'content': result['content'],
                'content_html': result.get('content_html'),
                'model': result.get('model', 'unknown'),
                'conversation_id': result.get('conversation_id'),
                'usage': result.get('usage', {}),
                'truncated': result.get('truncated', False),
                'finish_reason': result.get('finish_reason'),
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AIChatStreamView(APIView):
    """View para chat com streaming em tempo real (Server-Sent Events)"""
    permission_classes = [permissions.IsAuthenticated]
    
    @rate_limit("ai_chat_stream", limit=20, period=60)
    def post(self, request):
        """
        Endpoint de streaming que retorna chunks de texto conforme são gerados
        Usa Server-Sent Events (SSE) para streaming real
        """
        serializer = AIProxyChatSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        ai_service = FirebaseAIService()
        if not ai_service.is_configured:
            return Response(
                {'error': 'Firebase AI não está configurado'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Converter mensagens para prompt (última mensagem do usuário)
        messages = serializer.validated_data['messages']
        if not messages:
            return Response(
                {'error': 'Nenhuma mensagem fornecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Construir contexto do chat
        prompt_parts = []
        for msg in messages[:-1]:  # Todas menos a última
            role = "Assistente" if msg['role'] == 'assistant' else "Usuário"
            prompt_parts.append(f"{role}: {msg['content']}")
        
        # Adicionar a última mensagem (atual)
        last_message = messages[-1]['content']
        if prompt_parts:
            full_prompt = "\n\n".join(prompt_parts) + f"\n\nUsuário: {last_message}\n\nAssistente:"
        else:
            full_prompt = last_message
        
        # Função geradora para o streaming
        async def event_stream():
            """Gera eventos SSE conforme chunks chegam"""
            try:
                async for chunk in ai_service.generate_text_stream(
                    prompt=full_prompt,
                    model_name=serializer.validated_data.get('model', 'gemini-pro')
                ):
                    # Formato SSE: data: {json}\n\n
                    data = json.dumps(chunk, ensure_ascii=False)
                    yield f"data: {data}\n\n"
                    
                    # Se terminou, encerrar stream
                    if chunk.get('done'):
                        break
            
            except Exception as e:
                logger.error(f"Erro no streaming: {e}")
                error_data = json.dumps({
                    'type': 'error',
                    'error': str(e),
                    'done': True
                })
                yield f"data: {error_data}\n\n"
        
        # Função síncrona wrapper para StreamingHttpResponse
        def sync_event_stream():
            """Wrapper síncrono para o async generator"""
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                async_gen = event_stream()
                while True:
                    try:
                        chunk = loop.run_until_complete(async_gen.__anext__())
                        yield chunk
                    except StopAsyncIteration:
                        break
            finally:
                loop.close()
        
        # Retornar resposta de streaming
        response = StreamingHttpResponse(
            sync_event_stream(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'  # Desabilita buffering no nginx
        return response


class AIStatusView(APIView):
    """
    View para verificar status do serviço AI
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        ai_service = FirebaseAIService()
        status_info = ai_service.get_service_status()
        
        return Response({
            'status': 'ok',
            'firebase_ai': status_info,
            'timestamp': timezone.now().isoformat()
        })


class TextGenerationView(APIView):
    """
    View para geração de texto simples
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = TextGenerationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        prompt = serializer.validated_data['prompt']
        model_name = serializer.validated_data.get('model', 'gemini-pro')
        
        # Inicializar serviço AI
        ai_service = FirebaseAIService()
        
        if not ai_service.is_configured:
            return Response({
                'error': 'Firebase AI não está configurado'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Medir tempo de processamento
        start_time = time.time()
        
        # Gerar texto (simular async)
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                ai_service.generate_text(prompt, model_name=model_name)
            )
        finally:
            loop.close()
        
        processing_time = time.time() - start_time
        
        if result['success']:
            # Atualizar estatísticas de uso
            self._update_usage_stats(request.user, processing_time, result.get('usage', {}))

            content = _extract_content_from_result(result)
            if not content:
                logger.error('TextGeneration succeeded but returned no content: %s', result)
                return Response({'success': False, 'error': 'Modelo retornou sem conteúdo'}, status=status.HTTP_502_BAD_GATEWAY)

            return Response({
                'success': True,
                'content': content,
                'model': result.get('model', 'unknown'),
                'usage': result.get('usage', {}),
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _update_usage_stats(self, user, processing_time, usage_info):
        """Atualiza estatísticas de uso do usuário"""
        today = timezone.now().date()
        stats, created = AIUsageStats.objects.get_or_create(
            user=user,
            date=today,
        )
        
        stats.total_requests = F('total_requests') + 1
        stats.general_requests = F('general_requests') + 1
        stats.total_processing_time = F('total_processing_time') + processing_time
        stats.total_tokens_used = F('total_tokens_used') + usage_info.get('completion_tokens', 0)
        stats.save()


class ChatConversationView(APIView):
    """
    View para chat com contexto de conversa
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        conversation_id = serializer.validated_data.get('conversation_id')
        message_content = serializer.validated_data['message']
        conversation_type = serializer.validated_data.get('type', 'general')
        
        # Buscar ou criar conversa
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(
                    id=conversation_id,
                    user=request.user
                )
            except AIConversation.DoesNotExist:
                return Response({
                    'error': 'Conversa não encontrada'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = AIConversation.objects.create(
                user=request.user,
                conversation_type=conversation_type,
                title=message_content[:50] + "..." if len(message_content) > 50 else message_content
            )
        
        # Salvar mensagem do usuário
        user_message = AIMessage.objects.create(
            conversation=conversation,
            role='user',
            content=message_content
        )
        
        # Obter histórico da conversa
        previous_messages = AIMessage.objects.filter(
            conversation=conversation
        ).order_by('timestamp')
        
        messages_for_ai = []
        for msg in previous_messages:
            messages_for_ai.append({
                'role': msg.role,
                'content': msg.content
            })
        
        # Processar com AI
        ai_service = FirebaseAIService()
        start_time = time.time()
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            if conversation_type == 'agriculture':
                result = loop.run_until_complete(
                    ai_service.agriculture_assistant(message_content)
                )
            else:
                result = loop.run_until_complete(
                    ai_service.chat_completion(messages_for_ai)
                )
        finally:
            loop.close()
        
        processing_time = time.time() - start_time
        
        if result['success']:
            # Salvar resposta da AI
            ai_message = AIMessage.objects.create(
                conversation=conversation,
                role='assistant',
                content=result['content'],
                metadata=result.get('metadata', {}),
                token_usage=result.get('usage', {}),
                processing_time=processing_time
            )
            
            # Atualizar conversa
            conversation.updated_at = timezone.now()
            conversation.save()
            
            # Atualizar estatísticas
            self._update_chat_stats(request.user, conversation_type, processing_time, result.get('usage', {}))
            
            return Response({
                'success': True,
                'conversation_id': conversation.id,
                'message_id': ai_message.id,
                'content': result['content'],
                'model': result.get('model', 'gemini-pro'),
                'usage': result.get('usage', {}),
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error'],
                'conversation_id': conversation.id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _update_chat_stats(self, user, conversation_type, processing_time, usage_info):
        """Atualiza estatísticas específicas do chat"""
        today = timezone.now().date()
        stats, created = AIUsageStats.objects.get_or_create(
            user=user,
            date=today,
        )
        
        stats.total_requests = F('total_requests') + 1
        stats.total_processing_time = F('total_processing_time') + processing_time
        stats.total_tokens_used = F('total_tokens_used') + usage_info.get('completion_tokens', 0)
        
        if conversation_type == 'agriculture':
            stats.agriculture_requests = F('agriculture_requests') + 1
        elif conversation_type == 'pest_analysis':
            stats.pest_analysis_requests = F('pest_analysis_requests') + 1
        else:
            stats.general_requests = F('general_requests') + 1
        
        stats.save()


class AgricultureAssistantView(APIView):
    """
    View específica para assistente agrícola
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        query = request.data.get('query', '').strip()
        context = request.data.get('context', {})
        
        if not query:
            return Response({
                'error': 'Query é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        ai_service = FirebaseAIService()
        start_time = time.time()
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                ai_service.agriculture_assistant(query, context)
            )
        finally:
            loop.close()
        
        processing_time = time.time() - start_time
        
        if result['success']:
            self._update_usage_stats(request.user, 'agriculture', processing_time, result.get('usage', {}))
            
            return Response({
                'success': True,
                'advice': result['content'],
                'context': context,
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _update_usage_stats(self, user, request_type, processing_time, usage_info):
        today = timezone.now().date()
        stats, created = AIUsageStats.objects.get_or_create(user=user, date=today)
        
        stats.total_requests = F('total_requests') + 1
        stats.agriculture_requests = F('agriculture_requests') + 1
        stats.total_processing_time = F('total_processing_time') + processing_time
        stats.total_tokens_used = F('total_tokens_used') + usage_info.get('completion_tokens', 0)
        stats.save()


class PestAnalysisView(APIView):
    """
    View para análise de pragas e doenças
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        description = request.data.get('description', '').strip()
        crop_type = request.data.get('crop_type')
        symptoms = request.data.get('symptoms', [])
        
        if not description:
            return Response({
                'error': 'Descrição é obrigatória'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        ai_service = FirebaseAIService()
        start_time = time.time()
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(
                ai_service.pest_disease_analysis(description, crop_type, symptoms)
            )
        finally:
            loop.close()
        
        processing_time = time.time() - start_time
        
        if result['success']:
            self._update_usage_stats(request.user, processing_time, result.get('usage', {}))
            
            return Response({
                'success': True,
                'analysis': result['content'],
                'input': {
                    'description': description,
                    'crop_type': crop_type,
                    'symptoms': symptoms
                },
                'processing_time': processing_time
            })
        else:
            return Response({
                'success': False,
                'error': result['error']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _update_usage_stats(self, user, processing_time, usage_info):
        today = timezone.now().date()
        stats, created = AIUsageStats.objects.get_or_create(user=user, date=today)
        
        stats.total_requests = F('total_requests') + 1
        stats.pest_analysis_requests = F('pest_analysis_requests') + 1
        stats.total_processing_time = F('total_processing_time') + processing_time
        stats.total_tokens_used = F('total_tokens_used') + usage_info.get('completion_tokens', 0)
        stats.save()


class ConversationListView(generics.ListAPIView):
    """
    Listar conversas do usuário
    """
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AIConversation.objects.filter(
            user=self.request.user,
            is_active=True
        ).prefetch_related('messages')


class ConversationDetailView(generics.RetrieveAPIView):
    """
    Detalhe de uma conversa específica
    """
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AIConversation.objects.filter(
            user=self.request.user
        ).prefetch_related('messages')


class AIFeedbackView(APIView):
    """
    View para feedback sobre respostas da AI
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = AIFeedbackSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        message_id = serializer.validated_data['message_id']
        
        try:
            ai_message = AIMessage.objects.get(
                id=message_id,
                conversation__user=request.user,
                role='assistant'
            )
        except AIMessage.DoesNotExist:
            return Response({
                'error': 'Mensagem não encontrada'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Criar ou atualizar feedback
        feedback, created = AIFeedback.objects.update_or_create(
            message=ai_message,
            user=request.user,
            defaults={
                'rating': serializer.validated_data['rating'],
                'comment': serializer.validated_data.get('comment', ''),
                'is_helpful': serializer.validated_data['is_helpful'],
                'is_accurate': serializer.validated_data['is_accurate'],
            }
        )
        
        return Response({
            'success': True,
            'feedback_id': feedback.id,
            'created': created
        })


class UsageStatsView(APIView):
    """
    View para estatísticas de uso do usuário
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Últimos 30 dias
        from datetime import datetime, timedelta
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        stats = AIUsageStats.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('-date')
        
        total_stats = {
            'total_requests': sum(s.total_requests for s in stats),
            'total_tokens': sum(s.total_tokens_used for s in stats),
            'total_conversations': sum(s.total_conversations for s in stats),
            'total_processing_time': sum(s.total_processing_time for s in stats),
            'agriculture_requests': sum(s.agriculture_requests for s in stats),
            'pest_analysis_requests': sum(s.pest_analysis_requests for s in stats),
            'general_requests': sum(s.general_requests for s in stats),
        }
        
        daily_stats = []
        for stat in stats:
            daily_stats.append({
                'date': stat.date.isoformat(),
                'requests': stat.total_requests,
                'tokens': stat.total_tokens_used,
                'conversations': stat.total_conversations,
                'processing_time': stat.total_processing_time,
                'by_type': {
                    'agriculture': stat.agriculture_requests,
                    'pest_analysis': stat.pest_analysis_requests,
                    'general': stat.general_requests,
                }
            })
        
        return Response({
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            },
            'total': total_stats,
            'daily': daily_stats
        })
