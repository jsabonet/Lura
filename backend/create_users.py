"""
Script simplificado para criar dados de teste do AgroAlerta
"""
import os
import sys
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Configurar o Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from users.models import User, PerfilAgricultor

def create_test_users():
    print("🌱 Criando usuários de teste para AgroAlerta...")
    
    # Verificar se já existem usuários
    if User.objects.filter(username='jose_farmer').exists():
        print("❌ Usuários já existem. Pulando criação...")
        return
    
    # Farmer 1
    farmer1 = User.objects.create_user(
        username='jose_farmer',
        email='jose@fazenda.com',
        password='password123',
        first_name='José',
        last_name='Maputo',
        telefone='+258843123456',
        tipo_usuario='agricultor',
        localizacao='Maputo',
        provincia='Maputo',
        distrito='Maputo',
        culturas_interesse=['milho', 'feijao', 'tomate'],
        receber_sms=True,
        receber_whatsapp=True
    )
    
    farmer1_profile = PerfilAgricultor.objects.create(
        user=farmer1,
        tamanho_propriedade=5.5,
        tipo_agricultura='subsistencia',
        experiencia_anos=10,
        tem_irrigacao=True
    )
    
    # Farmer 2
    farmer2 = User.objects.create_user(
        username='maria_farmer',
        email='maria@agricultura.com',
        password='password123',
        first_name='Maria',
        last_name='Beira',
        telefone='+258841987654',
        tipo_usuario='agricultor',
        localizacao='Beira',
        provincia='Sofala',
        distrito='Beira',
        culturas_interesse=['arroz', 'cana_acucar', 'mandioca'],
        receber_sms=True,
        receber_whatsapp=True
    )
    
    farmer2_profile = PerfilAgricultor.objects.create(
        user=farmer2,
        tamanho_propriedade=12.0,
        tipo_agricultura='comercial',
        experiencia_anos=15,
        tem_irrigacao=True
    )
    
    # Técnico agrícola
    tecnico = User.objects.create_user(
        username='carlos_tecnico',
        email='carlos@agricultura.gov.mz',
        password='password123',
        first_name='Carlos',
        last_name='Silva',
        telefone='+258847654321',
        tipo_usuario='tecnico',
        localizacao='Nampula',
        provincia='Nampula',
        distrito='Nampula'
    )
    
    print("✅ Usuários de teste criados com sucesso!")
    print(f"👥 {User.objects.count()} usuários no total")
    print(f"🚜 {PerfilAgricultor.objects.count()} perfis de agricultor")
    
    print("\\n📋 Usuários criados:")
    for user in User.objects.all():
        print(f"  - {user.username} ({user.first_name} {user.last_name}) - {user.get_tipo_usuario_display()}")

if __name__ == '__main__':
    create_test_users()
