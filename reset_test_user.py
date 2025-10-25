"""
Script para resetar a senha do usuário de teste
"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("🔑 Resetando senha do usuário test_user...")

try:
    user = User.objects.get(username='test_user')
    user.set_password('testpass123')
    user.save()
    print(f"✅ Senha resetada com sucesso para o usuário '{user.username}'")
    print(f"   Username: test_user")
    print(f"   Password: testpass123")
except User.DoesNotExist:
    print("❌ Usuário test_user não encontrado. Criando...")
    user = User.objects.create_user(
        username='test_user',
        email='test@example.com',
        password='testpass123',
        first_name='Test',
        last_name='User'
    )
    print(f"✅ Usuário criado com sucesso!")
    print(f"   Username: test_user")
    print(f"   Password: testpass123")
