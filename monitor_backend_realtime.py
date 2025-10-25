"""
Monitor em tempo real do backend Django
Mostra requisições recebidas e dados salvos no banco
"""
import os
import sys
import django
import time
from datetime import datetime

# Configurar Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from ai.models import AIConversation, AIMessage
from django.contrib.auth import get_user_model

User = get_user_model()

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def monitor_database():
    """Monitora mudanças no banco de dados em tempo real"""
    
    print("="*80)
    print("🔍 MONITOR EM TEMPO REAL - BACKEND AGROALERTA")
    print("="*80)
    print("Monitorando salvamento de conversas e mensagens...")
    print("Pressione Ctrl+C para parar\n")
    
    last_conv_count = AIConversation.objects.count()
    last_msg_count = AIMessage.objects.count()
    last_conv_id = None
    last_msg_id = None
    
    if last_conv_count > 0:
        last_conv = AIConversation.objects.latest('created_at')
        last_conv_id = last_conv.id
    
    if last_msg_count > 0:
        last_msg = AIMessage.objects.latest('timestamp')
        last_msg_id = last_msg.id
    
    print(f"📊 Estado inicial:")
    print(f"   Conversas: {last_conv_count}")
    print(f"   Mensagens: {last_msg_count}")
    print(f"\n{'='*80}\n")
    
    check_count = 0
    
    try:
        while True:
            check_count += 1
            current_time = datetime.now().strftime('%H:%M:%S')
            
            # Contar conversas e mensagens atuais
            current_conv_count = AIConversation.objects.count()
            current_msg_count = AIMessage.objects.count()
            
            # Detectar novas conversas
            if current_conv_count > last_conv_count:
                new_convs = AIConversation.objects.filter(id__gt=last_conv_id) if last_conv_id else []
                
                for conv in new_convs:
                    print(f"\n{'='*80}")
                    print(f"🆕 [{current_time}] NOVA CONVERSA CRIADA!")
                    print(f"{'='*80}")
                    print(f"   ID: {conv.id}")
                    print(f"   Título: {conv.title}")
                    print(f"   Usuário: {conv.user.username}")
                    print(f"   Tipo: {conv.conversation_type}")
                    print(f"   Modelo: {conv.model_used}")
                    print(f"   Criada em: {conv.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
                    print(f"{'='*80}\n")
                    
                    last_conv_id = conv.id
                
                last_conv_count = current_conv_count
            
            # Detectar novas mensagens
            if current_msg_count > last_msg_count:
                new_msgs = AIMessage.objects.filter(id__gt=last_msg_id) if last_msg_id else []
                
                for msg in new_msgs:
                    role_emoji = "👤" if msg.role == "user" else "🤖"
                    content_preview = msg.content[:100] + "..." if len(msg.content) > 100 else msg.content
                    
                    print(f"\n{'='*80}")
                    print(f"💾 [{current_time}] NOVA MENSAGEM SALVA!")
                    print(f"{'='*80}")
                    print(f"   ID: {msg.id}")
                    print(f"   Conversa: #{msg.conversation.id} - {msg.conversation.title}")
                    print(f"   Usuário: {msg.conversation.user.username}")
                    print(f"   Role: {role_emoji} {msg.role}")
                    print(f"   Conteúdo: {content_preview}")
                    print(f"   Timestamp: {msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
                    
                    if msg.metadata:
                        print(f"   Metadados: {msg.metadata}")
                    
                    if msg.token_usage:
                        print(f"   Tokens: {msg.token_usage}")
                    
                    print(f"{'='*80}\n")
                    
                    last_msg_id = msg.id
                
                last_msg_count = current_msg_count
            
            # Status silencioso (apenas ponto)
            if check_count % 10 == 0:
                print(f"[{current_time}] ⏳ Aguardando atividade... (Conversas: {current_conv_count}, Mensagens: {current_msg_count})", end='\r')
            
            time.sleep(2)  # Verificar a cada 2 segundos
            
    except KeyboardInterrupt:
        print(f"\n\n{'='*80}")
        print("🛑 Monitor interrompido pelo usuário")
        print(f"{'='*80}")
        print(f"\n📊 Estatísticas finais:")
        print(f"   Total de conversas: {AIConversation.objects.count()}")
        print(f"   Total de mensagens: {AIMessage.objects.count()}")
        
        # Mostrar últimas 3 conversas
        print(f"\n📚 Últimas 3 conversas:")
        for conv in AIConversation.objects.order_by('-created_at')[:3]:
            msg_count = conv.messages.count()
            print(f"   • ID {conv.id}: {conv.title} ({msg_count} mensagens) - {conv.user.username}")
        
        print(f"\n{'='*80}\n")

if __name__ == '__main__':
    try:
        monitor_database()
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
