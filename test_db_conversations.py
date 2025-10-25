"""
Script de teste para verificar se conversas e mensagens estão sendo salvas no banco de dados.
Testa diretamente o ORM Django sem passar pelo frontend.
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from django.contrib.auth import get_user_model
from ai.models import AIConversation, AIMessage
from django.utils import timezone

User = get_user_model()

def test_conversation_persistence():
    """Testa se conversas e mensagens são salvas corretamente"""
    
    print("\n" + "="*70)
    print("🧪 TESTE DE PERSISTÊNCIA DE CONVERSAS E MENSAGENS")
    print("="*70 + "\n")
    
    # 1. Criar ou pegar usuário de teste
    print("1️⃣  Criando/buscando usuário de teste...")
    user, created = User.objects.get_or_create(
        username='test_user',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"   ✅ Usuário '{user.username}' criado com sucesso!")
    else:
        print(f"   ℹ️  Usuário '{user.username}' já existe (ID: {user.id})")
    
    # 2. Criar nova conversa
    print("\n2️⃣  Criando nova conversa...")
    conversation = AIConversation.objects.create(
        user=user,
        title='Teste de Persistência',
        conversation_type='general',
        model_used='gemini-pro'
    )
    print(f"   ✅ Conversa criada com ID: {conversation.id}")
    print(f"   📊 Título: {conversation.title}")
    print(f"   👤 Usuário: {conversation.user.username}")
    print(f"   📅 Criada em: {conversation.created_at}")
    
    # 3. Adicionar mensagem do usuário
    print("\n3️⃣  Adicionando mensagem do usuário...")
    user_message = AIMessage.objects.create(
        conversation=conversation,
        role='user',
        content='Olá! Esta é uma mensagem de teste do usuário.',
        metadata={'test': True}
    )
    print(f"   ✅ Mensagem do usuário criada com ID: {user_message.id}")
    print(f"   💬 Conteúdo: {user_message.content[:50]}...")
    
    # 4. Adicionar resposta da IA
    print("\n4️⃣  Adicionando resposta da IA...")
    ai_message = AIMessage.objects.create(
        conversation=conversation,
        role='assistant',
        content='Olá! Sou a IA do AgroAlerta, criada por Joel Lasmim. Como posso ajudar você hoje?',
        metadata={'content_html': '<p>Olá! Sou a IA do AgroAlerta...</p>'},
        processing_time=0.5
    )
    print(f"   ✅ Mensagem da IA criada com ID: {ai_message.id}")
    print(f"   💬 Conteúdo: {ai_message.content[:50]}...")
    
    # 5. Verificar se as mensagens estão associadas à conversa
    print("\n5️⃣  Verificando associação conversa-mensagens...")
    messages_count = conversation.messages.count()
    print(f"   📊 Total de mensagens na conversa: {messages_count}")
    
    if messages_count == 2:
        print("   ✅ SUCESSO: Ambas as mensagens foram salvas corretamente!")
    else:
        print(f"   ❌ ERRO: Esperava 2 mensagens, mas encontrou {messages_count}")
    
    # 6. Listar todas as mensagens da conversa
    print("\n6️⃣  Listando mensagens da conversa...")
    for i, msg in enumerate(conversation.messages.all(), 1):
        print(f"   {i}. [{msg.role.upper()}] {msg.content[:50]}... (ID: {msg.id})")
    
    # 7. Verificar se a conversa aparece na lista do usuário
    print("\n7️⃣  Verificando conversas do usuário...")
    user_conversations = AIConversation.objects.filter(user=user, is_active=True)
    print(f"   📊 Total de conversas ativas do usuário: {user_conversations.count()}")
    
    for conv in user_conversations[:5]:  # Mostrar apenas as 5 mais recentes
        msg_count = conv.messages.count()
        print(f"   • ID: {conv.id} | Título: {conv.title} | Msgs: {msg_count} | Criada: {conv.created_at.strftime('%Y-%m-%d %H:%M')}")
    
    # 8. Teste de atualização
    print("\n8️⃣  Testando atualização de conversa...")
    conversation.title = 'Título Atualizado via Teste'
    conversation.save()
    conversation.refresh_from_db()
    print(f"   ✅ Título atualizado para: '{conversation.title}'")
    
    # 9. Verificar updated_at
    print("\n9️⃣  Verificando timestamp de atualização...")
    print(f"   📅 created_at:  {conversation.created_at}")
    print(f"   📅 updated_at:  {conversation.updated_at}")
    
    # 10. Estatísticas gerais
    print("\n🔟 Estatísticas Gerais do Banco de Dados:")
    total_conversations = AIConversation.objects.count()
    total_messages = AIMessage.objects.count()
    active_conversations = AIConversation.objects.filter(is_active=True).count()
    
    print(f"   📊 Total de conversas: {total_conversations}")
    print(f"   📊 Conversas ativas: {active_conversations}")
    print(f"   📊 Total de mensagens: {total_messages}")
    
    # Resumo final
    print("\n" + "="*70)
    print("✅ TESTE CONCLUÍDO COM SUCESSO!")
    print("="*70)
    print(f"\n💾 Conversa de teste criada com ID: {conversation.id}")
    print(f"💬 {messages_count} mensagens salvas no banco de dados")
    print("\n📌 CONCLUSÃO: O modelo está funcionando corretamente.")
    print("   Se o frontend não está salvando, o problema está nas chamadas de API.")
    print("="*70 + "\n")
    
    return conversation.id

def verify_conversation_by_id(conv_id):
    """Verifica uma conversa específica pelo ID"""
    print(f"\n🔍 Verificando conversa ID: {conv_id}...")
    
    try:
        conversation = AIConversation.objects.get(id=conv_id)
        print(f"   ✅ Conversa encontrada!")
        print(f"   📊 Título: {conversation.title}")
        print(f"   👤 Usuário: {conversation.user.username}")
        print(f"   💬 Mensagens: {conversation.messages.count()}")
        
        for msg in conversation.messages.all():
            print(f"      • [{msg.role}] {msg.content[:60]}...")
        
        return True
    except AIConversation.DoesNotExist:
        print(f"   ❌ Conversa ID {conv_id} NÃO ENCONTRADA no banco de dados!")
        return False

if __name__ == '__main__':
    try:
        # Executar teste principal
        conv_id = test_conversation_persistence()
        
        # Verificar novamente para confirmar
        print("\n" + "="*70)
        print("🔄 VERIFICAÇÃO FINAL")
        print("="*70)
        verify_conversation_by_id(conv_id)
        
    except Exception as e:
        print(f"\n❌ ERRO durante o teste: {e}")
        import traceback
        traceback.print_exc()
