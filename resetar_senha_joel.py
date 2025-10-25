"""
Script para resetar a senha do usuário joelantonio
"""
import os
import sys
import django

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agroalerta.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'joelantonio'
nova_senha = input(f'Digite a nova senha para {username}: ')

try:
    user = User.objects.get(username=username)
    user.set_password(nova_senha)
    user.save()
    print(f'\n✅ Senha do usuário {username} alterada com sucesso!')
    print(f'\nAgora você pode fazer login em:')
    print(f'http://localhost:3000/login')
    print(f'\nUsuário: {username}')
    print(f'Senha: {nova_senha}')
except User.DoesNotExist:
    print(f'❌ Usuário {username} não encontrado!')
