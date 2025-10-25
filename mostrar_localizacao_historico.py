"""
Script para mostrar EXATAMENTE onde os históricos de conversas estão sendo salvos.
Exibe informações detalhadas sobre banco de dados, tabelas e dados.
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from django.conf import settings
from ai.models import AIConversation, AIMessage
from django.contrib.auth import get_user_model

User = get_user_model()

def show_storage_location():
    """Mostra onde os dados estão sendo salvos"""
    
    print("\n" + "="*70)
    print("📍 LOCALIZAÇÃO DO ARMAZENAMENTO DE HISTÓRICO DE CONVERSAS")
    print("="*70 + "\n")
    
    # 1. Configuração do Banco de Dados
    print("1️⃣  BANCO DE DADOS")
    print("-" * 70)
    db_config = settings.DATABASES['default']
    
    print(f"   Motor: {db_config['ENGINE']}")
    print(f"   Nome do Banco: {db_config['NAME']}")
    print(f"   Host: {db_config['HOST']}")
    print(f"   Porta: {db_config['PORT']}")
    print(f"   Usuário: {db_config['USER']}")
    
    if 'postgresql' in db_config['ENGINE']:
        print(f"\n   💾 Tipo: PostgreSQL")
        print(f"   📂 Localização física: Gerenciado pelo PostgreSQL em:")
        print(f"      • Windows: C:\\Program Files\\PostgreSQL\\<versão>\\data\\")
        print(f"      • Linux: /var/lib/postgresql/<versão>/main/")
        print(f"      • macOS: /usr/local/var/postgres/")
    elif 'sqlite' in db_config['ENGINE']:
        print(f"\n   💾 Tipo: SQLite")
        print(f"   📂 Arquivo: {db_config['NAME']}")
    
    # 2. Tabelas Específicas
    print("\n2️⃣  TABELAS QUE ARMAZENAM AS CONVERSAS")
    print("-" * 70)
    print(f"   • Tabela de Conversas: 'ai_aiconversation'")
    print(f"   • Tabela de Mensagens: 'ai_aimessage'")
    print(f"   • Tabela de Usuários: 'users_usuario' ou 'auth_user'")
    
    # 3. Estatísticas
    print("\n3️⃣  ESTATÍSTICAS DO BANCO DE DADOS")
    print("-" * 70)
    
    total_users = User.objects.count()
    total_conversations = AIConversation.objects.count()
    total_messages = AIMessage.objects.count()
    active_conversations = AIConversation.objects.filter(is_active=True).count()
    
    print(f"   👥 Total de Usuários: {total_users}")
    print(f"   💬 Total de Conversas: {total_conversations}")
    print(f"   📝 Total de Mensagens: {total_messages}")
    print(f"   ✅ Conversas Ativas: {active_conversations}")
    
    # 4. Últimas Conversas (por usuário)
    print("\n4️⃣  ÚLTIMAS CONVERSAS SALVAS (por usuário)")
    print("-" * 70)
    
    users_with_convs = User.objects.filter(ai_conversations__isnull=False).distinct()
    
    for user in users_with_convs[:5]:  # Mostrar apenas 5 usuários
        user_convs = AIConversation.objects.filter(user=user).order_by('-updated_at')[:3]
        print(f"\n   👤 Usuário: {user.username} ({user.email})")
        print(f"      Total de conversas: {AIConversation.objects.filter(user=user).count()}")
        
        for conv in user_convs:
            msg_count = conv.messages.count()
            print(f"      • ID {conv.id}: \"{conv.title}\" ({msg_count} mensagens)")
            print(f"        Criada: {conv.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"        Atualizada: {conv.updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 5. Exemplo de Conversa Completa
    print("\n5️⃣  EXEMPLO DE CONVERSA COMPLETA")
    print("-" * 70)
    
    last_conv = AIConversation.objects.filter(messages__isnull=False).order_by('-updated_at').first()
    
    if last_conv:
        print(f"   Conversa ID: {last_conv.id}")
        print(f"   Título: {last_conv.title}")
        print(f"   Usuário: {last_conv.user.username}")
        print(f"   Tipo: {last_conv.conversation_type}")
        print(f"   Modelo: {last_conv.model_used}")
        print(f"\n   Mensagens:")
        
        for i, msg in enumerate(last_conv.messages.all(), 1):
            role_emoji = "👤" if msg.role == "user" else "🤖"
            content_preview = msg.content[:60] + "..." if len(msg.content) > 60 else msg.content
            print(f"      {i}. {role_emoji} [{msg.role.upper()}] {content_preview}")
            print(f"         Timestamp: {msg.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
    else:
        print("   Nenhuma conversa com mensagens encontrada.")
    
    # 6. Como Acessar os Dados
    print("\n6️⃣  COMO ACESSAR OS DADOS")
    print("-" * 70)
    print("""
   📌 Via Django Admin:
      1. Vá para: http://localhost:8000/admin/
      2. Login com superusuário
      3. Navegue: AI > Conversas AI / Mensagens AI
   
   📌 Via PostgreSQL (linha de comando):
      # Conectar ao banco
      psql -h localhost -U postgres -d agroalerta
      
      # Ver conversas
      SELECT * FROM ai_aiconversation ORDER BY updated_at DESC LIMIT 5;
      
      # Ver mensagens de uma conversa
      SELECT * FROM ai_aimessage WHERE conversation_id = 1;
   
   📌 Via Django Shell:
      python manage.py shell
      >>> from ai.models import AIConversation, AIMessage
      >>> AIConversation.objects.all()
      >>> AIMessage.objects.filter(conversation_id=1)
   
   📌 Via API REST:
      GET http://localhost:8000/api/ai/conversations/
      (Requer autenticação: Bearer token)
    """)
    
    # 7. Estrutura de Armazenamento
    print("\n7️⃣  ESTRUTURA DE ARMAZENAMENTO")
    print("-" * 70)
    print("""
   📊 Hierarquia:
   
   ┌─ Banco de Dados: agroalerta (PostgreSQL)
   │
   ├─ Tabela: ai_aiconversation
   │  ├─ Campos: id, user_id, title, conversation_type, model_used
   │  ├─ Datas: created_at, updated_at
   │  └─ Status: is_active
   │
   └─ Tabela: ai_aimessage
      ├─ Campos: id, conversation_id (FK), role, content
      ├─ Metadados: metadata (JSON), token_usage (JSON)
      ├─ Performance: processing_time
      └─ Data: timestamp
   
   🔗 Relacionamento:
      AIConversation (1) ──→ (N) AIMessage
      User (1) ──→ (N) AIConversation
    """)
    
    # 8. Caminho de Backup
    print("\n8️⃣  BACKUP E PERSISTÊNCIA")
    print("-" * 70)
    print(f"""
   💾 Os dados estão salvos PERMANENTEMENTE no PostgreSQL
   
   📂 Localização do banco PostgreSQL:
      Host: {db_config['HOST']}
      Porta: {db_config['PORT']}
      Banco: {db_config['NAME']}
   
   🔒 Persistência:
      ✅ Sobrevive a reinicializações do servidor
      ✅ Sobrevive a reinicializações do navegador
      ✅ Acessível de múltiplos dispositivos
      ✅ Sincronizado em tempo real
   
   ⚠️  NÃO está salvo em:
      ❌ localStorage do navegador
      ❌ Sessões temporárias
      ❌ Cache do navegador
      ❌ Cookies
    """)
    
    print("="*70)
    print("✅ RESUMO: Histórico salvo em PostgreSQL (banco 'agroalerta')")
    print("="*70 + "\n")

if __name__ == '__main__':
    try:
        show_storage_location()
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
